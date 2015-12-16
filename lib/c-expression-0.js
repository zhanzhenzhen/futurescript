export * from "./c-expression-module-0.js";
export * from "./c-expression-function-0.js";
export * from "./c-expression-math-0.js";
export * from "./c-expression-object-0.js";
export * from "./c-expression-condition-0.js";
export * from "./c-expression-exception-0.js";
export * from "./c-expression-variant-0.js";
export * from "./c-expression-relation-0.js";
export * from "./c-expression-external-0.js";
export * from "./c-expression-class-0.js";
export * from "./c-expression-misc-0.js";

export * from "./c-expression-base-0.js";

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
