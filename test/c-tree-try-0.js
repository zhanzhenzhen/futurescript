import * as $lex from "../lib/c-lex-0.js";
import * as $block from "../lib/c-block-0.js";

let lex, block;

lex = new $lex.Lex(`lemo 0.1.0, node module
try
    a
catch
    b
finally
    c
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
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

lex = new $lex.Lex(`lemo 0.1.0, node module
a:
    try
        b
    catch ex
        throw ex + 1
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
                variable: Piece "a"
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
                variable: Piece "ex"
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

lex = new $lex.Lex(`lemo 0.1.0, node module
a:
    try
        b
    catch undefined
        throw undefined + 1
`);
block = new $block.RootBlock(lex);
block.complyWithJs();
console.log(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: Piece "a"
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
                variable: Piece "var_573300145710716007_0"
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
