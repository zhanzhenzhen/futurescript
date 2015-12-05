import {test, assert} from "./c-base-0.js";
import * as $lex from "../lib/c-lex-0.js";
import * as $block from "../lib/c-block-0.js";

let lex, result, block;

test(() => {
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
assert(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "a"
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
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "b"
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
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "c"
            }
        ]
        value: ParenthesisCallExpression {
            arguments: Arr [
                NumberExpression "5"
                NumberExpression "6"
            ]
            callee: VariableExpression "abc"
        }
    }
    ExpressionStatement {
        expression: IfExpression {
            condition: VariableExpression "a"
            elseBranch: Block [
                AssignStatement {
                    assignees: Arr [
                        VariableAssignee {
                            export: false
                            ifnull: false
                            ifvoid: false
                            variable: LocalVariable "c"
                        }
                    ]
                    value: NumberExpression "5"
                }
                AssignStatement {
                    assignees: Arr [
                        VariableAssignee {
                            export: false
                            ifnull: false
                            ifvoid: false
                            variable: LocalVariable "b"
                        }
                    ]
                    value: VariableExpression "c"
                }
            ]
            thenBranch: Block [
                AssignStatement {
                    assignees: Arr [
                        VariableAssignee {
                            export: false
                            ifnull: false
                            ifvoid: false
                            variable: LocalVariable "c"
                        }
                    ]
                    value: NumberExpression "7"
                }
            ]
        }
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "d"
            }
        ]
        value: PseudoCallExpression {
            arguments: Arr [
                StringExpression "xxx"
            ]
            callee: InlineNormalStringExpression
        }
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "e"
            }
        ]
        value: DotExpression {
            x: DotExpression {
                x: VariableExpression "a"
                y: Piece "b"
            }
            y: Piece "c"
        }
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "f"
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
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "g"
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
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "h"
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
                    y: Piece "PI"
                }
            }
            elseBranch: Block [
                ExpressionStatement {
                    expression: NumberExpression "2"
                }
            ]
            thenBranch: Block [
                ExpressionStatement {
                    expression: NumberExpression "1"
                }
            ]
        }
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "i"
            }
        ]
        value: ArrowFunctionExpression {
            arguments: Arr [
                ArrowArgument {
                    nullDefault: null
                    variable: LocalVariable "x"
                    voidDefault: null
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
assert(block.hasCompilerDirective("node module"));
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
a: [1, 2, 3]
a: {a: 1, b: 2}
a.b: 1
a.(b): 1
a."b": 1
a: b.(c)
a: b."c"
a: b.0
a.0: b
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "a"
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
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "a"
            }
        ]
        value: ObjectExpression {
            value: Arr [
                Xy {
                    x: Piece "a"
                    y: NumberExpression "1"
                }
                Xy {
                    x: Piece "b"
                    y: NumberExpression "2"
                }
            ]
        }
    }
    AssignStatement {
        assignees: Arr [
            DotAssignee {
                export: false
                ifnull: false
                ifvoid: false
                x: VariableExpression "a"
                y: Piece "b"
            }
        ]
        value: NumberExpression "1"
    }
    AssignStatement {
        assignees: Arr [
            DotAssignee {
                export: false
                ifnull: false
                ifvoid: false
                x: VariableExpression "a"
                y: VariableExpression "b"
            }
        ]
        value: NumberExpression "1"
    }
    AssignStatement {
        assignees: Arr [
            DotAssignee {
                export: false
                ifnull: false
                ifvoid: false
                x: VariableExpression "a"
                y: PseudoCallExpression {
                    arguments: Arr [
                        StringExpression "b"
                    ]
                    callee: InlineNormalStringExpression
                }
            }
        ]
        value: NumberExpression "1"
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "a"
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
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "a"
            }
        ]
        value: DotExpression {
            x: VariableExpression "b"
            y: PseudoCallExpression {
                arguments: Arr [
                    StringExpression "c"
                ]
                callee: InlineNormalStringExpression
            }
        }
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "a"
            }
        ]
        value: DotExpression {
            x: VariableExpression "b"
            y: NumberExpression "0"
        }
    }
    AssignStatement {
        assignees: Arr [
            DotAssignee {
                export: false
                ifnull: false
                ifvoid: false
                x: VariableExpression "a"
                y: NumberExpression "0"
            }
        ]
        value: VariableExpression "b"
    }
]
`);
}); // ============================================================

test(() => {
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
assert(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "a"
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
                    elseBranch: Block [
                        ExpressionStatement {
                            expression: VariableExpression "ggg"
                        }
                    ]
                    thenBranch: Block [
                        ExpressionStatement {
                            expression: VariableExpression "fff"
                        }
                    ]
                }
            }
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
a b c
a(b(c))
a(b)(c)
x.(a) b(c)
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    ExpressionStatement {
        expression: ParenthesisCallExpression {
            arguments: Arr [
                ParenthesisCallExpression {
                    arguments: Arr [
                        VariableExpression "c"
                    ]
                    callee: VariableExpression "b"
                }
            ]
            callee: VariableExpression "a"
        }
    }
    ExpressionStatement {
        expression: ParenthesisCallExpression {
            arguments: Arr [
                ParenthesisCallExpression {
                    arguments: Arr [
                        VariableExpression "c"
                    ]
                    callee: VariableExpression "b"
                }
            ]
            callee: VariableExpression "a"
        }
    }
    ExpressionStatement {
        expression: ParenthesisCallExpression {
            arguments: Arr [
                VariableExpression "c"
            ]
            callee: ParenthesisCallExpression {
                arguments: Arr [
                    VariableExpression "b"
                ]
                callee: VariableExpression "a"
            }
        }
    }
    ExpressionStatement {
        expression: ParenthesisCallExpression {
            arguments: Arr [
                ParenthesisCallExpression {
                    arguments: Arr [
                        VariableExpression "c"
                    ]
                    callee: VariableExpression "b"
                }
            ]
            callee: DotExpression {
                x: VariableExpression "x"
                y: VariableExpression "a"
            }
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
a:
    if b = null or b = void
        true
    else
        false
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "a"
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
            elseBranch: Block [
                ExpressionStatement {
                    expression: BooleanExpression "false"
                }
            ]
            thenBranch: Block [
                ExpressionStatement {
                    expression: BooleanExpression "true"
                }
            ]
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
a: +1 - (-a)
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "a"
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
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
a as b as c
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    ExpressionStatement {
        expression: AsExpression {
            assignee: VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "c"
            }
            value: AsExpression {
                assignee: VariableAssignee {
                    export: false
                    ifnull: false
                    ifvoid: false
                    variable: LocalVariable "b"
                }
                value: VariableExpression "a"
            }
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
[a, b]: [b, a]
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            BracketAssignees [
                VariableAssignee {
                    export: false
                    ifnull: false
                    ifvoid: false
                    variable: LocalVariable "a"
                }
                VariableAssignee {
                    export: false
                    ifnull: false
                    ifvoid: false
                    variable: LocalVariable "b"
                }
            ]
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
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
a[b].c
a{b: 3}.c
a [b].c
a {b: 3}.c
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    ExpressionStatement {
        expression: DotExpression {
            x: ParenthesisCallExpression {
                arguments: Arr [
                    ArrayExpression {
                        value: Arr [
                            VariableExpression "b"
                        ]
                    }
                ]
                callee: VariableExpression "a"
            }
            y: Piece "c"
        }
    }
    ExpressionStatement {
        expression: DotExpression {
            x: ParenthesisCallExpression {
                arguments: Arr [
                    ObjectExpression {
                        value: Arr [
                            Xy {
                                x: Piece "b"
                                y: NumberExpression "3"
                            }
                        ]
                    }
                ]
                callee: VariableExpression "a"
            }
            y: Piece "c"
        }
    }
    ExpressionStatement {
        expression: ParenthesisCallExpression {
            arguments: Arr [
                DotExpression {
                    x: ArrayExpression {
                        value: Arr [
                            VariableExpression "b"
                        ]
                    }
                    y: Piece "c"
                }
            ]
            callee: VariableExpression "a"
        }
    }
    ExpressionStatement {
        expression: ParenthesisCallExpression {
            arguments: Arr [
                DotExpression {
                    x: ObjectExpression {
                        value: Arr [
                            Xy {
                                x: Piece "b"
                                y: NumberExpression "3"
                            }
                        ]
                    }
                    y: Piece "c"
                }
            ]
            callee: VariableExpression "a"
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
a: b.c'ok.d
a: b'(c)
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "a"
            }
        ]
        value: DotExpression {
            x: OkVariantExpression {
                x: DotExpression {
                    x: VariableExpression "b"
                    y: Piece "c"
                }
            }
            y: Piece "d"
        }
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "a"
            }
        ]
        value: ParenthesisCallExpression {
            arguments: Arr [
                VariableExpression "c"
            ]
            callee: FunctionVariantExpression {
                x: VariableExpression "b"
            }
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
a: b in c
a: b not in c
a: b is Number
a: b isnt Number
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "a"
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
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "a"
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
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "a"
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
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "a"
            }
        ]
        value: IsntExpression {
            x: VariableExpression "b"
            y: VariableExpression "Number"
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
a: b ifnull c
a: b ifvoid c
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "a"
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
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "a"
            }
        ]
        value: IfvoidExpression {
            x: VariableExpression "b"
            y: VariableExpression "c"
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
undefined: 3
a: <>
    undefined: self + 1
`);
block = new $block.RootBlock(lex);
block.complyWithJs();
assert(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "var_573300145710716007_0"
            }
        ]
        value: NumberExpression "3"
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "a"
            }
        ]
        value: DiamondFunctionExpression {
            body: ScopeBlock [
                AssignStatement {
                    assignees: Arr [
                        VariableAssignee {
                            export: false
                            ifnull: false
                            ifvoid: false
                            variable: LocalVariable "var_573300145710716007_0"
                        }
                    ]
                    value: PlusExpression {
                        x: SelfExpression
                        y: NumberExpression "1"
                    }
                }
            ]
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
a: <> "abc\\(@0)def"
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "a"
            }
        ]
        value: DiamondFunctionExpression {
            body: ScopeBlock [
                ExpressionStatement {
                    expression: PseudoCallExpression {
                        arguments: Arr [
                            PlusExpression {
                                x: PlusExpression {
                                    x: StringExpression "abc"
                                    y: DotExpression {
                                        x: ArgExpression
                                        y: NumberExpression "0"
                                    }
                                }
                                y: StringExpression "def"
                            }
                        ]
                        callee: InlineNormalStringExpression
                    }
                }
            ]
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
throw Error()
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    ThrowStatement {
        value: ParenthesisCallExpression {
            arguments: Arr [
            ]
            callee: VariableExpression "Error"
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
delete a.b
delete a.b."c"
delete a.b.(c)
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    DeleteStatement {
        x: VariableExpression "a"
        y: Piece "b"
    }
    DeleteStatement {
        x: DotExpression {
            x: VariableExpression "a"
            y: Piece "b"
        }
        y: PseudoCallExpression {
            arguments: Arr [
                StringExpression "c"
            ]
            callee: InlineNormalStringExpression
        }
    }
    DeleteStatement {
        x: DotExpression {
            x: VariableExpression "a"
            y: Piece "b"
        }
        y: VariableExpression "c"
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
do -- 3 + 5
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    ExpressionStatement {
        expression: DoExpression {
            function: DashFunctionExpression {
                body: ScopeBlock [
                    ExpressionStatement {
                        expression: PlusExpression {
                            x: NumberExpression "3"
                            y: NumberExpression "5"
                        }
                    }
                ]
            }
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
[]
{}
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    ExpressionStatement {
        expression: ArrayExpression {
            value: Arr [
            ]
        }
    }
    ExpressionStatement {
        expression: ObjectExpression {
            value: Arr [
            ]
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
a'ok(1)
a'ok[1]
a'ok{}
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    ExpressionStatement {
        expression: ParenthesisCallExpression {
            arguments: Arr [
                NumberExpression "1"
            ]
            callee: OkVariantExpression {
                x: VariableExpression "a"
            }
        }
    }
    ExpressionStatement {
        expression: ParenthesisCallExpression {
            arguments: Arr [
                ArrayExpression {
                    value: Arr [
                        NumberExpression "1"
                    ]
                }
            ]
            callee: OkVariantExpression {
                x: VariableExpression "a"
            }
        }
    }
    ExpressionStatement {
        expression: ParenthesisCallExpression {
            arguments: Arr [
                ObjectExpression {
                    value: Arr [
                    ]
                }
            ]
            callee: OkVariantExpression {
                x: VariableExpression "a"
            }
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
[3, 4, 5] |> u.map(x -> x * 2) :: map(x -> x + 1) |> u.max
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    ExpressionStatement {
        expression: PipeExpression {
            x: ParenthesisCallExpression {
                arguments: Arr [
                    ArrowFunctionExpression {
                        arguments: Arr [
                            ArrowArgument {
                                nullDefault: null
                                variable: LocalVariable "x"
                                voidDefault: null
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
                ]
                callee: DotExpression {
                    x: PipeExpression {
                        x: ArrayExpression {
                            value: Arr [
                                NumberExpression "3"
                                NumberExpression "4"
                                NumberExpression "5"
                            ]
                        }
                        y: ParenthesisCallExpression {
                            arguments: Arr [
                                ArrowFunctionExpression {
                                    arguments: Arr [
                                        ArrowArgument {
                                            nullDefault: null
                                            variable: LocalVariable "x"
                                            voidDefault: null
                                        }
                                    ]
                                    body: ScopeBlock [
                                        ExpressionStatement {
                                            expression: TimesExpression {
                                                x: VariableExpression "x"
                                                y: NumberExpression "2"
                                            }
                                        }
                                    ]
                                }
                            ]
                            callee: DotExpression {
                                x: VariableExpression "u"
                                y: Piece "map"
                            }
                        }
                    }
                    y: Piece "map"
                }
            }
            y: DotExpression {
                x: VariableExpression "u"
                y: Piece "max"
            }
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
a: r"aaa"gim
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "a"
            }
        ]
        value: PseudoCallExpression {
            arguments: Arr [
                StringExpression "aaa"
                PostQuoteExpression "gim"
            ]
            callee: InlineRegexExpression
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
###
header comment
###
console.log "haha"
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
###
header comment
###
RootBlock [
    ExpressionStatement {
        expression: ParenthesisCallExpression {
            arguments: Arr [
                PseudoCallExpression {
                    arguments: Arr [
                        StringExpression "haha"
                    ]
                    callee: InlineNormalStringExpression
                }
            ]
            callee: DotExpression {
                x: VariableExpression "console"
                y: Piece "log"
            }
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
[undefined, instanceof]: [1, 2]
`);
block = new $block.RootBlock(lex);
block.complyWithJs();
assert(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            BracketAssignees [
                VariableAssignee {
                    export: false
                    ifnull: false
                    ifvoid: false
                    variable: LocalVariable "var_573300145710716007_0"
                }
                VariableAssignee {
                    export: false
                    ifnull: false
                    ifvoid: false
                    variable: LocalVariable "var_573300145710716007_1"
                }
            ]
        ]
        value: ArrayExpression {
            value: Arr [
                NumberExpression "1"
                NumberExpression "2"
            ]
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
undefined()
`);
block = new $block.RootBlock(lex);
assert.throws(() => {
    block.complyWithJs();
});
}); // ============================================================
