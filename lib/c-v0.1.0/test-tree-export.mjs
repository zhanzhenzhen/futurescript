import {test, assert, code} from "./test-base.js";
import * as $lex from "./lex.js";
import * as $node from "./node.js";

test(async () => {
let lex = new $lex.Lex(code`, node modules
1 export as a
`);
let block = await new $node.RootBlock(lex);
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

test(async () => {
let lex = new $lex.Lex(code`, node modules
export abc
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ExportStatement {
        externalName: Piece "abc"
        variable: LocalVariable "abc"
    }
]
`);
}); // ============================================================

test(async () => {
let lex = new $lex.Lex(code`, node modules
export abc as def
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ExportStatement {
        externalName: Piece "def"
        variable: LocalVariable "abc"
    }
]
`);
}); // ============================================================

test(async () => {
let lex = new $lex.Lex(code`, node modules
export: abc
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ExportColonStatement {
        value: VariableExpression "abc"
    }
]
`);
}); // ============================================================
