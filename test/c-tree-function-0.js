import * as $lex from "../lib/c-lex-0.js";
import * as $block from "../lib/c-block-0.js";

let lex, block;

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
                        callee: DotExpression {
                            x: VariableExpression "Math"
                            y: Piece "random"
                        }
                    }
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
                variable: LocalVariable "b"
            }
        ]
        value: DashFunctionExpression {
            body: ScopeBlock [
                ExpressionStatement {
                    expression: ParenthesisCallExpression {
                        arguments: Arr [
                        ]
                        callee: DotExpression {
                            x: VariableExpression "Math"
                            y: Piece "random"
                        }
                    }
                }
            ]
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
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "a"
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
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "a"
            }
        ]
        value: ArrowFunctionExpression {
            arguments: Arr [
                ArrowArgument {
                    nullDefault: null
                    variable: LocalVariable "x"
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
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "a"
            }
        ]
        value: ArrowFunctionExpression {
            arguments: Arr [
                ArrowArgument {
                    nullDefault: NumberExpression "3"
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
