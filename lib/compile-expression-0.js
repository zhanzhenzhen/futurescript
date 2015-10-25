import * as $lex from "./compile-lex-0";
import * as $block from "./compile-block-0";
import * as $pattern from "../lib/compile-pattern-0";
import * as $print from "../lib/compile-print-0";
import * as $statement from "./compile-statement-0";
import * as $expressionBase from "./compile-expression-base-0";
import * as $expressionMath from "./compile-expression-math-0";
import * as $expressionObject from "./compile-expression-object-0";
import * as $expressionFunction from "./compile-expression-function-0";

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

export let DotExpression = $expressionObject.DotExpression;
export let ObjectExpression = $expressionObject.ObjectExpression;

export let ArrowFunctionExpression = $expressionFunction.ArrowFunctionExpression;
export let ParenthesisCallExpression = $expressionFunction.ParenthesisCallExpression;

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
