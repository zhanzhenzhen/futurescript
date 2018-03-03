import {test, assert, code} from "./test-base.js";
import * as $lex from "./lex.js";
import * as $node from "./node.js";

let lex, block;

test(() => {
lex = new $lex.Lex(code`, node modules
1 export as a
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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
lex = new $lex.Lex(code`, node modules
export abc
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ExportStatement {
        externalName: Piece "abc"
        variable: LocalVariable "abc"
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
export abc as def
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ExportStatement {
        externalName: Piece "def"
        variable: LocalVariable "abc"
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
export: abc
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ExportColonStatement {
        value: VariableExpression "abc"
    }
]
`);
}); // ============================================================
