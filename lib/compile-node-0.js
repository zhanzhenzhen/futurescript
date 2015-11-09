import * as $print from "../lib/compile-print-0";

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

    getParent(type) {
        if (type === undefined) {
            return this._parent;
        }
        else {
            let next = this._parent;
            while (next !== null && !(next instanceof type)) {
                next = next._parent;
            }
            return next;
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

export class VariableAssignee extends Node {}

export class DotAssignee extends Node {}

export class BracketAssignee extends Node {}
