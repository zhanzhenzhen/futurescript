import * as $lex from "./compile-lex-0";
import * as $block from "./compile-block-0";

export class Expression {
    static leftToRight() {
        return this.precedence.find(group => group.types.includes(this)).leftToRight;
    };

    static build(lex, startIndex, endIndex, parentBlock) {
        let aaa = 0;
        console.log(300, aaa, startIndex, endIndex);
        console.log(500, aaa, parentBlock);
        let expression = (lex, startIndex, endIndex, parentBlock) => {
            aaa++;
            if (aaa === 10) process.exit();
            console.log(400, aaa, startIndex, endIndex);
            if (startIndex === endIndex) {
                if (lex.at(startIndex) instanceof $lex.NormalToken) {
                    return new VariableExpression(lex.at(startIndex).value);
                }
                else if (lex.at(startIndex) instanceof $lex.Num) {
                    return new NumberExpression(lex.at(startIndex).value);
                }
            }
            else if (
                endIndex - startIndex === 2 &&
                lex.at(startIndex) instanceof $lex.NormalStringStart &&
                lex.at(startIndex + 1) instanceof $lex.Str &&
                lex.at(startIndex + 2) instanceof $lex.NormalStringEnd
            ) {
                return new StringExpression(lex.at(startIndex + 1).value);
            }
            else {
                for (let i = 0; i < this.precedence.length; i++) {
                    let group = this.precedence[i];
                    let nearest = null;
                    for (let j = 0; j < group.types.length; j++) {
                        console.log(200, aaa, i, j);
                        let type = group.types[j];
                        let match = type.match(lex, startIndex, endIndex, parentBlock);
                        if (match !== null) {
                            if (nearest === null) {
                                nearest = {match: match, type: type};
                            }
                            else {
                                if (group.leftToRight) {
                                    if (
                                        Math.min(...match.map(m => m.endIndex)) <
                                        Math.min(...nearest.match.map(m => m.endIndex))
                                    ) {
                                        nearest = {match: match, type: type};
                                    }
                                }
                                else {
                                    if (
                                        Math.max(...match.map(m => m.StartIndex)) > Math.max(...nearest.match.map(m => m.startIndex))
                                    ) {
                                        nearest = {match: match, type: type};
                                    }
                                }
                            }
                        }
                    }
                    if (nearest !== null) {
                        console.log(100, aaa, i, nearest);
                        return nearest.type.applyMatch(
                            nearest.match, expression, lex, startIndex, endIndex, parentBlock
                        );
                    }
                }
            }
        };
        return expression(lex, startIndex, endIndex, parentBlock);
    }

    static search(token, lex, startIndex, endIndex) {
        let level = 0;
        let leftToRight = this.leftToRight();
        for (
            let i = leftToRight ? startIndex : endIndex;
            leftToRight ? i <= endIndex : i >= startIndex;
            leftToRight ? i++ : i--
        ) {
            if (
                lex.at(i) instanceof $lex.LeftParenthesis ||
                lex.at(i) instanceof $lex.LeftBracket ||
                lex.at(i) instanceof $lex.LeftBrace ||
                lex.at(i) instanceof $lex.LeftChevron
            ) {
                level++;
            }
            else if (
                lex.at(i) instanceof $lex.RightParenthesis ||
                lex.at(i) instanceof $lex.RightBracket ||
                lex.at(i) instanceof $lex.RightBrace ||
                lex.at(i) instanceof $lex.RightChevron
            ) {
                level--;
            }
            else if (lex.at(i) instanceof token && level === 0) {
                return i;
            }
        }
        return null;
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

    static match(lex, startIndex, endIndex, parentBlock) {
        let pos = this.search(this.sign, lex, startIndex, endIndex);
        if (pos !== null) {
            return [
                {startIndex: startIndex, endIndex: pos - 1},
                {startIndex: pos + 1, endIndex: endIndex}
            ];
        }
        else {
            return null;
        }
    }

    static applyMatch(match, f, lex, startIndex, endIndex, parentBlock) {
        return new this(
            f(lex, match[0].startIndex, match[0].endIndex, parentBlock),
            f(lex, match[1].startIndex, match[1].endIndex, parentBlock)
        );
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

    static match(lex, startIndex, endIndex, parentBlock) {
        let pos = this.search($lex.Dot, lex, startIndex, endIndex);
        if (pos !== null) {
            return [
                {startIndex: startIndex, endIndex: pos - 1},
                {startIndex: pos + 1, endIndex: endIndex}
            ];
        }
        else {
            return null;
        }
    }

    static applyMatch(match, f, lex, startIndex, endIndex, parentBlock) {
        return new this(
            f(lex, match[0].startIndex, match[0].endIndex, parentBlock),
            lex.at(match[1].startIndex).value
        );
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

export class EqualExpression extends BinaryExpression {};
EqualExpression.sign = $lex.Equal;

export class NotEqualExpression extends BinaryExpression {};
NotEqualExpression.sign = $lex.NotEqual;

export class LessThanExpression extends BinaryExpression {};
LessThanExpression.sign = $lex.LessThan;

export class GreaterThanExpression extends BinaryExpression {};
GreaterThanExpression.sign = $lex.GreaterThan;

export class LessThanOrEqualExpression extends BinaryExpression {};
LessThanOrEqualExpression.sign = $lex.LessThanOrEqual;

export class GreaterThanOrEqualExpression extends BinaryExpression {};
GreaterThanOrEqualExpression.sign = $lex.GreaterThanOrEqual;

export class ParenthesisCallExpression extends Expression {
    constructor(callee, args) {
        super();
        this.callee = callee;
        this.arguments = args;
    }

    static match(lex, startIndex, endIndex, parentBlock) {
        let pos = this.search($lex.CallLeftParenthesis, lex, startIndex, endIndex);
        if (pos !== null) {
            return [
                {startIndex: startIndex, endIndex: pos - 1},
                {startIndex: pos + 1, endIndex: endIndex - 1}
            ];
        }
        else {
            return null;
        }
    }

    static applyMatch(match, f, lex, startIndex, endIndex, parentBlock) {
        return new this(
            f(lex, match[0].startIndex, match[0].endIndex, parentBlock),
            f(lex, match[1].startIndex, match[1].endIndex, parentBlock)
        );
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

    static match(lex, startIndex, endIndex, parentBlock) {
        let ifPos = null;
        let thenPos = null;
        let thenBlockStartIndex = null;
        let elsePos = null;
        let elseBlockStartIndex = null;
        ifPos = this.search($lex.If, lex, startIndex, endIndex);
        if (ifPos === null) {
            return null;
        }
        thenPos = this.search($lex.Then, lex, startIndex, endIndex);
        if (thenPos === null) {
            thenBlockStartIndex = lex.search($lex.Indent, ifPos + 1, true, endIndex);
            if (thenBlockStartIndex === null) {
                return null;
            }
        }
        elsePos = this.search($lex.Else, lex, startIndex, endIndex);
        if (elsePos !== null) {
            elseBlockStartIndex = lex.search($lex.Indent, elsePos + 1, true, endIndex);
        }
        if (thenPos !== null && ifPos > thenPos) {
            return null;
        }
        if (thenBlockStartIndex !== null && ifPos > thenBlockStartIndex) {
            return null;
        }
        if (thenPos !== null && elsePos !== null && thenPos > elsePos) {
            return null;
        }
        if (thenBlockStartIndex !== null && elsePos !== null && thenBlockStartIndex > elsePos) {
            return null;
        }
        return [
            {
                startIndex: ifPos + 1,
                endIndex: thenBlockStartIndex === null ? thenPos - 1 : thenBlockStartIndex - 1,
            },
            {
                startIndex: thenBlockStartIndex === null ? thenPos + 1: thenBlockStartIndex,
                endIndex: elsePos === null ? endIndex : elsePos - 1,
                isBlock: thenBlockStartIndex !== null
            },
            elsePos === null ? null :
                {
                    startIndex: elsePos + 1,
                    endIndex: endIndex,
                    isBlock: elseBlockStartIndex !== null
                }
        ];
    }

    static applyMatch(match, f, lex, startIndex, endIndex, parentBlock) {
        return new this(
            f(lex, match[0].startIndex, match[0].endIndex, parentBlock),
            match[1].isBlock ?
                new $block.Block(lex, match[1].startIndex, match[1].endIndex) :
                f(lex, match[1].startIndex, match[1].endIndex, parentBlock),
            match[2].isBlock ?
                new $block.Block(lex, match[2].startIndex, match[2].endIndex) :
                f(lex, match[2].startIndex, match[2].endIndex, parentBlock)
        );
    }
};

// lowest on top, highest on bottom
Expression.precedence = [
    {types: [IfExpression], leftToRight: false},
    //{types: [SpaceCallExpression], leftToRight: false},
    //{types: [OrExpression], leftToRight: true},
    //{types: [AndExpression], leftToRight: true},
    //{types: [NotExpression], leftToRight: false},
    {types: [
        EqualExpression,
        NotEqualExpression,
        LessThanExpression,
        LessThanOrEqualExpression,
        GreaterThanExpression,
        GreaterThanOrEqualExpression
    ], leftToRight: true},
    {types: [PlusExpression, MinusExpression], leftToRight: true},
    {types: [TimesExpression, OverExpression], leftToRight: true},
    {types: [ParenthesisCallExpression, DotExpression], leftToRight: true}
];
