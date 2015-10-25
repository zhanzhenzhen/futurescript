import * as $lex from "./compile-lex-0";
import * as $block from "./compile-block-0";
import * as $pattern from "../lib/compile-pattern-0";
import * as $print from "../lib/compile-print-0";
import * as $statement from "./compile-statement-0";
import * as $expressionBase from "./compile-expression-base-0";
import * as $expressionMath from "./compile-expression-math-0";

export let Expression = $expressionBase.Expression;
export let AtomExpression = $expressionBase.AtomExpression;
export let BinaryExpression = $expressionBase.BinaryExpression;
export let VariableExpression = $expressionBase.VariableExpression;
export let NumberExpression = $expressionBase.NumberExpression;
export let StringExpression = $expressionBase.StringExpression;
export let InlineNormalStringExpression = $expressionBase.InlineNormalStringExpression;

export let PlusExpression = $expressionMath.PlusExpression;
export let MinusExpression = $expressionMath.MinusExpression;
export let TimesExpression = $expressionMath.TimesExpression;
export let OverExpression = $expressionMath.OverExpression;
export let EqualExpression = $expressionMath.EqualExpression;
export let NotEqualExpression = $expressionMath.NotEqualExpression;
export let LessThanExpression = $expressionMath.LessThanExpression;
export let GreaterThanExpression = $expressionMath.GreaterThanExpression;
export let LessThanOrEqualExpression = $expressionMath.LessThanOrEqualExpression;
export let GreaterThanOrEqualExpression = $expressionMath.GreaterThanOrEqualExpression;

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

export class ArrayExpression extends Expression {
    constructor(value) {
        super();
        this.value = value;
    }

    static match(lexPart, parentBlock) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        let patternMatch = $pattern.Pattern.searchPattern(
            [$pattern.BracketPair],
            lexPart,
            false
        );
        if (patternMatch !== null) {
            return $pattern.Pattern.split(
                [$lex.Comma, $lex.Semicolon],
                lexPart.shrink()
            );
        }
        else {
            return null;
        }
    }

    static applyMatch(match, lexPart, parentBlock) {
        return new this(
            new $statement.Arr(match.map(arg =>
                this.build(lexPart.lex.part(arg.startIndex, arg.endIndex), parentBlock)
            ))
        );
    }
};

export class ObjectExpression extends Expression {
    constructor(value) {
        super();
        this.value = value;
    }

    static match(lexPart, parentBlock) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        let patternMatch = $pattern.Pattern.searchPattern(
            [$pattern.BracePair],
            lexPart,
            false
        );
        if (patternMatch !== null) {
            return $pattern.Pattern.split(
                [$lex.Comma, $lex.Semicolon],
                lexPart.shrink()
            );
        }
        else {
            return null;
        }
    }

    static applyMatch(match, lexPart, parentBlock) {
        return new this(
            new $statement.Arr(match.map(arg => {
                let nvMatch = $pattern.Pattern.split(
                    $lex.Colon,
                    lexPart.lex.part(arg.startIndex, arg.endIndex)
                );
                return new $statement.NameValue(
                    new $statement.Atom(lexPart.lex.at(nvMatch[0].startIndex).value),
                    this.build(lexPart.changeTo(nvMatch[1]), parentBlock)
                );
            }))
        );
    }
};

export class ArrowFunctionExpression extends Expression {
    constructor(args, body) {
        super();
        this.arguments = args;
        this.body = body;
    }

    static match(lexPart, parentBlock) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        let patternMatch = null;
        let argumentsMatch = null;

        patternMatch = $pattern.Pattern.searchPattern(
            [$pattern.ParenthesisPair, $lex.ArrowFunction, $pattern.Any],
            lexPart,
            true
        );
        if (patternMatch !== null) {
            argumentsMatch = $pattern.Pattern.split(
                $lex.Comma,
                lex.part(patternMatch[0] + 1, patternMatch[1] - 2)
            );
        }
        else {
            patternMatch = $pattern.Pattern.searchPattern(
                [$pattern.BracketPair, $lex.ArrowFunction, $pattern.Any],
                lexPart,
                true
            );
            if (patternMatch !== null) {
                argumentsMatch = [{startIndex: patternMatch[0] + 1, endIndex: patternMatch[1] - 2}];
            }
            else {
                patternMatch = $pattern.Pattern.searchPattern(
                    [$lex.NormalToken, $lex.ArrowFunction, $pattern.Any],
                    lexPart,
                    true
                );
                if (patternMatch !== null) {
                    argumentsMatch = [{startIndex: patternMatch[0], endIndex: patternMatch[0]}];
                }
            }
        }

        if (argumentsMatch !== null) {
            let r = [];
            for (let i = 0; i < argumentsMatch.length; i++) {
                if (argumentsMatch[i].endIndex >= argumentsMatch[i].startIndex) {
                    r.push({
                        startIndex: argumentsMatch[i].startIndex,
                        endIndex: argumentsMatch[i].endIndex
                    });
                }
            }
            r.push({startIndex: patternMatch[2], endIndex: endIndex});
            return r;
        }

        return null;
    }

    static applyMatch(match, lexPart, parentBlock) {
        let lastMatch = match[match.length - 1];
        return new this(
            new $statement.Arr(match.slice(0, match.length - 1).map(arg =>
                new $statement.Atom(lexPart.lex.at(arg.startIndex).value)
            )),
            this.build(lexPart.lex.part(lastMatch.startIndex, lastMatch.endIndex), parentBlock)
        );
    }
};

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
    {types: [
        ArrayExpression,
        ObjectExpression
    ], leftToRight: true},
    {types: [
        ArrowFunctionExpression
    ], leftToRight: false},
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
