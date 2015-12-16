import * as $tools from "./c-tools-0.js";
import * as $print from "./c-print-0.js";
import * as $lex from "./c-lex-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

export class Node {
    constructor(obj) {
        if (obj !== undefined && obj !== null) {
            Object.keys(obj).forEach(key => {
                this[key] = obj[key];
            });
        }
    }

    setParent(node) {
        this._parent = node;
    }

    // Takes 0, 1, or 2 arguments.
    // If no argument, then returns the parent.
    // If 1 argument, it can be a type, or a selector function. Returns the ancestor matching it.
    // If 2 arguments, and the second argument is `true`, it will return all ancestors from
    // this node (excluding) through the matching ancestor (including) in an array. Setting the
    // second argument to false is equal to the 1-argument syntax.
    // TODO: The functionality doesn't fully match the method name. Need refactor.
    getParent() {
        let arg = arguments[0];
        let returnsArray = arguments[1] === true ? true : false;
        if (arg === undefined) {
            return this._parent;
        }
        else if (typeof arg === "function") {
            let next = this._parent;
            let stack = [next];
            while (next !== null && !($tools.classIsClass(arg, Node) ? next instanceof arg : arg(next))) {
                next = next._parent;
                stack.push(next);
            }
            return returnsArray ? stack : next;
        }
        else {
            throw new Error("Argument invalid.");
        }
    }

    getRoot() {
        let next = this;
        while (next._parent !== null) {
            next = next._parent;
        }
        return next;
    }

    toString(level = 0) {
        return $print.printObject(this, this.constructor, level);
    }
}

export class MappableNode extends Node {
    setLexPart(lexPart) {
        this._lexPart = lexPart;
        return this;
    }

    getLexPart() {
        return this._lexPart;
    }
}

// Piece is not an expression, statement or block. It's a simple node that
// the source and the compiled code look the same (unless renamed to avoid conflict).
export class Piece extends MappableNode {
    constructor() {
        super();
        let arg = arguments[0];
        if (typeof arg === "string") {
            this.value = arg;
        }
        else if (arg instanceof $lex.LexPart) {
            if (arg.token() instanceof $lex.InlineNormalString) {
                this.value = "\"" + arg.lex.at(arg.startIndex + 2).value + "\"";
            }
            else {
                this.value = arg.token().value;
            }
            this.setLexPart(arg);
        }
    }

    compile() {
        return new J(this.value).shareLexPart(this);
    }

    toString() {
        return $print.printAtom(this);
    }
}

export class Arr extends Node {
    constructor(value) {
        super();
        this.value = value;
    }

    toString(level = 0) {
        return $print.printArray(this.value, this.constructor, level);
    }
}

export class Xy extends Node {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }
}

export class LocalVariable extends Piece {}

export class VariableAssignee extends Node {
    // `obj` has 4 properties: variable, export, ifvoid, ifnull. Only `variable` is mandatory,
    // others are all optional defaulting to `false`.
    constructor(obj) {
        if (obj.export === undefined) {
            obj.export = false;
        }
        if (obj.ifvoid === undefined) {
            obj.ifvoid = false;
        }
        if (obj.ifnull === undefined) {
            obj.ifnull = false;
        }
        super(obj);
    }
}

export class DotAssignee extends Node {
    // `obj` has 5 properties: x, y, export, ifvoid, ifnull. `x` and `y` are mandatory,
    // others are all optional defaulting to `false`.
    constructor(obj) {
        if (obj.export === undefined) {
            obj.export = false;
        }
        if (obj.ifvoid === undefined) {
            obj.ifvoid = false;
        }
        if (obj.ifnull === undefined) {
            obj.ifnull = false;
        }
        super(obj);
    }
}

export class BracketAssignees extends Arr {}

export class ArrowArgument extends Node {
    // `obj` has 3 properties: variable, voidDefault, nullDefault. Only `variable` is mandatory,
    // others are all optional defaulting to `null`.
    constructor(obj) {
        if (obj.voidDefault === undefined) {
            obj.voidDefault = null;
        }
        if (obj.nullDefault === undefined) {
            obj.nullDefault = null;
        }
        super(obj);
    }
}

export class MemberKey extends Node {
    // `obj` has 5 properties: name, new, static, get, set. All are optional.
    // `name` defaults to `null`. Others defaults to `false`.
    constructor(obj) {
        if (obj.name === undefined) {
            obj.name = null;
        }
        if (obj.new === undefined) {
            obj.new = false;
        }
        if (obj.static === undefined) {
            obj.static = false;
        }
        if (obj.get === undefined) {
            obj.get = false;
        }
        if (obj.set === undefined) {
            obj.set = false;
        }
        super(obj);
    }
}

export class SymbolMemberName extends Piece {}

export class OrPattern extends Arr {}

export class AndPattern extends Arr {}
