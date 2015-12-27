import {test, assert} from "../c-v0.1.0/base.js";
import * as $lex from "../../lib/c-v0.1.0/lex.js";
import * as $node from "../../lib/c-v0.1.0/node.js";

let lex, block;

test(() => {
lex = new $lex.Lex(`fus 0.1.0, node module
1 export as a
`);
block = new $node.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    ExpressionStatement {
        expression: ExportAsExpression {
            externalName: Piece "a"
            value: NumberExpression "1"
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`fus 0.1.0, node module
export abc
`);
block = new $node.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    ExportStatement {
        externalName: Piece "abc"
        variable: LocalVariable "abc"
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`fus 0.1.0, node module
export abc as def
`);
block = new $node.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    ExportStatement {
        externalName: Piece "def"
        variable: LocalVariable "abc"
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`fus 0.1.0, node module
export: abc
`);
block = new $node.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    ExportColonStatement {
        value: VariableExpression "abc"
    }
]
`);
}); // ============================================================