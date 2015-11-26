import * as $lex from "../lib/c-lex-0.js";
import * as $block from "../lib/c-block-0.js";

let lex, block;

lex = new $lex.Lex(`lemo 0.1.0, node module
import "aaa"
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
RootBlock [
    ExpressionStatement {
        expression: ImportExpression {
            batchall: false
            catchall: null
            mapping: null
            module: TinyCallExpression {
                arguments: Arr [
                    StringExpression "aaa"
                ]
                callee: InlineNormalStringExpression
            }
        }
    }
]
`);

lex = new $lex.Lex(`lemo 0.1.0, node module
aaa: import "aaa"
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
RootBlock [
    ImportStatement {
        batchall: false
        catchall: null
        mapping: Arr [
            Xy {
                x: VariableAssignee {
                    export: false
                    ifnull: false
                    ifvoid: false
                    variable: Piece "aaa"
                }
                y: Piece "default"
            }
        ]
        module: TinyCallExpression {
            arguments: Arr [
                StringExpression "aaa"
            ]
            callee: InlineNormalStringExpression
        }
    }
]
`);

lex = new $lex.Lex(`lemo 0.1.0, node module
import "aaa" as aaa
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
RootBlock [
    ExpressionStatement {
        expression: ImportExpression {
            batchall: false
            catchall: null
            mapping: Arr [
                Xy {
                    x: VariableAssignee {
                        export: false
                        ifnull: false
                        ifvoid: false
                        variable: Piece "aaa"
                    }
                    y: Piece "default"
                }
            ]
            module: TinyCallExpression {
                arguments: Arr [
                    StringExpression "aaa"
                ]
                callee: InlineNormalStringExpression
            }
        }
    }
]
`);
