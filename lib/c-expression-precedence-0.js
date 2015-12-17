import * as $node from "./c-node-0.js";

// Biggest (traditional: lowest) on top, smallest (traditional: highest) on bottom.
// Each element is called a precedence group.
// `leftToRight=true` means the traditional right-to-left.
// `leftToRight=false` means the traditional left-to-right.
// So both precendence and associativity are in reverse order than traditional concept.
// Note: the first and last groups are special. These 2 groups are left-to-right independent.
// Both true and false works, but it's better to set it to true because it's faster.
// Note: Atom expression classes and those only for abstract purposes shouldn't be in this list.
export let load = function() {
    $node.Expression.precedence = [
        {types: [
            $node.ArrayExpression,
            $node.ObjectExpression,
            $node.PostIfExpression,
            $node.MatchExpression,
            $node.TryExpression,
            $node.DoExpression,
            $node.ClassExpression
        ], leftToRight: true},
        {types: [
            $node.ArrowFunctionExpression,
            $node.DiamondFunctionExpression,
            $node.DashFunctionExpression
        ], leftToRight: true},
        {types: [$node.IfExpression], leftToRight: true},
        {types: [$node.SpaceCallExpression], leftToRight: true},
        {types: [$node.OrExpression], leftToRight: false},
        {types: [$node.AndExpression], leftToRight: false},
        {types: [$node.NotExpression], leftToRight: true},
        {types: [
            $node.EqualExpression,
            $node.NotEqualExpression,
            $node.LessThanExpression,
            $node.LessThanOrEqualExpression,
            $node.GreaterThanExpression,
            $node.GreaterThanOrEqualExpression
        ], leftToRight: false},
        {types: [
            $node.InExpression,
            $node.NotInExpression,
            $node.IsExpression,
            $node.IsntExpression
        ], leftToRight: false},
        {types: [$node.PlusExpression, $node.MinusExpression], leftToRight: false},
        {types: [
            $node.TimesExpression,
            $node.OverExpression,
            $node.RemExpression,
            $node.ModExpression
        ], leftToRight: false},
        {types: [$node.PowerExpression], leftToRight: true},
        {types: [$node.PositiveExpression, $node.NegativeExpression], leftToRight: true},
        {types: [$node.IfvoidExpression, $node.IfnullExpression], leftToRight: false},
        {types: [$node.AsExpression, $node.ExportAsExpression], leftToRight: false},
        {types: [$node.PipeExpression], leftToRight: false},
        {types: [
            $node.ParenthesisCallExpression,
            $node.BracketCallExpression,
            $node.BraceCallExpression,
            $node.DotExpression,
            $node.NormalVariantExpression,
            $node.FunctionVariantExpression,
            $node.ImportExpression
        ], leftToRight: false},
        {types: [$node.PseudoCallExpression], leftToRight: true}
    ];
};
