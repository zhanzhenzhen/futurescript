import * as $lex from "../lib/compile-lex-0";
import * as $block from "../lib/compile-block-0";
import assert from "assert";

let s = null;
let lex, result, block;

lex = new $lex.Lex(`lemo 0.1.0, node module
a: 1 + 2 + 3
b: 2 + 3
c: abc(5, 6)
if a
    c: 7
else
    c: 5
    b: c
d: "xxx"
e: a.b.c
f: 1 + 2 * 3
g: (1 + 2) * 3
h: f + g > Math.PI ? 1 | 2
i: x -> x + 1
`);
block = new $block.RootBlock(lex);
console.log(block.allScopeBlocks.length);
console.log(Object.keys(block.allScopeBlocks[0].getScopeItems()).length);
console.log(block.allScopeBlocks[0].getScopeItems());
console.log(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "a"
            }
        ]
        value: PlusExpression {
            x: PlusExpression {
                x: NumberExpression "1"
                y: NumberExpression "2"
            }
            y: NumberExpression "3"
        }
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "b"
            }
        ]
        value: PlusExpression {
            x: NumberExpression "2"
            y: NumberExpression "3"
        }
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "c"
            }
        ]
        value: ParenthesisCallExpression {
            callee: VariableExpression "abc"
            arguments: Arr [
                NumberExpression "5"
                NumberExpression "6"
            ]
        }
    }
    ExpressionStatement {
        expression: IfExpression {
            condition: VariableExpression "a"
            thenBranch: Block [
                AssignStatement {
                    assignees: Arr [
                        VariableAssignee {
                            variable: "c"
                        }
                    ]
                    value: NumberExpression "7"
                }
            ]
            elseBranch: Block [
                AssignStatement {
                    assignees: Arr [
                        VariableAssignee {
                            variable: "c"
                        }
                    ]
                    value: NumberExpression "5"
                }
                AssignStatement {
                    assignees: Arr [
                        VariableAssignee {
                            variable: "b"
                        }
                    ]
                    value: VariableExpression "c"
                }
            ]
        }
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "d"
            }
        ]
        value: ParenthesisCallExpression {
            callee: InlineNormalStringExpression
            arguments: Arr [
                StringExpression "xxx"
            ]
        }
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "e"
            }
        ]
        value: DotExpression {
            x: DotExpression {
                x: VariableExpression "a"
                y: "b"
            }
            y: "c"
        }
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "f"
            }
        ]
        value: PlusExpression {
            x: NumberExpression "1"
            y: TimesExpression {
                x: NumberExpression "2"
                y: NumberExpression "3"
            }
        }
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "g"
            }
        ]
        value: TimesExpression {
            x: PlusExpression {
                x: NumberExpression "1"
                y: NumberExpression "2"
            }
            y: NumberExpression "3"
        }
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "h"
            }
        ]
        value: IfExpression {
            condition: GreaterThanExpression {
                x: PlusExpression {
                    x: VariableExpression "f"
                    y: VariableExpression "g"
                }
                y: DotExpression {
                    x: VariableExpression "Math"
                    y: "PI"
                }
            }
            thenBranch: Block [
                ExpressionStatement {
                    expression: NumberExpression "1"
                }
            ]
            elseBranch: Block [
                ExpressionStatement {
                    expression: NumberExpression "2"
                }
            ]
        }
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "i"
            }
        ]
        value: ArrowFunctionExpression {
            arguments: Arr [
                ArrowArgument {
                    variable: "x"
                }
            ]
            body: ScopeBlock [
                ExpressionStatement {
                    expression: PlusExpression {
                        x: VariableExpression "x"
                        y: NumberExpression "1"
                    }
                }
            ]
        }
    }
]
`);
console.log(block.hasCompilerDirective("node module"));

lex = new $lex.Lex(`lemo 0.1.0, node module
a: [1, 2, 3]
a: {a: 1, b: 2}
a.b: 1
a.(b): 1
a."b": 1
a: b.(c)
a: b."c"
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "a"
            }
        ]
        value: ArrayExpression {
            value: Arr [
                NumberExpression "1"
                NumberExpression "2"
                NumberExpression "3"
            ]
        }
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "a"
            }
        ]
        value: ObjectExpression {
            value: Arr [
                Xy {
                    x: "a"
                    y: NumberExpression "1"
                }
                Xy {
                    x: "b"
                    y: NumberExpression "2"
                }
            ]
        }
    }
    AssignStatement {
        assignees: Arr [
            DotAssignee {
                x: VariableExpression "a"
                y: "b"
            }
        ]
        value: NumberExpression "1"
    }
    AssignStatement {
        assignees: Arr [
            DotAssignee {
                x: VariableExpression "a"
                y: VariableExpression "b"
            }
        ]
        value: NumberExpression "1"
    }
    AssignStatement {
        assignees: Arr [
            DotAssignee {
                x: VariableExpression "a"
                y: ParenthesisCallExpression {
                    callee: InlineNormalStringExpression
                    arguments: Arr [
                        StringExpression "b"
                    ]
                }
            }
        ]
        value: NumberExpression "1"
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "a"
            }
        ]
        value: DotExpression {
            x: VariableExpression "b"
            y: VariableExpression "c"
        }
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "a"
            }
        ]
        value: DotExpression {
            x: VariableExpression "b"
            y: ParenthesisCallExpression {
                callee: InlineNormalStringExpression
                arguments: Arr [
                    StringExpression "c"
                ]
            }
        }
    }
]
`);

lex = new $lex.Lex(`lemo 0.1.0, node module
a: 1 if b
a -> b if c
if a
else
    22
if a then
    1
else
    22
if a
    b
else
if a
if (
    a
)
    b
a: b = 5 ? 4 | c = 6 ? 3
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
RootBlock [
    PostIfStatement {
        expression: IfExpression {
            condition: VariableExpression "b"
            thenBranch: Block [
                AssignStatement {
                    assignees: Arr [
                        VariableAssignee {
                            variable: "a"
                        }
                    ]
                    value: NumberExpression "1"
                }
            ]
        }
    }
    PostIfStatement {
        expression: IfExpression {
            condition: VariableExpression "c"
            thenBranch: Block [
                ExpressionStatement {
                    expression: ArrowFunctionExpression {
                        arguments: Arr [
                            ArrowArgument {
                                variable: "a"
                            }
                        ]
                        body: ScopeBlock [
                            ExpressionStatement {
                                expression: VariableExpression "b"
                            }
                        ]
                    }
                }
            ]
        }
    }
    ExpressionStatement {
        expression: IfExpression {
            condition: VariableExpression "a"
            elseBranch: Block [
                ExpressionStatement {
                    expression: NumberExpression "22"
                }
            ]
        }
    }
    ExpressionStatement {
        expression: IfExpression {
            condition: VariableExpression "a"
            thenBranch: Block [
                ExpressionStatement {
                    expression: NumberExpression "1"
                }
            ]
            elseBranch: Block [
                ExpressionStatement {
                    expression: NumberExpression "22"
                }
            ]
        }
    }
    ExpressionStatement {
        expression: IfExpression {
            condition: VariableExpression "a"
            thenBranch: Block [
                ExpressionStatement {
                    expression: VariableExpression "b"
                }
            ]
            elseBranch: Block [
            ]
        }
    }
    ExpressionStatement {
        expression: IfExpression {
            condition: VariableExpression "a"
        }
    }
    ExpressionStatement {
        expression: IfExpression {
            condition: VariableExpression "a"
            thenBranch: Block [
                ExpressionStatement {
                    expression: VariableExpression "b"
                }
            ]
        }
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "a"
            }
        ]
        value: IfExpression {
            condition: EqualExpression {
                x: VariableExpression "b"
                y: NumberExpression "5"
            }
            thenBranch: Block [
                ExpressionStatement {
                    expression: NumberExpression "4"
                }
            ]
            elseBranch: Block [
                ExpressionStatement {
                    expression: IfExpression {
                        condition: EqualExpression {
                            x: VariableExpression "c"
                            y: NumberExpression "6"
                        }
                        thenBranch: Block [
                            ExpressionStatement {
                                expression: NumberExpression "3"
                            }
                        ]
                    }
                }
            ]
        }
    }
]
`);

lex = new $lex.Lex(`lemo 0.1.0, node module
a:
    aaa <= bbb or not mmm = nnn or ooo /= ppp
    or ccc =
        ddd
        + eee
    and
        if eee
            fff
        else
            ggg
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "a"
            }
        ]
        value: OrExpression {
            x: OrExpression {
                x: OrExpression {
                    x: LessThanOrEqualExpression {
                        x: VariableExpression "aaa"
                        y: VariableExpression "bbb"
                    }
                    y: NotExpression {
                        x: EqualExpression {
                            x: VariableExpression "mmm"
                            y: VariableExpression "nnn"
                        }
                    }
                }
                y: NotEqualExpression {
                    x: VariableExpression "ooo"
                    y: VariableExpression "ppp"
                }
            }
            y: AndExpression {
                x: EqualExpression {
                    x: VariableExpression "ccc"
                    y: PlusExpression {
                        x: VariableExpression "ddd"
                        y: VariableExpression "eee"
                    }
                }
                y: IfExpression {
                    condition: VariableExpression "eee"
                    thenBranch: Block [
                        ExpressionStatement {
                            expression: VariableExpression "fff"
                        }
                    ]
                    elseBranch: Block [
                        ExpressionStatement {
                            expression: VariableExpression "ggg"
                        }
                    ]
                }
            }
        }
    }
]
`);

lex = new $lex.Lex(`lemo 0.1.0, node module
a b c
a(b(c))
a(b)(c)
x.(a) b(c)
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
RootBlock [
    ExpressionStatement {
        expression: ParenthesisCallExpression {
            callee: VariableExpression "a"
            arguments: Arr [
                ParenthesisCallExpression {
                    callee: VariableExpression "b"
                    arguments: Arr [
                        VariableExpression "c"
                    ]
                }
            ]
        }
    }
    ExpressionStatement {
        expression: ParenthesisCallExpression {
            callee: VariableExpression "a"
            arguments: Arr [
                ParenthesisCallExpression {
                    callee: VariableExpression "b"
                    arguments: Arr [
                        VariableExpression "c"
                    ]
                }
            ]
        }
    }
    ExpressionStatement {
        expression: ParenthesisCallExpression {
            callee: ParenthesisCallExpression {
                callee: VariableExpression "a"
                arguments: Arr [
                    VariableExpression "b"
                ]
            }
            arguments: Arr [
                VariableExpression "c"
            ]
        }
    }
    ExpressionStatement {
        expression: ParenthesisCallExpression {
            callee: DotExpression {
                x: VariableExpression "x"
                y: VariableExpression "a"
            }
            arguments: Arr [
                ParenthesisCallExpression {
                    callee: VariableExpression "b"
                    arguments: Arr [
                        VariableExpression "c"
                    ]
                }
            ]
        }
    }
]
`);

lex = new $lex.Lex(`lemo 0.1.0, node module
if a
    b
else if c
    d
else
    e
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
RootBlock [
    ExpressionStatement {
        expression: IfExpression {
            condition: VariableExpression "a"
            thenBranch: Block [
                ExpressionStatement {
                    expression: VariableExpression "b"
                }
            ]
            elseBranch: Block [
                ExpressionStatement {
                    expression: IfExpression {
                        condition: VariableExpression "c"
                        thenBranch: Block [
                            ExpressionStatement {
                                expression: VariableExpression "d"
                            }
                        ]
                        elseBranch: Block [
                            ExpressionStatement {
                                expression: VariableExpression "e"
                            }
                        ]
                    }
                }
            ]
        }
    }
]
`);

lex = new $lex.Lex(`lemo 0.1.0, node module
match a
    1 ? 10
    2 ? 100
    |   0
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
RootBlock [
    ExpressionStatement {
        expression: MatchExpression {
            comparer: VariableExpression "a"
            items: Arr [
                Xy {
                    x: NumberExpression "1"
                    y: NumberExpression "10"
                }
                Xy {
                    x: NumberExpression "2"
                    y: NumberExpression "100"
                }
                Xy {
                    y: NumberExpression "0"
                }
            ]
        }
    }
]
`);

lex = new $lex.Lex(`lemo 0.1.0, node module
a:
    if b = null or b = void
        true
    else
        false
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "a"
            }
        ]
        value: IfExpression {
            condition: OrExpression {
                x: EqualExpression {
                    x: VariableExpression "b"
                    y: NullExpression
                }
                y: EqualExpression {
                    x: VariableExpression "b"
                    y: VoidExpression
                }
            }
            thenBranch: Block [
                ExpressionStatement {
                    expression: BooleanExpression "true"
                }
            ]
            elseBranch: Block [
                ExpressionStatement {
                    expression: BooleanExpression "false"
                }
            ]
        }
    }
]
`);

lex = new $lex.Lex(`lemo 0.1.0, node module
a: <> Math.random()
b: -- Math.random()
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "a"
            }
        ]
        value: DiamondFunctionExpression {
            body: ScopeBlock [
                ExpressionStatement {
                    expression: ParenthesisCallExpression {
                        callee: DotExpression {
                            x: VariableExpression "Math"
                            y: "random"
                        }
                        arguments: Arr [
                        ]
                    }
                }
            ]
        }
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "b"
            }
        ]
        value: DashFunctionExpression {
            body: ScopeBlock [
                ExpressionStatement {
                    expression: ParenthesisCallExpression {
                        callee: DotExpression {
                            x: VariableExpression "Math"
                            y: "random"
                        }
                        arguments: Arr [
                        ]
                    }
                }
            ]
        }
    }
]
`);

lex = new $lex.Lex(`lemo 0.1.0, node module
a: +1 - (-a)
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "a"
            }
        ]
        value: MinusExpression {
            x: PositiveExpression {
                x: NumberExpression "1"
            }
            y: NegativeExpression {
                x: VariableExpression "a"
            }
        }
    }
]
`);

lex = new $lex.Lex(`lemo 0.1.0, node module
a as b as c
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
RootBlock [
    ExpressionStatement {
        expression: AsExpression {
            value: AsExpression {
                value: VariableExpression "a"
                assignee: VariableAssignee {
                    variable: "b"
                }
            }
            assignee: VariableAssignee {
                variable: "c"
            }
        }
    }
]
`);

lex = new $lex.Lex(`lemo 0.1.0, node module
[a, b]: [b, a]
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            BracketAssignee {
                elements: Arr [
                    "a"
                    "b"
                ]
            }
        ]
        value: ArrayExpression {
            value: Arr [
                VariableExpression "b"
                VariableExpression "a"
            ]
        }
    }
]
`);

lex = new $lex.Lex(`lemo 0.1.0, node module
a[b].c
a{b: 3}.c
a [b].c
a {b: 3}.c
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
RootBlock [
    ExpressionStatement {
        expression: DotExpression {
            x: ParenthesisCallExpression {
                callee: VariableExpression "a"
                arguments: Arr [
                    ArrayExpression {
                        value: Arr [
                            VariableExpression "b"
                        ]
                    }
                ]
            }
            y: "c"
        }
    }
    ExpressionStatement {
        expression: DotExpression {
            x: ParenthesisCallExpression {
                callee: VariableExpression "a"
                arguments: Arr [
                    ObjectExpression {
                        value: Arr [
                            Xy {
                                x: "b"
                                y: NumberExpression "3"
                            }
                        ]
                    }
                ]
            }
            y: "c"
        }
    }
    ExpressionStatement {
        expression: ParenthesisCallExpression {
            callee: VariableExpression "a"
            arguments: Arr [
                DotExpression {
                    x: ArrayExpression {
                        value: Arr [
                            VariableExpression "b"
                        ]
                    }
                    y: "c"
                }
            ]
        }
    }
    ExpressionStatement {
        expression: ParenthesisCallExpression {
            callee: VariableExpression "a"
            arguments: Arr [
                DotExpression {
                    x: ObjectExpression {
                        value: Arr [
                            Xy {
                                x: "b"
                                y: NumberExpression "3"
                            }
                        ]
                    }
                    y: "c"
                }
            ]
        }
    }
]
`);

lex = new $lex.Lex(`lemo 0.1.0, node module
a: b.c'ok.d
a: b'(c)
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "a"
            }
        ]
        value: DotExpression {
            x: OkVariantExpression {
                x: DotExpression {
                    x: VariableExpression "b"
                    y: "c"
                }
            }
            y: "d"
        }
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "a"
            }
        ]
        value: ParenthesisCallExpression {
            callee: FunctionVariantExpression {
                x: VariableExpression "b"
            }
            arguments: Arr [
                VariableExpression "c"
            ]
        }
    }
]
`);

lex = new $lex.Lex(`lemo 0.1.0, node module
a: b in c
a: b not in c
a: b is Number
a: b isnt Number
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "a"
            }
        ]
        value: InExpression {
            x: VariableExpression "b"
            y: VariableExpression "c"
        }
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "a"
            }
        ]
        value: NotInExpression {
            x: VariableExpression "b"
            y: VariableExpression "c"
        }
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "a"
            }
        ]
        value: IsExpression {
            x: VariableExpression "b"
            y: VariableExpression "Number"
        }
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "a"
            }
        ]
        value: IsntExpression {
            x: VariableExpression "b"
            y: VariableExpression "Number"
        }
    }
]
`);

lex = new $lex.Lex(`lemo 0.1.0, node module
a: b ifnull c
a: b ifvoid c
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "a"
            }
        ]
        value: IfnullExpression {
            x: VariableExpression "b"
            y: VariableExpression "c"
        }
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "a"
            }
        ]
        value: IfvoidExpression {
            x: VariableExpression "b"
            y: VariableExpression "c"
        }
    }
]
`);

lex = new $lex.Lex(`lemo 0.1.0, node module
a: x ->
    x + 1
a: (x: 3) -> x + 1
a: (x ifnull: 3) -> x + 1
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "a"
            }
        ]
        value: ArrowFunctionExpression {
            arguments: Arr [
                ArrowArgument {
                    variable: "x"
                }
            ]
            body: ScopeBlock [
                ExpressionStatement {
                    expression: PlusExpression {
                        x: VariableExpression "x"
                        y: NumberExpression "1"
                    }
                }
            ]
        }
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "a"
            }
        ]
        value: ArrowFunctionExpression {
            arguments: Arr [
                ArrowArgument {
                    variable: "x"
                    voidDefault: NumberExpression "3"
                }
            ]
            body: ScopeBlock [
                ExpressionStatement {
                    expression: PlusExpression {
                        x: VariableExpression "x"
                        y: NumberExpression "1"
                    }
                }
            ]
        }
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                variable: "a"
            }
        ]
        value: ArrowFunctionExpression {
            arguments: Arr [
                ArrowArgument {
                    variable: "x"
                    nullDefault: NumberExpression "3"
                }
            ]
            body: ScopeBlock [
                ExpressionStatement {
                    expression: PlusExpression {
                        x: VariableExpression "x"
                        y: NumberExpression "1"
                    }
                }
            ]
        }
    }
]
`);

lex = new $lex.Lex(`lemo 0.1.0, node module
undefined: 3
a: <>
    undefined: self + 1
`);
block = new $block.RootBlock(lex);
block.antiConflict();
console.log(block.toString());
