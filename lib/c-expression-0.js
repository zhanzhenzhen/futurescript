// The structure indicates the code should be in a single file, but because it's too
// large I want to split them into files, then I found it difficult even using module.
// The difficulty lies in cyclic imports. The class name after `extends` is evaluated while
// module loading.
// So we here do a trick by using a "pool". The pool is dynamically filled (order is important),
// but the import and export structure is static. If an expression-related submodule want to
// use another submodule, it must use the pool. This module should only be used by
// non-expression modules.

import {pool} from "./c-expression-pool-0.js";

import "./c-expression-base-0.js";
export let Expression = pool.Expression;
export let AtomExpression = pool.AtomExpression;
export let BinaryExpression = pool.BinaryExpression;
export let UnaryExpression = pool.UnaryExpression;
export let VariableExpression = pool.VariableExpression;
export let NumberExpression = pool.NumberExpression;
export let StringExpression = pool.StringExpression;
export let PostQuoteExpression = pool.PostQuoteExpression;
export let InlineNormalStringExpression = pool.InlineNormalStringExpression;
export let FormattedNormalStringExpression = pool.FormattedNormalStringExpression;
export let InlineVerbatimStringExpression = pool.InlineVerbatimStringExpression;
export let FormattedVerbatimStringExpression = pool.FormattedVerbatimStringExpression;
export let InlineRegexExpression = pool.InlineRegexExpression;
export let FormattedRegexExpression = pool.FormattedRegexExpression;
export let InlineJsExpression = pool.InlineJsExpression;
export let FormattedJsExpression = pool.FormattedJsExpression;
export let BooleanExpression = pool.BooleanExpression;
export let NullExpression = pool.NullExpression;
export let VoidExpression = pool.VoidExpression;
export let ArgExpression = pool.ArgExpression;
export let FunExpression = pool.FunExpression;
export let SelfExpression = pool.SelfExpression;
export let MeExpression = pool.MeExpression;
export let ClassMeExpression = pool.ClassMeExpression;
export let SuperExpression = pool.SuperExpression;
export let ParseSingleTokenError = pool.ParseSingleTokenError;
export let NoPatternMatchError = pool.NoPatternMatchError;

import "./c-expression-math-0.js";
export let PlusExpression = pool.PlusExpression;
export let MinusExpression = pool.MinusExpression;
export let TimesExpression = pool.TimesExpression;
export let OverExpression = pool.OverExpression;
export let EqualExpression = pool.EqualExpression;
export let NotEqualExpression = pool.NotEqualExpression;
export let LessThanExpression = pool.LessThanExpression;
export let GreaterThanExpression = pool.GreaterThanExpression;
export let LessThanOrEqualExpression = pool.LessThanOrEqualExpression;
export let GreaterThanOrEqualExpression = pool.GreaterThanOrEqualExpression;
export let OrExpression = pool.OrExpression;
export let AndExpression = pool.AndExpression;
export let NotExpression = pool.NotExpression;
export let PositiveExpression = pool.PositiveExpression;
export let NegativeExpression = pool.NegativeExpression;
export let RemExpression = pool.RemExpression;
export let ModExpression = pool.ModExpression;
export let PowerExpression = pool.PowerExpression;

import "./c-expression-object-0.js";
export let DotExpression = pool.DotExpression;
export let ObjectExpression = pool.ObjectExpression;
export let ArrayExpression = pool.ArrayExpression;

import "./c-expression-function-0.js";
export let ArrowFunctionExpression = pool.ArrowFunctionExpression;
export let DiamondFunctionExpression = pool.DiamondFunctionExpression;
export let DashFunctionExpression = pool.DashFunctionExpression;
export let ParenthesisCallExpression = pool.ParenthesisCallExpression;
export let BracketCallExpression = pool.BracketCallExpression;
export let BraceCallExpression = pool.BraceCallExpression;
export let SpaceCallExpression = pool.SpaceCallExpression;
export let PseudoCallExpression = pool.PseudoCallExpression;
export let DoExpression = pool.DoExpression;

import "./c-expression-condition-0.js";
export let IfExpression = pool.IfExpression;
export let PostIfExpression = pool.PostIfExpression;
export let MatchExpression = pool.MatchExpression;

import "./c-expression-exception-0.js";
export let TryExpression = pool.TryExpression;

import "./c-expression-variant-0.js";
export let NormalVariantExpression = pool.NormalVariantExpression;
export let OkVariantExpression = pool.OkVariantExpression;
export let FunctionVariantExpression = pool.FunctionVariantExpression;
export let VariantNameError = pool.VariantNameError;

import "./c-expression-relation-0.js";
export let InExpression = pool.InExpression;
export let NotInExpression = pool.NotInExpression;
export let IsExpression = pool.IsExpression;
export let IsntExpression = pool.IsntExpression;

import "./c-expression-external-0.js";
export let PipeExpression = pool.PipeExpression;

import "./c-expression-class-0.js";
export let ClassExpression = pool.ClassExpression;

import "./c-expression-module-0.js";
export let ImportExpression = pool.ImportExpression;
export let ExportAsExpression = pool.ExportAsExpression;

import "./c-expression-misc-0.js";
export let AsExpression = pool.AsExpression;
export let IfvoidExpression = pool.IfvoidExpression;
export let IfnullExpression = pool.IfnullExpression;

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
