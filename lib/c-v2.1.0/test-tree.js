import {test, assert, code} from "./test-base.js";
import * as $lex from "./lex.js";
import * as $node from "./node.js";

let lex, block;

test(async () => {
lex = new $lex.Lex(code`, node modules
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
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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
            new: false
            nonew: false
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
            argumentsHasSpread: false
            argumentsReal: true
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
assert(block.hasCompilerDirective("node modules"));
}); // ============================================================

test(async () => {
lex = new $lex.Lex(code`, node modules
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
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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

test(async () => {
lex = new $lex.Lex(code`, node modules
a b c
a(b(c))
a(b)(c)
x.(a) b(c)
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ExpressionStatement {
        expression: ParenthesisCallExpression {
            arguments: Arr [
                ParenthesisCallExpression {
                    arguments: Arr [
                        VariableExpression "c"
                    ]
                    callee: VariableExpression "b"
                    new: false
                    nonew: false
                }
            ]
            callee: VariableExpression "a"
            new: false
            nonew: false
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
                    new: false
                    nonew: false
                }
            ]
            callee: VariableExpression "a"
            new: false
            nonew: false
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
                new: false
                nonew: false
            }
            new: false
            nonew: false
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
                    new: false
                    nonew: false
                }
            ]
            callee: DotExpression {
                x: VariableExpression "x"
                y: VariableExpression "a"
            }
            new: false
            nonew: false
        }
    }
]
`);
}); // ============================================================

test(async () => {
lex = new $lex.Lex(code`, node modules
a:
    if b = null or b = void
        true
    else
        false
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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

test(async () => {
lex = new $lex.Lex(code`, node modules
a: +1 - (-a)
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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

test(async () => {
lex = new $lex.Lex(code`, node modules
a[b].c
a{b: 3}.c
a [b].c
a {b: 3}.c
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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
                new: false
                nonew: false
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
                new: false
                nonew: false
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
            new: false
            nonew: false
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
            new: false
            nonew: false
        }
    }
]
`);
}); // ============================================================

test(async () => {
lex = new $lex.Lex(code`, node modules
a: b.c'ok.d
a: b'(c)
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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
            new: false
            nonew: false
        }
    }
]
`);
}); // ============================================================

test(async () => {
lex = new $lex.Lex(code`, node modules
a: b in c
a: b not in c
a: b is Number
a: b isnt Number
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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

test(async () => {
lex = new $lex.Lex(code`, node modules
a: b ifnull c
a: b ifvoid c
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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

test(async () => {
lex = new $lex.Lex(code`, node modules
undefined: 3
a: <>
    undefined: self + 1
`);
block = await new $node.RootBlock(lex);
block.complyWithJs();
assert(block.toString() === `node modules
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

test(async () => {
lex = new $lex.Lex(code`, node modules
a: <> "abc\(@0)def"
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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

test(async () => {
lex = new $lex.Lex(code`, node modules
throw Error()
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ThrowStatement {
        value: ParenthesisCallExpression {
            arguments: Arr [
            ]
            callee: VariableExpression "Error"
            new: false
            nonew: false
        }
    }
]
`);
}); // ============================================================

test(async () => {
lex = new $lex.Lex(code`, node modules
delete a.b
delete a.b."c"
delete a.b.(c)
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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

test(async () => {
lex = new $lex.Lex(code`, node modules
do -- 3 + 5
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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

test(async () => {
lex = new $lex.Lex(code`, node modules
[]
{}
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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

test(async () => {
lex = new $lex.Lex(code`, node modules
a'ok(1)
a'ok[1]
a'ok{}
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ExpressionStatement {
        expression: ParenthesisCallExpression {
            arguments: Arr [
                NumberExpression "1"
            ]
            callee: OkVariantExpression {
                x: VariableExpression "a"
            }
            new: false
            nonew: false
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
            new: false
            nonew: false
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
            new: false
            nonew: false
        }
    }
]
`);
}); // ============================================================

test(async () => {
lex = new $lex.Lex(code`, node modules
[3, 4, 5] |> u.map(x -> x * 2) :: map(x -> x + 1) |> u.max
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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
                        argumentsHasSpread: false
                        argumentsReal: true
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
                                    argumentsHasSpread: false
                                    argumentsReal: true
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
                            new: false
                            nonew: false
                        }
                    }
                    y: Piece "map"
                }
                new: false
                nonew: false
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

test(async () => {
lex = new $lex.Lex(code`, node modules
a: r"aaa"gim
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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

test(async () => {
lex = new $lex.Lex(code`, node modules
###
header comment
###
console.log "haha"
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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
            new: false
            nonew: false
        }
    }
]
`);
}); // ============================================================

test(async () => {
lex = new $lex.Lex(code`, node modules
[undefined, instanceof]: [1, 2]
`);
block = await new $node.RootBlock(lex);
block.complyWithJs();
assert(block.toString() === `node modules
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

test(async () => {
lex = new $lex.Lex(code`, node modules
undefined()
`);
block = await new $node.RootBlock(lex);
assert.throws(() =>
{
    block.complyWithJs();
},
e => e instanceof $node.GlobalVariableNameError &&
    e.rawStart[0] === 1 && e.rawStart[1] === 0 &&
    e.rawEnd[0] === 1 && e.rawEnd[1] === 8
);
}); // ============================================================

test(async () => {
lex = new $lex.Lex(code`, node modules
a: <>
    b()
    pause
    c
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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
                    expression: ParenthesisCallExpression {
                        arguments: Arr [
                        ]
                        callee: VariableExpression "b"
                        new: false
                        nonew: false
                    }
                }
                PauseStatement {
                }
                ExpressionStatement {
                    expression: VariableExpression "c"
                }
            ]
        }
    }
]
`);
}); // ============================================================

test(async () => {
lex = new $lex.Lex(code`, node modules
Abc()
abc()
new abc()
nonew Abc()
new abc 5
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ExpressionStatement {
        expression: ParenthesisCallExpression {
            arguments: Arr [
            ]
            callee: VariableExpression "Abc"
            new: false
            nonew: false
        }
    }
    ExpressionStatement {
        expression: ParenthesisCallExpression {
            arguments: Arr [
            ]
            callee: VariableExpression "abc"
            new: false
            nonew: false
        }
    }
    ExpressionStatement {
        expression: ParenthesisCallExpression {
            arguments: Arr [
            ]
            callee: VariableExpression "abc"
            new: true
            nonew: false
        }
    }
    ExpressionStatement {
        expression: ParenthesisCallExpression {
            arguments: Arr [
            ]
            callee: VariableExpression "Abc"
            new: false
            nonew: true
        }
    }
    ExpressionStatement {
        expression: ParenthesisCallExpression {
            arguments: Arr [
                NumberExpression "5"
            ]
            callee: VariableExpression "abc"
            new: true
            nonew: false
        }
    }
]
`);
}); // ============================================================

test(async () => {
lex = new $lex.Lex(code`, node modules
new abc().def()
new a(b) c
new (a(b)) c
new a.b().c()
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ExpressionStatement {
        expression: ParenthesisCallExpression {
            arguments: Arr [
            ]
            callee: DotExpression {
                x: ParenthesisCallExpression {
                    arguments: Arr [
                    ]
                    callee: VariableExpression "abc"
                    new: true
                    nonew: false
                }
                y: Piece "def"
            }
            new: false
            nonew: false
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
                new: true
                nonew: false
            }
            new: false
            nonew: false
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
                new: false
                nonew: false
            }
            new: true
            nonew: false
        }
    }
    ExpressionStatement {
        expression: ParenthesisCallExpression {
            arguments: Arr [
            ]
            callee: DotExpression {
                x: ParenthesisCallExpression {
                    arguments: Arr [
                    ]
                    callee: DotExpression {
                        x: VariableExpression "a"
                        y: Piece "b"
                    }
                    new: true
                    nonew: false
                }
                y: Piece "c"
            }
            new: false
            nonew: false
        }
    }
]
`);
}); // ============================================================

test(async () => {
lex = new $lex.Lex(code`, node modules
do x ->
    do x ->
        abc(x)
`);
assert.throws(() =>
{
    block = await new $node.RootBlock(lex);
},
e => e instanceof $node.ScopeItemNameConflictError &&
    e.rawStart[0] === 2 && e.rawStart[1] === 7 &&
    e.rawEnd[0] === 2 && e.rawEnd[1] === 7
);
}); // ============================================================

test(async () => {
lex = new $lex.Lex(code`, node modules
{
    "a": 1
    (b): 2
    0: 3
    c: 4
}
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ExpressionStatement {
        expression: ObjectExpression {
            value: Arr [
                Xy {
                    x: PseudoCallExpression {
                        arguments: Arr [
                            StringExpression "a"
                        ]
                        callee: InlineNormalStringExpression
                    }
                    y: NumberExpression "1"
                }
                Xy {
                    x: VariableExpression "b"
                    y: NumberExpression "2"
                }
                Xy {
                    x: NumberExpression "0"
                    y: NumberExpression "3"
                }
                Xy {
                    x: Piece "c"
                    y: NumberExpression "4"
                }
            ]
        }
    }
]
`);
}); // ============================================================

test(async () => {
lex = new $lex.Lex(code`, node modules
a()'wait
`);
assert.throws(() =>
{
    block = await new $node.RootBlock(lex);
},
e => e instanceof $node.AsyncFunctionNotFoundError &&
    e.rawStart[0] === 1 && e.rawStart[1] === 0 &&
    e.rawEnd[0] === 1 && e.rawEnd[1] === 7
);
}); // ============================================================

test(async () => {
lex = new $lex.Lex(code`, node modules
--
    a()'wait
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ExpressionStatement {
        expression: DashFunctionExpression {
            body: ScopeBlock [
                ExpressionStatement {
                    expression: WaitExpression {
                        x: ParenthesisCallExpression {
                            arguments: Arr [
                            ]
                            callee: VariableExpression "a"
                            new: false
                            nonew: false
                        }
                    }
                }
            ]
        }
    }
]
`);
}); // ============================================================

test(async () => {
lex = new $lex.Lex(code`, node modules
3 < 4 ≤ 5
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ExpressionStatement {
        expression: ChainedCompareExpression {
            chain: Arr [
                NumberExpression "3"
                LessThan
                NumberExpression "4"
                LessThanOrEqual
                NumberExpression "5"
            ]
        }
    }
]
`);
}); // ============================================================

test(async () => {
lex = new $lex.Lex(code`, node modules
6 > 4 < 5
`);
assert.throws(() =>
{
    block = await new $node.RootBlock(lex);
},
e => e instanceof $node.NoPatternMatchError &&
    e.rawStart[0] === 1 && e.rawStart[1] === 0 &&
    e.rawEnd[0] === 1 && e.rawEnd[1] === 8
);
}); // ============================================================

test(async () => {
lex = new $lex.Lex(code`, node modules
(1) + (2)
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ExpressionStatement {
        expression: PlusExpression {
            x: NumberExpression "1"
            y: NumberExpression "2"
        }
    }
]
`);
}); // ============================================================

test(async () => {
lex = new $lex.Lex(code`, node modules
a.b()..c().d()
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ExpressionStatement {
        expression: ParenthesisCallExpression {
            arguments: Arr [
            ]
            callee: DotExpression {
                x: ParenthesisCallExpression {
                    arguments: Arr [
                    ]
                    callee: DotDotExpression {
                        x: ParenthesisCallExpression {
                            arguments: Arr [
                            ]
                            callee: DotExpression {
                                x: VariableExpression "a"
                                y: Piece "b"
                            }
                            new: false
                            nonew: false
                        }
                        y: Piece "c"
                    }
                    new: false
                    nonew: false
                }
                y: Piece "d"
            }
            new: false
            nonew: false
        }
    }
]
`);
}); // ============================================================

test(async () => {
lex = new $lex.Lex(code`, node modules
@
`);
assert.throws(() =>
{
    block = await new $node.RootBlock(lex);
},
e => e instanceof $node.ArgWithoutFunctionError &&
    e.rawStart[0] === 1 && e.rawStart[1] === 0 &&
    e.rawEnd[0] === 1 && e.rawEnd[1] === 0
);
}); // ============================================================

test(async () => {
lex = new $lex.Lex(code`, node modules
fun
`);
assert.throws(() =>
{
    block = await new $node.RootBlock(lex);
},
e => e instanceof $node.FunWithoutFunctionError &&
    e.rawStart[0] === 1 && e.rawStart[1] === 0 &&
    e.rawEnd[0] === 1 && e.rawEnd[1] === 2
);
}); // ============================================================

// In earlier versions, because it uses `{}` rather than `Object.create(null)`
// to create an object (for dictionary purposes), it can't have keys such as `toString`,
// and thus prevents the scope name from being stored in the compiler.
test(async () => {
lex = new $lex.Lex(code`, node modules
toString: 1
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "toString"
            }
        ]
        value: NumberExpression "1"
    }
]
`);
}); // ============================================================

test(async () => {
lex = new $lex.Lex(code`, node modules
a(
    1
    2
)
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ExpressionStatement {
        expression: ParenthesisCallExpression {
            arguments: Arr [
                NumberExpression "1"
                NumberExpression "2"
            ]
            callee: VariableExpression "a"
            new: false
            nonew: false
        }
    }
]
`);
}); // ============================================================
