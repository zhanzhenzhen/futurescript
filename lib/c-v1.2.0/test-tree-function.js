import {test, assert, code} from "./test-base.js";
import * as $lex from "./lex.js";
import * as $node from "./node.js";

let lex, block;

test(() => {
lex = new $lex.Lex(code`, node modules
a: <> Math.random()
b: -- Math.random()
`);
block = new $node.RootBlock(lex);
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
lex = new $lex.Lex(code`, node modules
a: x ->
    x + 1
a: (x: 3) -> x + 1
a: (x ifnull: 3) -> x + 1
`);
block = new $node.RootBlock(lex);
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
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
a: [x, y] -> x + y
b: [w, x: 3, y ifnull: 4, z ifvoid: 1] -> w + x + y + z
`);
block = new $node.RootBlock(lex);
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
            argumentsHasSpread: false
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
            argumentsHasSpread: false
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

test(() => {
lex = new $lex.Lex(code`, node modules
a: <>
b: --
c: x ->
`);
block = new $node.RootBlock(lex);
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
            ]
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
            ]
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
(x, y...) -> y
`);
block = new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ExpressionStatement {
        expression: ArrowFunctionExpression {
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
            argumentsHasSpread: true
            argumentsReal: true
            body: ScopeBlock [
                ExpressionStatement {
                    expression: VariableExpression "y"
                }
            ]
        }
    }
]
`);
}); // ============================================================
