import {hub} from "./c-expression-hub-0.js";

import "./c-expression-base-0.js";
export let Expression = hub.Expression;
export let AtomExpression = hub.AtomExpression;
export let BinaryExpression = hub.BinaryExpression;
export let UnaryExpression = hub.UnaryExpression;
export let VariableExpression = hub.VariableExpression;
export let NumberExpression = hub.NumberExpression;
export let StringExpression = hub.StringExpression;
export let PostQuoteExpression = hub.PostQuoteExpression;
export let InlineNormalStringExpression = hub.InlineNormalStringExpression;
export let FormattedNormalStringExpression = hub.FormattedNormalStringExpression;
export let InlineVerbatimStringExpression = hub.InlineVerbatimStringExpression;
export let FormattedVerbatimStringExpression = hub.FormattedVerbatimStringExpression;
export let InlineRegexExpression = hub.InlineRegexExpression;
export let FormattedRegexExpression = hub.FormattedRegexExpression;
export let InlineJsExpression = hub.InlineJsExpression;
export let FormattedJsExpression = hub.FormattedJsExpression;
export let BooleanExpression = hub.BooleanExpression;
export let NullExpression = hub.NullExpression;
export let VoidExpression = hub.VoidExpression;
export let ArgExpression = hub.ArgExpression;
export let FunExpression = hub.FunExpression;
export let SelfExpression = hub.SelfExpression;
export let MeExpression = hub.MeExpression;
export let ClassMeExpression = hub.ClassMeExpression;

import "./c-expression-math-0.js";
export let PlusExpression = hub.PlusExpression;
export let MinusExpression = hub.MinusExpression;
export let TimesExpression = hub.TimesExpression;
export let OverExpression = hub.OverExpression;
export let EqualExpression = hub.EqualExpression;
export let NotEqualExpression = hub.NotEqualExpression;
export let LessThanExpression = hub.LessThanExpression;
export let GreaterThanExpression = hub.GreaterThanExpression;
export let LessThanOrEqualExpression = hub.LessThanOrEqualExpression;
export let GreaterThanOrEqualExpression = hub.GreaterThanOrEqualExpression;
export let OrExpression = hub.OrExpression;
export let AndExpression = hub.AndExpression;
export let NotExpression = hub.NotExpression;
export let PositiveExpression = hub.PositiveExpression;
export let NegativeExpression = hub.NegativeExpression;
export let RemExpression = hub.RemExpression;
export let ModExpression = hub.ModExpression;
export let PowerExpression = hub.PowerExpression;

import "./c-expression-object-0.js";
export let DotExpression = hub.DotExpression;
export let ObjectExpression = hub.ObjectExpression;
export let ArrayExpression = hub.ArrayExpression;

import "./c-expression-function-0.js";
export let ArrowFunctionExpression = hub.ArrowFunctionExpression;
export let DiamondFunctionExpression = hub.DiamondFunctionExpression;
export let DashFunctionExpression = hub.DashFunctionExpression;
export let ParenthesisCallExpression = hub.ParenthesisCallExpression;
export let BracketCallExpression = hub.BracketCallExpression;
export let BraceCallExpression = hub.BraceCallExpression;
export let SpaceCallExpression = hub.SpaceCallExpression;
export let PseudoCallExpression = hub.PseudoCallExpression;
export let DoExpression = hub.DoExpression;

import "./c-expression-condition-0.js";
export let IfExpression = hub.IfExpression;
export let PostIfExpression = hub.PostIfExpression;
export let MatchExpression = hub.MatchExpression;

import "./c-expression-exception-0.js";
export let TryExpression = hub.TryExpression;

import "./c-expression-variant-0.js";
export let NormalVariantExpression = hub.NormalVariantExpression;
export let OkVariantExpression = hub.OkVariantExpression;
export let FunctionVariantExpression = hub.FunctionVariantExpression;

import "./c-expression-relation-0.js";
export let InExpression = hub.InExpression;
export let NotInExpression = hub.NotInExpression;
export let IsExpression = hub.IsExpression;
export let IsntExpression = hub.IsntExpression;

import "./c-expression-external-0.js";
export let PipeExpression = hub.PipeExpression;

import "./c-expression-class-0.js";
export let ClassExpression = hub.ClassExpression;

import "./c-expression-module-0.js";
export let ImportExpression = hub.ImportExpression;
export let ExportAsExpression = hub.ExportAsExpression;

import "./c-expression-misc-0.js";
export let AsExpression = hub.AsExpression;
export let IfvoidExpression = hub.IfvoidExpression;
export let IfnullExpression = hub.IfnullExpression;

// Biggest (traditional: lowest) on top, smallest (traditional: highest) on bottom.
// Each element is called a precedence group.
// `leftToRight=true` means the traditional right-to-left.
// `leftToRight=false` means the traditional left-to-right.
// So both precendence and associativity are in reverse order than traditional concept.
// Note: the first and last groups are special. These 2 groups are left-to-right independent.
// Both true and false works, but it's better to set it to true because it's faster.
// Note: Atom expression classes and those only for abstract purposes shouldn't be in this list.
Expression.precedence = [
    {types: [
        ArrayExpression,
        ObjectExpression,
        PostIfExpression,
        MatchExpression,
        TryExpression,
        DoExpression,
        ClassExpression
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
    {types: [AsExpression, ExportAsExpression], leftToRight: false},
    {types: [PipeExpression], leftToRight: false},
    {types: [
        ParenthesisCallExpression,
        BracketCallExpression,
        BraceCallExpression,
        DotExpression,
        NormalVariantExpression,
        FunctionVariantExpression,
        ImportExpression
    ], leftToRight: false},
    {types: [PseudoCallExpression], leftToRight: true}
];
