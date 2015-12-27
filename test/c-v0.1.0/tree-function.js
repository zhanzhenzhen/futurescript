import {test, assert} from "../c-v0.1.0/base.js";
import * as $lex from "../../lib/c-v0.1.0/lex.js";
import * as $node from "../../lib/c-v0.1.0/node.js";

let lex, block;

test(() => {
lex = new $lex.Lex(`fus 0.1.0, node module
a: <> Math.random()
b: -- Math.random()
`);
block = new $node.RootBlock(lex);
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
                    expression: ParenthesisCallExpression {
                        arguments: Arr [
                        ]
                        callee: DotExpression {
                            x: VariableExpression "Math"
                            y: Piece "random"
                        }
                        new: false
                        nonew: false
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
                        new: false
                        nonew: false
                    }
                }
            ]
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`fus 0.1.0, node module
a: x ->
    x + 1
a: (x: 3) -> x + 1
a: (x ifnull: 3) -> x + 1
`);
block = new $node.RootBlock(lex);
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
        value: ArrowFunctionExpression {
            arguments: Arr [
                ArrowArgument {
                    nullDefault: null
                    variable: LocalVariable "x"
                    voidDefault: null
                }
            ]
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
}); // ============================================================

test(() => {
lex = new $lex.Lex(`fus 0.1.0, node module
a: [x, y] -> x + y
b: [w, x: 3, y ifnull: 4, z ifvoid: 1] -> w + x + y + z
`);
block = new $node.RootBlock(lex);
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
        value: ArrowFunctionExpression {
            arguments: Arr [
                ArrowArgument {
                    nullDefault: null
                    variable: LocalVariable "x"
                    voidDefault: null
                }
                ArrowArgument {
                    nullDefault: null
                    variable: LocalVariable "y"
                    voidDefault: null
                }
            ]
            argumentsReal: false
            body: ScopeBlock [
                ExpressionStatement {
                    expression: PlusExpression {
                        x: VariableExpression "x"
                        y: VariableExpression "y"
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
        value: ArrowFunctionExpression {
            arguments: Arr [
                ArrowArgument {
                    nullDefault: null
                    variable: LocalVariable "w"
                    voidDefault: null
                }
                ArrowArgument {
                    nullDefault: null
                    variable: LocalVariable "x"
                    voidDefault: NumberExpression "3"
                }
                ArrowArgument {
                    nullDefault: NumberExpression "4"
                    variable: LocalVariable "y"
                    voidDefault: null
                }
                ArrowArgument {
                    nullDefault: null
                    variable: LocalVariable "z"
                    voidDefault: NumberExpression "1"
                }
            ]
            argumentsReal: false
            body: ScopeBlock [
                ExpressionStatement {
                    expression: PlusExpression {
                        x: PlusExpression {
                            x: PlusExpression {
                                x: VariableExpression "w"
                                y: VariableExpression "x"
                            }
                            y: VariableExpression "y"
                        }
                        y: VariableExpression "z"
                    }
                }
            ]
        }
    }
]
`);
}); // ============================================================
