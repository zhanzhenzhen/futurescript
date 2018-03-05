import {test, assert, code} from "./test-base.js";
import * as $lex from "./lex.js";
import * as $node from "./node.js";

let lex, block;

test(async () => {
let lex = new $lex.Lex(code`, node modules
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
let block = await new $node.RootBlock(lex);
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

test(async () => {
let lex = new $lex.Lex(code`, node modules
[a, b]: [b, a]
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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

test(async () => {
let lex = new $lex.Lex(code`, node modules
if true then a: 1
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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

test(async () => {
let lex = new $lex.Lex(code`, node modules
<> a: 1
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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

test(async () => {
let lex = new $lex.Lex(code`, node modules
a as b as c
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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

test(async () => {
let lex = new $lex.Lex(code`, node modules
a as b."c"
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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

test(async () => {
let lex = new $lex.Lex(code`, node modules
[a.b, a.c]: b
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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

test(async () => {
let lex = new $lex.Lex(code`, node modules
a'export: 1
2 as b'export
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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

test(async () => {
let lex = new $lex.Lex(code`, node modules
undefined'export: 1
2 as instanceof'export
`);
let block = await new $node.RootBlock(lex);
block.complyWithJs();
assert(block.toString() === `node modules
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
