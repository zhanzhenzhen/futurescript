class Expression {
    static leftToRight = function() {
        return this.precedence.find(group => group.types.includes(this)).leftToRight;
    };

    static build(str) {
        let expression = s => {
            s = s.trim();
            if (s.search(/^[A-Za-z$_][A-Za-z0-9$_]*$/)) {
                return new VariableExpression(s);
            }
            if (s.search(/^(\d+)|(\d+)\.(\d+)$/)) {
                return new NumberExpression(s);
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

class AtomExpression extends Expression {
    constructor(value) {
        super();
        this.value = value;
    }

    print() {
        return this.constructor.name + " " + JSON.stringify(this.value) + "\n";
    }
};

class BinaryExpression extends Expression {
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

class VariableExpression extends AtomExpression {};

class NumberExpression extends AtomExpression {};

class DotExpression extends Expression {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }
};

class PlusExpression extends Expression {};
PlusExpression.sign = "+";

class MinusExpression extends Expression {};
MinusExpression.sign = "-";

class TimesExpression extends Expression {};
TimesExpression.sign = "*";

class OverExpression extends Expression {};
OverExpression.sign = "/";

class GreaterThanExpression extends Expression {};
GreaterThanExpression.sign = ">";
