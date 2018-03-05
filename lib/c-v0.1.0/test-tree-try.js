import {test, assert, code} from "./test-base.js";
import * as $lex from "./lex.js";
import * as $node from "./node.js";

let lex, block;

test(async () => {
let lex = new $lex.Lex(code`, node modules
try
    a
catch
    b
finally
    c
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ExpressionStatement {
        expression: TryExpression {
            catchBranch: Block [
                ExpressionStatement {
                    expression: VariableExpression "b"
                }
            ]
            catchVar: null
            finallyBranch: Block [
                ExpressionStatement {
                    expression: VariableExpression "c"
                }
            ]
            tryBranch: Block [
                ExpressionStatement {
                    expression: VariableExpression "a"
                }
            ]
        }
    }
]
`);
}); // ============================================================

test(async () => {
let lex = new $lex.Lex(code`, node modules
a:
    try
        b
    catch ex
        throw ex + 1
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
        value: TryExpression {
            catchBranch: Block [
                ThrowStatement {
                    value: PlusExpression {
                        x: VariableExpression "ex"
                        y: NumberExpression "1"
                    }
                }
            ]
            catchVar: VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "ex"
            }
            finallyBranch: null
            tryBranch: Block [
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
a:
    try
        b
    catch undefined
        throw undefined + 1
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
                variable: LocalVariable "a"
            }
        ]
        value: TryExpression {
            catchBranch: Block [
                ThrowStatement {
                    value: PlusExpression {
                        x: VariableExpression "var_573300145710716007_0"
                        y: NumberExpression "1"
                    }
                }
            ]
            catchVar: VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "var_573300145710716007_0"
            }
            finallyBranch: null
            tryBranch: Block [
                ExpressionStatement {
                    expression: VariableExpression "b"
                }
            ]
        }
    }
]
`);
}); // ============================================================
