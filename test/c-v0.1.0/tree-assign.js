import {test, assert} from "../c-v0.1.0/base.js";
import * as $lex from "../../lib/c-v0.1.0/lex.js";
import * as $node from "../../lib/c-v0.1.0/node.js";

let lex, block;

test(() => {
lex = new $lex.Lex(`fus 0.1.0, node module
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
lex = new $lex.Lex(`fus 0.1.0, node module
[a, b]: [b, a]
`);
block = new $node.RootBlock(lex);
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
lex = new $lex.Lex(`fus 0.1.0, node module
if true then a: 1
`);
block = new $node.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    ExpressionStatement {
        expression: IfExpression {
            condition: BooleanExpression "true"
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
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`fus 0.1.0, node module
<> a: 1
`);
block = new $node.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    ExpressionStatement {
        expression: DiamondFunctionExpression {
            body: ScopeBlock [
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
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`fus 0.1.0, node module
a as b as c
`);
block = new $node.RootBlock(lex);
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
lex = new $lex.Lex(`fus 0.1.0, node module
a as b."c"
`);
block = new $node.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    ExpressionStatement {
        expression: AsExpression {
            assignee: DotAssignee {
                export: false
                ifnull: false
                ifvoid: false
                x: VariableExpression "b"
                y: PseudoCallExpression {
                    arguments: Arr [
                        StringExpression "c"
                    ]
                    callee: InlineNormalStringExpression
                }
            }
            value: VariableExpression "a"
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`fus 0.1.0, node module
[a.b, a.c]: b
`);
block = new $node.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            BracketAssignees [
                DotAssignee {
                    export: false
                    ifnull: false
                    ifvoid: false
                    x: VariableExpression "a"
                    y: Piece "b"
                }
                DotAssignee {
                    export: false
                    ifnull: false
                    ifvoid: false
                    x: VariableExpression "a"
                    y: Piece "c"
                }
            ]
        ]
        value: VariableExpression "b"
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`fus 0.1.0, node module
a'export: 1
2 as b'export
`);
block = new $node.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: true
                ifnull: false
                ifvoid: false
                variable: LocalVariable "a"
            }
        ]
        value: NumberExpression "1"
    }
    ExpressionStatement {
        expression: AsExpression {
            assignee: VariableAssignee {
                export: true
                ifnull: false
                ifvoid: false
                variable: LocalVariable "b"
            }
            value: NumberExpression "2"
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`fus 0.1.0, node module
undefined'export: 1
2 as instanceof'export
`);
block = new $node.RootBlock(lex);
block.complyWithJs();
assert(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: Piece "undefined"
                ifnull: false
                ifvoid: false
                variable: LocalVariable "var_573300145710716007_0"
            }
        ]
        value: NumberExpression "1"
    }
    ExpressionStatement {
        expression: AsExpression {
            assignee: VariableAssignee {
                export: Piece "instanceof"
                ifnull: false
                ifvoid: false
                variable: LocalVariable "var_573300145710716007_1"
            }
            value: NumberExpression "2"
        }
    }
]
`);
}); // ============================================================
