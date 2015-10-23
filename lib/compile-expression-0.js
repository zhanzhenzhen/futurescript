import * as $lex from "./compile-lex-0";
import * as $block from "./compile-block-0";
import * as $pattern from "../lib/compile-pattern-0";
import * as $print from "../lib/compile-print-0";
import * as $statement from "./compile-statement-0";

export class Expression {
    static leftToRight() {
        return this.precedence.find(group => group.types.includes(this)).leftToRight;
    }

    static build(lexPart, parentBlock) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        if (startIndex === endIndex) {
            if (lex.at(startIndex) instanceof $lex.NormalToken) {
                return new VariableExpression(lex.at(startIndex).value);
            }
            else if (lex.at(startIndex) instanceof $lex.Num) {
                return new NumberExpression(lex.at(startIndex).value);
            }
            else if (lex.at(startIndex) instanceof $lex.Str) {
                return new StringExpression(lex.at(startIndex).value);
            }
            else if (lex.at(startIndex) instanceof $lex.InlineNormalString) {
                return new InlineNormalStringExpression();
            }
        }
        else if (
            lex.at(startIndex) instanceof $lex.NormalLeftParenthesis &&
            lex.at(endIndex) instanceof $lex.RightParenthesis
        ) {
            return this.build(lexPart.shrink(), parentBlock);
        }
        else {
            for (let i = 0; i < this.precedence.length; i++) {
                let group = this.precedence[i];
                let nearest = null;
                for (let j = 0; j < group.types.length; j++) {
                    let type = group.types[j];
                    let match = type.match(lexPart, parentBlock);
                    if (match !== null) {
                        if (nearest === null) {
                            nearest = {match: match, type: type};
                        }
                        else {
                            if (group.leftToRight) {
                                if (
                                    Math.max(...match.map(m => m.startIndex)) > Math.max(...nearest.match.map(m => m.startIndex))
                                ) {
                                    nearest = {match: match, type: type};
                                }
                            }
                            else {
                                if (
                                    Math.min(...match.map(m => m.endIndex)) <
                                    Math.min(...nearest.match.map(m => m.endIndex))
                                ) {
                                    nearest = {match: match, type: type};
                                }
                            }
                        }
                    }
                }
                if (nearest !== null) {
                    return nearest.type.applyMatch(nearest.match, lexPart, parentBlock);
                }
            }
            return null;
        }
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
        return $print.printObject(this, this.constructor, level);
    }
};

export class AtomExpression extends Expression {
    constructor(value) {
        super();
        this.value = value;
    }

    print() {
        return $print.printAtom(this);
    }
};

// Every subclass must have a `sign` static property.
export class BinaryExpression extends Expression {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }

    static match(lexPart, parentBlock) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        let patternMatch = $pattern.Pattern.searchPattern(
            [$pattern.Tokens, this.sign, $pattern.Tokens],
            lexPart,
            !this.leftToRight()
        );
        if (patternMatch !== null) {
            return [
                {startIndex: startIndex, endIndex: patternMatch[1] - 1},
                {startIndex: patternMatch[2], endIndex: endIndex}
            ];
        }
        else {
            return null;
        }
    }

    static applyMatch(match, lexPart, parentBlock) {
        return new this(
            this.build(lexPart.lex.part(match[0].startIndex, match[0].endIndex), parentBlock),
            this.build(lexPart.lex.part(match[1].startIndex, match[1].endIndex), parentBlock)
        );
    }
};

export class VariableExpression extends AtomExpression {};

export class NumberExpression extends AtomExpression {};

// This represents a virtual argument inside the virtual caller that denotes the whole string.
export class StringExpression extends AtomExpression {};

// This represents the virtual caller that denotes the whole string.
export class InlineNormalStringExpression extends AtomExpression {};

export class DotExpression extends Expression {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }

    static match(lexPart, parentBlock) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        let patternMatch = $pattern.Pattern.searchPattern(
            [$pattern.Tokens, $lex.Dot, $pattern.Tokens],
            lexPart,
            false
        );
        if (patternMatch !== null) {
            return [
                {startIndex: startIndex, endIndex: patternMatch[1] - 1},
                {startIndex: patternMatch[2], endIndex: endIndex}
            ];
        }
        else {
            return null;
        }
    }

    static applyMatch(match, lexPart, parentBlock) {
        let left = this.build(lexPart.lex.part(match[0].startIndex, match[0].endIndex), parentBlock);
        let right = null;
        if (lexPart.lex.at(match[1].startIndex) instanceof $lex.LeftParenthesis) {
            right = this.build(
                lexPart.lex.part(match[1].startIndex + 1, match[1].endIndex - 1),
                parentBlock
            );
        }
        else {
            right = new $statement.Atom(lexPart.lex.at(match[1].startIndex).value);
        }
        return new this(left, right);
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

    static match(lexPart, parentBlock) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        let patternMatch = $pattern.Pattern.searchPattern(
            [$pattern.Tokens, $pattern.ParenthesisPair],
            lexPart,
            false
        );
        if (patternMatch !== null && lex.at(patternMatch[1]) instanceof $lex.CallLeftParenthesis) {
            let argumentsMatch = $pattern.Pattern.split(
                $lex.Comma,
                lex.part(patternMatch[1] + 1, endIndex - 1)
            );
            let r = [{startIndex: startIndex, endIndex: patternMatch[1] - 1}];
            for (let i = 0; i < argumentsMatch.length; i++) {
                if (argumentsMatch[i].endIndex >= argumentsMatch[i].startIndex) {
                    r.push({
                        startIndex: argumentsMatch[i].startIndex,
                        endIndex: argumentsMatch[i].endIndex
                    });
                }
            }
            return r;
        }
        else {
            return null;
        }
    }

    static applyMatch(match, lexPart, parentBlock) {
        return new this(
            this.build(lexPart.lex.part(match[0].startIndex, match[0].endIndex), parentBlock),
            new $statement.Arr(match.slice(1).map(arg =>
                this.build(lexPart.lex.part(arg.startIndex, arg.endIndex), parentBlock)
            ))
        );
    }

    print(level = 0) {
        return $print.printObject(this, this.constructor, level);
    }
};

export class IfExpression extends Expression {
    constructor(condition, thenBranch, elseBranch) {
        super();
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
    }

    static match(lexPart, parentBlock) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        let patternMatch = null;

        patternMatch = $pattern.Pattern.searchPattern(
            [$lex.If, $pattern.Tokens, $pattern.ChevronPair, $lex.Else, $pattern.Any],
            lexPart,
            true
        );
        if (patternMatch !== null) {
            return [
                {startIndex: patternMatch[1], endIndex: patternMatch[2] - 1},
                {startIndex: patternMatch[2], endIndex: patternMatch[3] - 1},
                {startIndex: patternMatch[4], endIndex: endIndex}
            ];
        }

        patternMatch = $pattern.Pattern.searchPattern(
            [$lex.If, $pattern.Tokens, $pattern.ChevronPair],
            lexPart,
            true
        );
        if (patternMatch !== null) {
            return [
                {startIndex: patternMatch[1], endIndex: patternMatch[2] - 1},
                {startIndex: patternMatch[2], endIndex: patternMatch[3] - 1},
                null
            ];
        }

        patternMatch = $pattern.Pattern.searchPattern(
            [$lex.If, $pattern.Tokens, $lex.Then, $pattern.Any, $lex.Else, $pattern.Any],
            lexPart,
            true
        );
        if (patternMatch !== null) {
            return [
                {startIndex: patternMatch[1], endIndex: patternMatch[2] - 1},
                {startIndex: patternMatch[3], endIndex: patternMatch[4] - 1},
                {startIndex: patternMatch[5], endIndex: endIndex}
            ];
        }

        patternMatch = $pattern.Pattern.searchPattern(
            [$lex.If, $pattern.Tokens, $lex.Then, $pattern.Any],
            lexPart,
            true
        );
        if (patternMatch !== null) {
            return [
                {startIndex: patternMatch[1], endIndex: patternMatch[2] - 1},
                {startIndex: patternMatch[3], endIndex: patternMatch[4] - 1},
                null
            ];
        }

        patternMatch = $pattern.Pattern.searchPattern(
            [$pattern.Tokens, $lex.Then, $pattern.Any, $lex.Else, $pattern.Any],
            lexPart,
            true
        );
        if (patternMatch !== null) {
            return [
                {startIndex: patternMatch[0], endIndex: patternMatch[1] - 1},
                {startIndex: patternMatch[2], endIndex: patternMatch[3] - 1},
                {startIndex: patternMatch[4], endIndex: endIndex}
            ];
        }

        patternMatch = $pattern.Pattern.searchPattern(
            [$pattern.Tokens, $lex.Then, $pattern.Any],
            lexPart,
            true
        );
        if (patternMatch !== null) {
            return [
                {startIndex: patternMatch[0], endIndex: patternMatch[1] - 1},
                {startIndex: patternMatch[2], endIndex: patternMatch[3] - 1},
                null
            ];
        }

        return null;
    }

    static applyMatch(match, lexPart, parentBlock) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        let thenStuff = null;
        if (match[1] !== null) {
            let thenLexPart = lex.part(match[1].startIndex, match[1].endIndex);
            thenStuff =
                lex.at(match[1].startIndex) instanceof $lex.LeftChevron ?
                new $block.Block(thenLexPart.shrink()) :
                this.build(thenLexPart, parentBlock);
        }
        let elseStuff = null;
        if (match[2] !== null) {
            let elseLexPart = lex.part(match[2].startIndex, match[2].endIndex);
            elseStuff =
                lex.at(match[2].startIndex) instanceof $lex.LeftChevron ?
                new $block.Block(elseLexPart.shrink()) :
                this.build(elseLexPart, parentBlock);
        }
        return new this(
            this.build(lex.part(match[0].startIndex, match[0].endIndex), parentBlock),
            thenStuff,
            elseStuff
        );
    }
};

// Lowest on top, highest on bottom. Each element is called a precedence group.
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
