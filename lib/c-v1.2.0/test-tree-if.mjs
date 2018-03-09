import {test, assert, code} from "./test-base.mjs";
import * as $lex from "./lex.mjs";
import * as $node from "./node.mjs";

test(async () => {
let lex = new $lex.Lex(code`, node modules
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
let block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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
                        argumentsHasSpread: false
                        argumentsReal: true
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
}); // ============================================================

test(async () => {
let lex = new $lex.Lex(code`, node modules
if a
    b
else if c
    d
else
    e
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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
}); // ============================================================

test(async () => {
let lex = new $lex.Lex(code`, node modules
if a = b throw
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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
}); // ============================================================
