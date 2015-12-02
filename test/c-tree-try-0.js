import {test, assert} from "./c-base-0.js";
import * as $lex from "../lib/c-lex-0.js";
import * as $block from "../lib/c-block-0.js";

let lex, block;

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
try
    a
catch
    b
finally
    c
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
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

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
a:
    try
        b
    catch ex
        throw ex + 1
`);
block = new $block.RootBlock(lex);
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

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
a:
    try
        b
    catch undefined
        throw undefined + 1
`);
block = new $block.RootBlock(lex);
block.complyWithJs();
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
