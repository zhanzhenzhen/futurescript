import * as $expressionBase from "./c-expression-base-0.js";
import * as $expressionMath from "./c-expression-math-0.js";
import * as $expressionObject from "./c-expression-object-0.js";
import * as $expressionFunction from "./c-expression-function-0.js";
import * as $expressionCondition from "./c-expression-condition-0.js";
import * as $expressionException from "./c-expression-exception-0.js";
import * as $expressionVariant from "./c-expression-variant-0.js";
import * as $expressionRelation from "./c-expression-relation-0.js";
import * as $expressionExternal from "./c-expression-external-0.js";
import * as $expressionMisc from "./c-expression-misc-0.js";

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
export let PositiveExpression = $expressionMath.PositiveExpression;
export let NegativeExpression = $expressionMath.NegativeExpression;
export let RemExpression = $expressionMath.RemExpression;
export let ModExpression = $expressionMath.ModExpression;
export let PowerExpression = $expressionMath.PowerExpression;

export let DotExpression = $expressionObject.DotExpression;
export let ObjectExpression = $expressionObject.ObjectExpression;
export let ArrayExpression = $expressionObject.ArrayExpression;

export let ArrowFunctionExpression = $expressionFunction.ArrowFunctionExpression;
export let DiamondFunctionExpression = $expressionFunction.DiamondFunctionExpression;
export let DashFunctionExpression = $expressionFunction.DashFunctionExpression;
export let ParenthesisCallExpression = $expressionFunction.ParenthesisCallExpression;
export let BracketCallExpression = $expressionFunction.BracketCallExpression;
export let BraceCallExpression = $expressionFunction.BraceCallExpression;
export let SpaceCallExpression = $expressionFunction.SpaceCallExpression;
export let DoExpression = $expressionFunction.DoExpression;

export let IfExpression = $expressionCondition.IfExpression;
export let PostIfExpression = $expressionCondition.PostIfExpression;
export let MatchExpression = $expressionCondition.MatchExpression;

export let TryExpression = $expressionException.TryExpression;

export let NormalVariantExpression = $expressionVariant.NormalVariantExpression;
export let OkVariantExpression = $expressionVariant.OkVariantExpression;
export let FunctionVariantExpression = $expressionVariant.FunctionVariantExpression;

export let InExpression = $expressionRelation.InExpression;
export let NotInExpression = $expressionRelation.NotInExpression;
export let IsExpression = $expressionRelation.IsExpression;
export let IsntExpression = $expressionRelation.IsntExpression;

export let PipeExpression = $expressionExternal.PipeExpression;
export let FatDotExpression = $expressionExternal.FatDotExpression;

export let AsExpression = $expressionMisc.AsExpression;
export let IfvoidExpression = $expressionMisc.IfvoidExpression;
export let IfnullExpression = $expressionMisc.IfnullExpression;

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
        MatchExpression,
        TryExpression,
        DoExpression
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
    {types: [
        InExpression,
        NotInExpression,
        IsExpression,
        IsntExpression
    ], leftToRight: false},
    {types: [PlusExpression, MinusExpression], leftToRight: false},
    {types: [
        TimesExpression,
        OverExpression,
        RemExpression,
        ModExpression
    ], leftToRight: false},
    {types: [PowerExpression], leftToRight: true},
    {types: [PositiveExpression, NegativeExpression], leftToRight: true},
    {types: [IfvoidExpression, IfnullExpression], leftToRight: false},
    {types: [AsExpression], leftToRight: false},
    {types: [PipeExpression], leftToRight: false},
    {types: [
        ParenthesisCallExpression,
        BracketCallExpression,
        BraceCallExpression,
        DotExpression,
        FatDotExpression,
        NormalVariantExpression,
        FunctionVariantExpression
    ], leftToRight: false}
];
