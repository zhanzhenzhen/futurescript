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
