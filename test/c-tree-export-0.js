import * as $lex from "../lib/c-lex-0.js";
import * as $block from "../lib/c-block-0.js";

let lex, block;

lex = new $lex.Lex(`lemo 0.1.0, node module
1 export as a
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
RootBlock [
    ExpressionStatement {
        expression: ExportAsExpression {
            externalName: Piece "a"
            value: NumberExpression "1"
        }
    }
]
`);
