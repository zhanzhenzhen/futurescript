import {face} from "./c-expression-face-0.js";

import * as $expressionBase from "./c-expression-base-0.js";
export let Expression = face.Expression;
export let AtomExpression = face.AtomExpression;
export let BinaryExpression = face.BinaryExpression;
export let UnaryExpression = face.UnaryExpression;
export let VariableExpression = face.VariableExpression;
export let NumberExpression = face.NumberExpression;
export let StringExpression = face.StringExpression;
export let PostQuoteExpression = face.PostQuoteExpression;
export let InlineNormalStringExpression = face.InlineNormalStringExpression;
export let FormattedNormalStringExpression = face.FormattedNormalStringExpression;
export let InlineVerbatimStringExpression = face.InlineVerbatimStringExpression;
export let FormattedVerbatimStringExpression = face.FormattedVerbatimStringExpression;
export let InlineRegexExpression = face.InlineRegexExpression;
export let FormattedRegexExpression = face.FormattedRegexExpression;
export let InlineJsExpression = face.InlineJsExpression;
export let FormattedJsExpression = face.FormattedJsExpression;
export let BooleanExpression = face.BooleanExpression;
export let NullExpression = face.NullExpression;
export let VoidExpression = face.VoidExpression;
export let ArgExpression = face.ArgExpression;
export let FunExpression = face.FunExpression;
export let SelfExpression = face.SelfExpression;
export let MeExpression = face.MeExpression;
export let ClassMeExpression = face.ClassMeExpression;

import * as $expressionMath from "./c-expression-math-0.js";
export let PlusExpression = face.PlusExpression;
export let MinusExpression = face.MinusExpression;
export let TimesExpression = face.TimesExpression;
export let OverExpression = face.OverExpression;
export let EqualExpression = face.EqualExpression;
export let NotEqualExpression = face.NotEqualExpression;
export let LessThanExpression = face.LessThanExpression;
export let GreaterThanExpression = face.GreaterThanExpression;
export let LessThanOrEqualExpression = face.LessThanOrEqualExpression;
export let GreaterThanOrEqualExpression = face.GreaterThanOrEqualExpression;
export let OrExpression = face.OrExpression;
export let AndExpression = face.AndExpression;
export let NotExpression = face.NotExpression;
export let PositiveExpression = face.PositiveExpression;
export let NegativeExpression = face.NegativeExpression;
export let RemExpression = face.RemExpression;
export let ModExpression = face.ModExpression;
export let PowerExpression = face.PowerExpression;

import * as $expressionObject from "./c-expression-object-0.js";
export let DotExpression = face.DotExpression;
export let ObjectExpression = face.ObjectExpression;
export let ArrayExpression = face.ArrayExpression;

import * as $expressionFunction from "./c-expression-function-0.js";
export let ArrowFunctionExpression = face.ArrowFunctionExpression;
export let DiamondFunctionExpression = face.DiamondFunctionExpression;
export let DashFunctionExpression = face.DashFunctionExpression;
export let ParenthesisCallExpression = face.ParenthesisCallExpression;
export let BracketCallExpression = face.BracketCallExpression;
export let BraceCallExpression = face.BraceCallExpression;
export let SpaceCallExpression = face.SpaceCallExpression;
export let PseudoCallExpression = face.PseudoCallExpression;
export let DoExpression = face.DoExpression;

import * as $expressionCondition from "./c-expression-condition-0.js";
export let IfExpression = face.IfExpression;
export let PostIfExpression = face.PostIfExpression;
export let MatchExpression = face.MatchExpression;

import * as $expressionException from "./c-expression-exception-0.js";
export let TryExpression = face.TryExpression;

import * as $expressionVariant from "./c-expression-variant-0.js";
export let NormalVariantExpression = face.NormalVariantExpression;
export let OkVariantExpression = face.OkVariantExpression;
export let FunctionVariantExpression = face.FunctionVariantExpression;

import * as $expressionRelation from "./c-expression-relation-0.js";
export let InExpression = face.InExpression;
export let NotInExpression = face.NotInExpression;
export let IsExpression = face.IsExpression;
export let IsntExpression = face.IsntExpression;

import * as $expressionExternal from "./c-expression-external-0.js";
export let PipeExpression = face.PipeExpression;

import * as $expressionClass from "./c-expression-class-0.js";
export let ClassExpression = face.ClassExpression;

import * as $expressionModule from "./c-expression-module-0.js";
export let ImportExpression = face.ImportExpression;
export let ExportAsExpression = face.ExportAsExpression;

import * as $expressionMisc from "./c-expression-misc-0.js";
export let AsExpression = face.AsExpression;
export let IfvoidExpression = face.IfvoidExpression;
export let IfnullExpression = face.IfnullExpression;

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
