import * as $tools from "./c-tools-0";

export class JsBuilder {
    // Form 1: a single string argument
    // Form 2: 1 or 2 arguments, where the first is an array
    // In form 2, the second argument (if exists) is a string
    // that brings "join" effect. Each element of the array must be either string
    // or JsBuilder instance.
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
                if (arguments[0].length > 0) {
                    t.push(arguments[0][arguments[0].length - 1]);
                }
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
        this.position = 0;
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

    allMappableJsBuilders() {
        let r = [];
        let traverse = thing => {
            if (thing.children.length === 1 && typeof thing.children[0] === "string") {
                r.push(thing);
            }
            thing.childJsBuilders().forEach(child => {
                traverse(child);
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
        this.allMappableJsBuilders().filter(m => m.getLexPart()).forEach(jb => {
            let sum = jb.position;
            jb.ancestors().forEach(ancestor => sum += ancestor.position);
            r.push({
                jsStartIndex: sum,
                jsEndIndex: sum + jb.js.length - 1,
                lexPart: jb.getLexPart()
            });
        });
        return r;
    }

    // Because our JS output is always one-line, we don't need the ";" in source map.
    generateSourceMap() {
        let lexMap = this.generateLexMap();
        let lexes = $tools.distinct(lexMap.map(m => m.lexPart.lex));
        lexes.forEach((lex, index) => {
            lexMap.forEach(mapItem => {
                if (mapItem.lexPart.lex === lex) {
                    mapItem.lexIndex = index; // this property is redundant, just for assistance
                }
            });
        });
        let lastJsStartIndex = 0;
        let lastLexIndex = 0;
        let lastRawLine = 0;
        let lastRawColumn = 0;
        let mappings = lexMap.filter(m => {
            return m.lexPart.token().rawStartIndex !== undefined;
        }).map(m => {
            let lineColumn = m.lexPart.lex.rawLineColumn(m.lexPart.token().rawStartIndex);
            let r = (
                JsBuilder._encodeVlq(m.jsStartIndex - lastJsStartIndex) +
                JsBuilder._encodeVlq(m.lexIndex - lastLexIndex) +
                JsBuilder._encodeVlq(lineColumn[0] - lastRawLine) +
                JsBuilder._encodeVlq(lineColumn[1] - lastRawColumn)
            );
            lastJsStartIndex = m.jsStartIndex;
            lastLexIndex = m.lexIndex;
            lastRawLine = lineColumn[0];
            lastRawColumn = lineColumn[1];
            return r;
        });
        return JSON.stringify({
            version: 3,
            sources: lexes.map(m => m.path),
            names: [],
            mappings: mappings.join(",")
        });
    }

    // `_encodeVlq` is translated from coffeescript/src/sourcemap.litcoffee
    // Copyright (c) Jeremy Ashkenas
    // MIT License
    static _encodeVlq(value) {
        let answer = "";
        let signBit = value < 0 ? 1 : 0;
        let valueToEncode = (Math.abs(value) << 1) + signBit;
        while (valueToEncode || !answer) {
            let nextChunk = valueToEncode & 31;
            valueToEncode = valueToEncode >> 5;
            if (valueToEncode) {
                nextChunk |= 32;
            }
            answer += this._encodeBase64(nextChunk);
        }
        return answer;
    }

    // `_encodeBase64` is translated from coffeescript/src/sourcemap.litcoffee
    // Copyright (c) Jeremy Ashkenas
    // MIT License
    static _encodeBase64(value) {
        let char = this.BASE64_CHARS[value];
        if (!char) {
            throw new Error("Cannot encode Base64.");
        }
        return char;
    }
}

JsBuilder.BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
