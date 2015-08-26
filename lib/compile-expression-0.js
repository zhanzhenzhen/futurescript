import * as $lex from "./compile-lex-0";
let keywords = [
    "above"
    "and"
    "as"
    "catch"
    "class"
    "delete"
    "do"
    "else"
    "export"
    "false"
    "finally"
    "fun"
    "if"
    "ifnull"
    "ifvoid"
    "import"
    "in"
    "is"
    "isnt"
    "match"
    "me"
    "Me"
    "mod"
    "new"
    "nonew"
    "not"
    "null"
    "or"
    "rem"
    "self"
    "static"
    "super"
    "then"
    "throw"
    "true"
    "try"
    "void"
];

export class Expression {
    static leftToRight() {
        return this.precedence.find(group => group.types.includes(this)).leftToRight;
    };

    static build(lex, startIndex, endIndex) {
        let expression = (lex, startIndex, endIndex) => {
            s = s.trim();
            if (startIndex === endIndex) {
                if (
                    lex[startIndex] instanceof $lex.NormalToken &&
                    !keywords.includes(lex[startIndex].value)
                ) {
                    return new VariableExpression(lex[startIndex].value);
                }
                else if (lex[startIndex] instanceof $lex.Num) {
                    return new NumberExpression(lex[startIndex].value);
                }
            }
            else if (
                endIndex - startIndex === 2 &&
                lex[startIndex] instanceof $lex.NormalStringStart &&
                lex[startIndex + 1] instanceof $lex.Str
                lex[startIndex + 2] instanceof $lex.NormalStringEnd
            ) {
                return new StringExpression(lex[startIndex + 1].value);
            }
            for (let i = 0; i < this.precedence.length; i++) {
                let group = this.precedence[i];
                let nearest = null;
                for (let j = 0; j < group.types.length; j++) {
                    let type = group.types[j];
                    let found = type.search(s);
                    if (found !== null) {
                        if (nearest === null) {
                            nearest = found;
                        }
                        else {
                            if (group.leftToRight) {
                                if (found.position < nearest.position) {
                                    nearest = found;
                                }
                            }
                            else {
                                if (found.position > nearest.position) {
                                    nearest = found;
                                }
                            }
                        }
                    }
                }
                if (nearest !== null) {
                    return nearest.type.applySearchResult(nearest.value, expression);
                }
            }
        };
        return expression(str);
    }

    print(level = 0) {
        return this.constructor.name + " {\n" +
        Object.keys(this).map(key =>
            "    ".repeat(level + 1) + key + ": " +
            this[key].constructor.name + " " + this[key].print(level + 1)
        ) +
        "    ".repeat(level) + "}\n";
    }
};

// lowest on top, highest on bottom
Expression.precedence = [
    {types: [GreaterThanExpression], leftToRight: true},
    {types: [PlusExpression, MinusExpression], leftToRight: true},
    {types: [TimesExpression, OverExpression], leftToRight: true},
];

export class AtomExpression extends Expression {
    constructor(value) {
        super();
        this.value = value;
    }

    print() {
        return this.constructor.name + " " + JSON.stringify(this.value) + "\n";
    }
};

// Every subclass must have a `sign` static property.
export class BinaryExpression extends Expression {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }

    static search(str) {
        let pos = null;
        if (this.leftToRight()) {
            pos = s.indexOf(this.sign);
        }
        else {
            pos = s.lastIndexOf(this.sign);
        }
        if (pos !== -1) {
            return {type: this, position: pos, value: {x: s.substr(0, pos), y: s.substr(pos + 1)}};
        }
        else {
            return null;
        }
    }

    static applySearchResult(found, f) {
        return new this(f(found.value.x), f(found.value.y));
    }
};

export class VariableExpression extends AtomExpression {};

export class NumberExpression extends AtomExpression {};

export class StringExpression extends AtomExpression {};

export class DotExpression extends Expression {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }
};

export class PlusExpression extends BinaryExpression {};
PlusExpression.sign = "+";

export class MinusExpression extends BinaryExpression {};
MinusExpression.sign = "-";

export class TimesExpression extends BinaryExpression {};
TimesExpression.sign = "*";

export class OverExpression extends BinaryExpression {};
OverExpression.sign = "/";

export class GreaterThanExpression extends BinaryExpression {};
GreaterThanExpression.sign = ">";

export class CallExpression extends Expression {
    constructor(callee, arguments) {
        super();
        this.callee = callee;
        this.arguments = arguments;
    }

    print(level = 0) {
        return this.constructor.name + " {\n" +
        "    ".repeat(level + 1) + "callee: " + this.callee.print(level + 1) + "\n" +
        "    ".repeat(level + 1) + "arguments: [\n" +
        this.arguments.map(arg => arg.print(level + 1)) +
        "    ".repeat(level + 1) + "]\n" +
        "    ".repeat(level) + "}\n";
    }
};

export class IfExpression extends Expression {
    constructor(condition, thenBranch, elseBranch) {
        super();
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
    }
};
