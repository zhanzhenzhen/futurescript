import * as $expressionBase from "./compile-expression-base-0";
import * as $expressionMath from "./compile-expression-math-0";
import * as $expressionObject from "./compile-expression-object-0";
import * as $expressionFunction from "./compile-expression-function-0";
import * as $expressionCondition from "./compile-expression-condition-0";

export let Expression = $expressionBase.Expression;
export let AtomExpression = $expressionBase.AtomExpression;
export let BinaryExpression = $expressionBase.BinaryExpression;
export let UnaryExpression = $expressionBase.UnaryExpression;
export let VariableExpression = $expressionBase.VariableExpression;
export let NumberExpression = $expressionBase.NumberExpression;
export let StringExpression = $expressionBase.StringExpression;
export let InlineNormalStringExpression = $expressionBase.InlineNormalStringExpression;
export let BooleanExpression = $expressionBase.BooleanExpression;
export let NullExpression = $expressionBase.NullExpression;
export let VoidExpression = $expressionBase.VoidExpression;
export let ArgExpression = $expressionBase.ArgExpression;
export let FunExpression = $expressionBase.FunExpression;
export let SelfExpression = $expressionBase.SelfExpression;

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
export let OrExpression = $expressionMath.OrExpression;
export let AndExpression = $expressionMath.AndExpression;
export let NotExpression = $expressionMath.NotExpression;

export let DotExpression = $expressionObject.DotExpression;
export let ObjectExpression = $expressionObject.ObjectExpression;
export let ArrayExpression = $expressionObject.ArrayExpression;

export let ArrowFunctionExpression = $expressionFunction.ArrowFunctionExpression;
export let DiamondFunctionExpression = $expressionFunction.DiamondFunctionExpression;
export let DashFunctionExpression = $expressionFunction.DashFunctionExpression;
export let ParenthesisCallExpression = $expressionFunction.ParenthesisCallExpression;
export let SpaceCallExpression = $expressionFunction.SpaceCallExpression;

export let IfExpression = $expressionCondition.IfExpression;
export let PostIfExpression = $expressionCondition.PostIfExpression;
export let MatchExpression = $expressionCondition.MatchExpression;

// Biggest (traditional: lowest) on top, smallest (traditional: highest) on bottom.
// Each element is called a precedence group.
// `leftToRight=true` means the traditional right-to-left.
// `leftToRight=false` means the traditional left-to-right.
// So both precendence and associativity are in reverse order than traditional concept.
// Note: the first group is special. It's left-to-right independent. Both true and false works,
// but it's better to set it to true because it's faster.
Expression.precedence = [
    {types: [
        ArrayExpression,
        ObjectExpression,
        PostIfExpression,
        MatchExpression
    ], leftToRight: true},
    {types: [
        ArrowFunctionExpression,
        DiamondFunctionExpression,
        DashFunctionExpression
    ], leftToRight: true},
    {types: [IfExpression], leftToRight: true},
    {types: [SpaceCallExpression], leftToRight: true},
    {types: [OrExpression], leftToRight: false},
    {types: [AndExpression], leftToRight: false},
    {types: [NotExpression], leftToRight: true},
    {types: [
        EqualExpression,
        NotEqualExpression,
        LessThanExpression,
        LessThanOrEqualExpression,
        GreaterThanExpression,
        GreaterThanOrEqualExpression
    ], leftToRight: false},
    {types: [PlusExpression, MinusExpression], leftToRight: false},
    {types: [TimesExpression, OverExpression], leftToRight: false},
    {types: [ParenthesisCallExpression, DotExpression], leftToRight: false}
];
