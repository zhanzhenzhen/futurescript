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
console.log(block.print() === `node module
RootBlock [
    AssignStatement {
        assignee: VariableExpression "a"
        value: PlusExpression {
            x: PlusExpression {
                x: NumberExpression "1"
                y: NumberExpression "2"
            }
            y: NumberExpression "3"
        }
    }
    AssignStatement {
        assignee: VariableExpression "b"
        value: PlusExpression {
            x: NumberExpression "2"
            y: NumberExpression "3"
        }
    }
    AssignStatement {
        assignee: VariableExpression "c"
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
                    assignee: VariableExpression "c"
                    value: NumberExpression "7"
                }
            ]
            elseBranch: Block [
                AssignStatement {
                    assignee: VariableExpression "c"
                    value: NumberExpression "5"
                }
                AssignStatement {
                    assignee: VariableExpression "b"
                    value: VariableExpression "c"
                }
            ]
        }
    }
    AssignStatement {
        assignee: VariableExpression "d"
        value: ParenthesisCallExpression {
            callee: InlineNormalStringExpression
            arguments: Arr [
                StringExpression "xxx"
            ]
        }
    }
    AssignStatement {
        assignee: VariableExpression "e"
        value: DotExpression {
            x: DotExpression {
                x: VariableExpression "a"
                y: Atom "b"
            }
            y: Atom "c"
        }
    }
    AssignStatement {
        assignee: VariableExpression "f"
        value: PlusExpression {
            x: NumberExpression "1"
            y: TimesExpression {
                x: NumberExpression "2"
                y: NumberExpression "3"
            }
        }
    }
    AssignStatement {
        assignee: VariableExpression "g"
        value: TimesExpression {
            x: PlusExpression {
                x: NumberExpression "1"
                y: NumberExpression "2"
            }
            y: NumberExpression "3"
        }
    }
    AssignStatement {
        assignee: VariableExpression "h"
        value: IfExpression {
            condition: GreaterThanExpression {
                x: PlusExpression {
                    x: VariableExpression "f"
                    y: VariableExpression "g"
                }
                y: DotExpression {
                    x: VariableExpression "Math"
                    y: Atom "PI"
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
        assignee: VariableExpression "i"
        value: ArrowFunctionExpression {
            arguments: Arr [
                Atom "x"
            ]
            body: PlusExpression {
                x: VariableExpression "x"
                y: NumberExpression "1"
            }
        }
    }
]
`);
console.log(block.hasCompilerDirective("node module"));

lex = new $lex.Lex(`lemo 0.1.0, node module
a: [1, 2, 3]
a: {a: 1, b: 2}
a.b: 1
`);
block = new $block.RootBlock(lex);
console.log(block.print() === `node module
RootBlock [
    AssignStatement {
        assignee: VariableExpression "a"
        value: ArrayExpression {
            value: Arr [
                NumberExpression "1"
                NumberExpression "2"
                NumberExpression "3"
            ]
        }
    }
    AssignStatement {
        assignee: VariableExpression "a"
        value: ObjectExpression {
            value: Arr [
                NameValue {
                    name: Atom "a"
                    value: NumberExpression "1"
                }
                NameValue {
                    name: Atom "b"
                    value: NumberExpression "2"
                }
            ]
        }
    }
    AssignStatement {
        assignee: DotExpression {
            x: VariableExpression "a"
            y: Atom "b"
        }
        value: NumberExpression "1"
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
console.log(block.print() === `node module
RootBlock [
    PostIfStatement {
        expression: IfExpression {
            condition: VariableExpression "b"
            thenBranch: Block [
                AssignStatement {
                    assignee: VariableExpression "a"
                    value: NumberExpression "1"
                }
            ]
            elseBranch: null
        }
    }
    PostIfStatement {
        expression: IfExpression {
            condition: VariableExpression "c"
            thenBranch: Block [
                ExpressionStatement {
                    expression: ArrowFunctionExpression {
                        arguments: Arr [
                            Atom "a"
                        ]
                        body: VariableExpression "b"
                    }
                }
            ]
            elseBranch: null
        }
    }
    ExpressionStatement {
        expression: IfExpression {
            condition: VariableExpression "a"
            thenBranch: null
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
            thenBranch: null
            elseBranch: null
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
            elseBranch: null
        }
    }
    AssignStatement {
        assignee: VariableExpression "a"
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
                        elseBranch: null
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
console.log(block.print() === `node module
RootBlock [
    AssignStatement {
        assignee: VariableExpression "a"
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
console.log(block.print() === `node module
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
console.log(block.print() === `node module
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
console.log(block.print() === `node module
RootBlock [
    ExpressionStatement {
        expression: MatchExpression {
            comparer: VariableExpression "a"
            items: Arr [
                NameValue {
                    name: NumberExpression "1"
                    value: NumberExpression "10"
                }
                NameValue {
                    name: NumberExpression "2"
                    value: NumberExpression "100"
                }
                NameValue {
                    name: null
                    value: NumberExpression "0"
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
console.log(block.print() === `node module
RootBlock [
    AssignStatement {
        assignee: VariableExpression "a"
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
