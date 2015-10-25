import * as $lex from "./compile-lex-0";
import * as $block from "./compile-block-0";
import * as $pattern from "../lib/compile-pattern-0";
import * as $print from "../lib/compile-print-0";
import * as $statement from "./compile-statement-0";
import * as $expressionBase from "./compile-expression-base-0";
import * as $expressionMath from "./compile-expression-math-0";
import * as $expressionObject from "./compile-expression-object-0";
import * as $expressionFunction from "./compile-expression-function-0";
import * as $expressionCondition from "./compile-expression-condition-0";

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
export let ArrayExpression = $expressionObject.ArrayExpression;

export let ArrowFunctionExpression = $expressionFunction.ArrowFunctionExpression;
export let ParenthesisCallExpression = $expressionFunction.ParenthesisCallExpression;

export let IfExpression = $expressionCondition.IfExpression;

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
