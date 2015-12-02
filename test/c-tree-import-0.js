import {test, assert} from "./c-base-0.js";
import * as $lex from "../lib/c-lex-0.js";
import * as $block from "../lib/c-block-0.js";

let lex, block;

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
import "aaa"
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    ExpressionStatement {
        expression: ImportExpression {
            module: Piece "\\"aaa\\""
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
aaa: import "aaa"
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
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
                    variable: LocalVariable "aaa"
                }
                y: Piece "default"
            }
        ]
        module: Piece "\\"aaa\\""
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
import "aaa" as aaa
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
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
                    variable: LocalVariable "aaa"
                }
                y: Piece "default"
            }
        ]
        module: Piece "\\"aaa\\""
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
aaa: import "aaa" all
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    ImportStatement {
        batchall: false
        catchall: VariableAssignee {
            export: false
            ifnull: false
            ifvoid: false
            variable: LocalVariable "aaa"
        }
        mapping: null
        module: Piece "\\"aaa\\""
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
import "aaa" all as aaa
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    ImportStatement {
        batchall: false
        catchall: VariableAssignee {
            export: false
            ifnull: false
            ifvoid: false
            variable: LocalVariable "aaa"
        }
        mapping: null
        module: Piece "\\"aaa\\""
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
{a, b as c}: import "aaa"
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
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
                    variable: LocalVariable "a"
                }
                y: Piece "a"
            }
            Xy {
                x: VariableAssignee {
                    export: false
                    ifnull: false
                    ifvoid: false
                    variable: LocalVariable "c"
                }
                y: Piece "b"
            }
        ]
        module: Piece "\\"aaa\\""
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
{a, b as c}: import "aaa" all
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
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
                    variable: LocalVariable "a"
                }
                y: Piece "a"
            }
            Xy {
                x: VariableAssignee {
                    export: false
                    ifnull: false
                    ifvoid: false
                    variable: LocalVariable "c"
                }
                y: Piece "b"
            }
        ]
        module: Piece "\\"aaa\\""
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
import "aaa" as {a, b as c}
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
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
                    variable: LocalVariable "a"
                }
                y: Piece "a"
            }
            Xy {
                x: VariableAssignee {
                    export: false
                    ifnull: false
                    ifvoid: false
                    variable: LocalVariable "c"
                }
                y: Piece "b"
            }
        ]
        module: Piece "\\"aaa\\""
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
import "aaa" all as {a, b as c}
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
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
                    variable: LocalVariable "a"
                }
                y: Piece "a"
            }
            Xy {
                x: VariableAssignee {
                    export: false
                    ifnull: false
                    ifvoid: false
                    variable: LocalVariable "c"
                }
                y: Piece "b"
            }
        ]
        module: Piece "\\"aaa\\""
    }
]
`);
}); // ============================================================
