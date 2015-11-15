export class JsBuilder {
    // Form 1: a single string argument
    // Form 2: 1 or 2 arguments, where the first is an array
    // In form 1, it's leaf.
    // In form 2, it's not leaf and the second argument (if exists) is a string
    // that brings "join" effect. The array can't be empty. Each element of the array
    // must be either string or JsBuilder instance.
    // Only leaves can be source mapped (after lex part is set).
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
            this.children.forEach(m => m.parent = this);
            let js = "";
            this.children.forEach(child => {
                child.position = js.length; // the child's JS string position in its parent string
                js += child.js;
            });
            this.js = js;
        }
        else {
            this.children = [];
            this.js = arguments[0];
        }
        this.parent = null;
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
        this.setLexPart(mappableNode.getLexPart());
    }

    leaves() {
        let r = [];
        let traverse = thing => {
            thing.children.forEach(child => {
                if (child.children.length === 0) {
                    r.push(child);
                }
                else {
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

    leafToLexMap() {
        let r = [];
        this.leaves().filter(leaf => leaf.getLexPart()).forEach(leaf => {
            let sum = 0;
            leaf.ancestors().forEach(ancestor => sum += ancestor.position);
            r.push({
                jsStartIndex: sum,
                jsEndIndex: sum + leaf.js.length - 1,
                lexPart: leaf.getLexPart()
            });
        });
        return r;
    }
}
