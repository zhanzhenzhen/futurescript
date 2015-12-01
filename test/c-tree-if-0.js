import * as $lex from "../lib/c-lex-0.js";
import * as $block from "../lib/c-block-0.js";

let lex, block;

lex = new $lex.Lex(`lemo 0.1.0, node module
a: 1 if b
x -> b if c
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
            elseBranch: null
            thenBranch: Block [
                AssignStatement {
                    assignees: Arr [
                        VariableAssignee {
                            export: false
                            ifnull: false
                            ifvoid: false
                            variable: LocalVariable "a"
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
            elseBranch: null
            thenBranch: Block [
                ExpressionStatement {
                    expression: ArrowFunctionExpression {
                        arguments: Arr [
                            ArrowArgument {
                                nullDefault: null
                                variable: LocalVariable "x"
                                voidDefault: null
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
            thenBranch: null
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
            thenBranch: Block [
                ExpressionStatement {
                    expression: NumberExpression "1"
                }
            ]
        }
    }
    ExpressionStatement {
        expression: IfExpression {
            condition: VariableExpression "a"
            elseBranch: Block [
            ]
            thenBranch: Block [
                ExpressionStatement {
                    expression: VariableExpression "b"
                }
            ]
        }
    }
    ExpressionStatement {
        expression: IfExpression {
            condition: VariableExpression "a"
            elseBranch: null
            thenBranch: null
        }
    }
    ExpressionStatement {
        expression: IfExpression {
            condition: VariableExpression "a"
            elseBranch: null
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
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "a"
            }
        ]
        value: IfExpression {
            condition: EqualExpression {
                x: VariableExpression "b"
                y: NumberExpression "5"
            }
            elseBranch: Block [
                ExpressionStatement {
                    expression: IfExpression {
                        condition: EqualExpression {
                            x: VariableExpression "c"
                            y: NumberExpression "6"
                        }
                        elseBranch: null
                        thenBranch: Block [
                            ExpressionStatement {
                                expression: NumberExpression "3"
                            }
                        ]
                    }
                }
            ]
            thenBranch: Block [
                ExpressionStatement {
                    expression: NumberExpression "4"
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
            elseBranch: Block [
                ExpressionStatement {
                    expression: IfExpression {
                        condition: VariableExpression "c"
                        elseBranch: Block [
                            ExpressionStatement {
                                expression: VariableExpression "e"
                            }
                        ]
                        thenBranch: Block [
                            ExpressionStatement {
                                expression: VariableExpression "d"
                            }
                        ]
                    }
                }
            ]
            thenBranch: Block [
                ExpressionStatement {
                    expression: VariableExpression "b"
                }
            ]
        }
    }
]
`);

lex = new $lex.Lex(`lemo 0.1.0, node module
if a = b throw
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
RootBlock [
    ExpressionStatement {
        expression: IfExpression {
            condition: EqualExpression {
                x: VariableExpression "a"
                y: VariableExpression "b"
            }
            elseBranch: null
            thenBranch: Block [
                ThrowStatement {
                    value: null
                }
            ]
        }
    }
]
`);
