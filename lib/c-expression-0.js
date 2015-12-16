// The structure indicates the code should be in a single file, but because it's too
// large I want to split them into files, then I found it difficult even using module.
// The difficulty lies in cyclic imports. The class name after `extends` is evaluated while
// module loading.
// So we here do a trick by using a "pool". The pool is dynamically filled (order is important),
// but the import and export structure is static. If an expression-related submodule want to
// use another submodule, it must use the $node. This module should only be used by
// non-expression modules.

import {pool} from "./c-expression-pool-0.js";

import "./c-expression-base-0.js";
export let Expression = $node.Expression;
export let AtomExpression = $node.AtomExpression;
export let BinaryExpression = $node.BinaryExpression;
export let UnaryExpression = $node.UnaryExpression;
export let VariableExpression = $node.VariableExpression;
export let NumberExpression = $node.NumberExpression;
export let StringExpression = $node.StringExpression;
export let PostQuoteExpression = $node.PostQuoteExpression;
export let InlineNormalStringExpression = $node.InlineNormalStringExpression;
export let FormattedNormalStringExpression = $node.FormattedNormalStringExpression;
export let InlineVerbatimStringExpression = $node.InlineVerbatimStringExpression;
export let FormattedVerbatimStringExpression = $node.FormattedVerbatimStringExpression;
export let InlineRegexExpression = $node.InlineRegexExpression;
export let FormattedRegexExpression = $node.FormattedRegexExpression;
export let InlineJsExpression = $node.InlineJsExpression;
export let FormattedJsExpression = $node.FormattedJsExpression;
export let BooleanExpression = $node.BooleanExpression;
export let NullExpression = $node.NullExpression;
export let VoidExpression = $node.VoidExpression;
export let ArgExpression = $node.ArgExpression;
export let FunExpression = $node.FunExpression;
export let SelfExpression = $node.SelfExpression;
export let MeExpression = $node.MeExpression;
export let ClassMeExpression = $node.ClassMeExpression;
export let SuperExpression = $node.SuperExpression;
export let ParseSingleTokenError = $node.ParseSingleTokenError;
export let NoPatternMatchError = $node.NoPatternMatchError;

import "./c-expression-math-0.js";
export let PlusExpression = $node.PlusExpression;
export let MinusExpression = $node.MinusExpression;
export let TimesExpression = $node.TimesExpression;
export let OverExpression = $node.OverExpression;
export let EqualExpression = $node.EqualExpression;
export let NotEqualExpression = $node.NotEqualExpression;
export let LessThanExpression = $node.LessThanExpression;
export let GreaterThanExpression = $node.GreaterThanExpression;
export let LessThanOrEqualExpression = $node.LessThanOrEqualExpression;
export let GreaterThanOrEqualExpression = $node.GreaterThanOrEqualExpression;
export let OrExpression = $node.OrExpression;
export let AndExpression = $node.AndExpression;
export let NotExpression = $node.NotExpression;
export let PositiveExpression = $node.PositiveExpression;
export let NegativeExpression = $node.NegativeExpression;
export let RemExpression = $node.RemExpression;
export let ModExpression = $node.ModExpression;
export let PowerExpression = $node.PowerExpression;

import "./c-expression-object-0.js";
export let DotExpression = $node.DotExpression;
export let ObjectExpression = $node.ObjectExpression;
export let ArrayExpression = $node.ArrayExpression;

import "./c-expression-function-0.js";
export let ArrowFunctionExpression = $node.ArrowFunctionExpression;
export let DiamondFunctionExpression = $node.DiamondFunctionExpression;
export let DashFunctionExpression = $node.DashFunctionExpression;
export let ParenthesisCallExpression = $node.ParenthesisCallExpression;
export let BracketCallExpression = $node.BracketCallExpression;
export let BraceCallExpression = $node.BraceCallExpression;
export let SpaceCallExpression = $node.SpaceCallExpression;
export let PseudoCallExpression = $node.PseudoCallExpression;
export let DoExpression = $node.DoExpression;

import "./c-expression-condition-0.js";
export let IfExpression = $node.IfExpression;
export let PostIfExpression = $node.PostIfExpression;
export let MatchExpression = $node.MatchExpression;

import "./c-expression-exception-0.js";
export let TryExpression = $node.TryExpression;

import "./c-expression-variant-0.js";
export let NormalVariantExpression = $node.NormalVariantExpression;
export let OkVariantExpression = $node.OkVariantExpression;
export let FunctionVariantExpression = $node.FunctionVariantExpression;
export let VariantNameError = $node.VariantNameError;

import "./c-expression-relation-0.js";
export let InExpression = $node.InExpression;
export let NotInExpression = $node.NotInExpression;
export let IsExpression = $node.IsExpression;
export let IsntExpression = $node.IsntExpression;

import "./c-expression-external-0.js";
export let PipeExpression = $node.PipeExpression;

import "./c-expression-class-0.js";
export let ClassExpression = $node.ClassExpression;

import "./c-expression-module-0.js";
export let ImportExpression = $node.ImportExpression;
export let ExportAsExpression = $node.ExportAsExpression;

import "./c-expression-misc-0.js";
export let AsExpression = $node.AsExpression;
export let IfvoidExpression = $node.IfvoidExpression;
export let IfnullExpression = $node.IfnullExpression;

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
