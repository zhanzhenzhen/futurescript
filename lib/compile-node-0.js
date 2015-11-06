import * as $print from "../lib/compile-print-0";

export class Node {
    setParent(node) {
        this._parent = node;
    }

    getParent() {
        return this._parent;
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

export class AtomNode extends Node {
    constructor(value) {
        super();
        this.value = value;
    }

    toString() {
        return $print.printAtom(this);
    }
}
