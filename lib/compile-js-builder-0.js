export class JsBuilder {
    // Form 1: a single string argument
    // Form 2: 1 or 2 arguments, where the first is an array
    // In form 2, the second argument (if exists) is a string
    // that brings "join" effect. The array can't be empty. Each element of the array
    // must be either string or JsBuilder instance.
    // Note: Using an array argument whose only element is a string will be treated as
    // identical to form 1.
    constructor() {
        if (Array.isArray(arguments[0])) {
            if (arguments.length === 1) {
                this.children = arguments[0];
            }
            else {
                let t = [];
                for (let i = 0; i < arguments[0].length - 1; i++) {
                    t.push(arguments[0][i]);
                    t.push(arguments[1]);
                }
                t.push(arguments[arguments.length - 1]);
                this.children = t;
            }
            let childJsBuilders = this.childJsBuilders();
            childJsBuilders.forEach(m => m.parent = this);
            let js = "";
            this.children.forEach(child => {
                if (child instanceof JsBuilder) {
                    child.position = js.length; // the child's JS string position in its parent string
                    js += child.js;
                }
                else if (typeof child === "string") {
                    js += child;
                }
                else {
                    throw new Error("Child can only be string or JsBuilder instance.");
                }
            });
            this.js = js;
        }
        else {
            this.children = [arguments[0]];
            this.js = arguments[0];
        }
        this.parent = null;
    }

    childJsBuilders() {
        return this.children.filter(m => m instanceof JsBuilder);
    }

    setLexPart(lexPart) {
        this._lexPart = lexPart;
        return this;
    }

    getLexPart() {
        return this._lexPart;
    }

    // Share the same lex part with the given mappable node
    shareLexPart(mappableNode) {
        return this.setLexPart(mappableNode.getLexPart());
    }

    mappableDescendants() {
        let r = [];
        let traverse = thing => {
            thing.childJsBuilders().forEach(child => {
                if (child.children.length === 1 && typeof child.children[0] === "string") {
                    r.push(child);
                }
                else if (child instanceof JsBuilder) {
                    traverse(child);
                }
            });
        };
        traverse(this);
        return r;
    }

    ancestors() {
        let r = [];
        let next = this.parent;
        while (next !== null) {
            r.push(next);
            next = next.parent;
        }
        return r;
    }

    generateLexMap() {
        let r = [];
        this.mappableDescendants().filter(m => m.getLexPart()).forEach(jb => {
            let sum = 0;
            jb.ancestors().forEach(ancestor => sum += ancestor.position);
            r.push({
                jsStartIndex: sum,
                jsEndIndex: sum + jb.js.length - 1,
                lexPart: jb.getLexPart()
            });
        });
        return r;
    }
}
