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
                    let found = type.search(lex, startIndex, endIndex);
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
                    return nearest.type.applySearchResult(nearest, expression);
                }
            }
        };
        return expression(lex, startIndex, endIndex);
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
    {types: [IfExpression], leftToRight: false},
    {types: [SpaceCallExpression], leftToRight: false},
    {types: [OrExpression], leftToRight: true},
    {types: [AndExpression], leftToRight: true},
    {types: [
        EqualExpression,
        NotEqualExpression,
        LessThanExpression,
        LessThanOrEqual,
        GreaterThanExpression,
        GreaterThanOrEqual
    ], leftToRight: true},
    {types: [PlusExpression, MinusExpression], leftToRight: true},
    {types: [TimesExpression, OverExpression], leftToRight: true},
    {types: [NotExpression], leftToRight: false},
    {types: [ParenthesisCallExpression], leftToRight: true},
    {types: [DotExpression], leftToRight: true}
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

    static search(lex, startIndex, endIndex) {
        let pos = null;
        if (this.leftToRight()) {
            for (let i = startIndex; i <= endIndex; i++) {
                if (lex[i] instanceof this.sign) {
                    pos = i;
                    break;
                }
            }
        }
        else {
            for (let i = endIndex; i >= startIndex; i--) {
                if (lex[i] instanceof this.sign) {
                    pos = i;
                    break;
                }
            }
        }
        if (pos !== null) {
            return {type: this, position: pos};
        }
        else {
            return null;
        }
    }

    static applySearchResult(found, f, lex, startIndex, endIndex) {
        return new this(f(lex, startIndex, found.position - 1), f(lex, found.position + 1, endIndex));
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
PlusExpression.sign = $lex.Plus;

export class MinusExpression extends BinaryExpression {};
MinusExpression.sign = $lex.Minus;

export class TimesExpression extends BinaryExpression {};
TimesExpression.sign = $lex.Times;

export class OverExpression extends BinaryExpression {};
OverExpression.sign = $lex.Over;

export class GreaterThanExpression extends BinaryExpression {};
GreaterThanExpression.sign = $lex.GreaterThan;

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
