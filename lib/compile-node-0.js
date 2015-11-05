import * as $print from "../lib/compile-print-0";

export class Node {
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

export class NameValue extends Node {
    constructor(name, value) {
        super();
        this.name = name;
        this.value = value;
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
