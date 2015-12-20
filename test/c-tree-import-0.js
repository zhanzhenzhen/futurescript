import {test, assert} from "./c-base-0.js";
import * as $lockedApi from "./locked-api.js";
import * as $lex from "../lib/c-lex-0.js";
import * as $node from "../lib/c-node-0.js";

let lex, block;

test(() => {
lex = new $lex.Lex(`fus 0.1.0, node module
import "aaa"
`);
block = new $node.RootBlock(lex);
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
lex = new $lex.Lex(`fus 0.1.0, node module
aaa: import "aaa" + 1
`);
block = new $node.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "aaa"
            }
        ]
        value: PlusExpression {
            x: ImportExpression {
                module: Piece "\\"aaa\\""
            }
            y: NumberExpression "1"
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`fus 0.1.0, node module
aaa: import "bbb" as ccc
`);
assert.throws(() =>
{
    block = new $node.RootBlock(lex);
},
e => e instanceof $node.NoPatternMatchError &&
    e.rawStart[0] === 1 && e.rawStart[1] === 5 &&
    e.rawEnd[0] === 1 && e.rawEnd[1] === 23
);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`fus 0.1.0, node module
aaa: import "aaa"
`);
block = new $node.RootBlock(lex);
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
lex = new $lex.Lex(`fus 0.1.0, node module
import "aaa" as aaa
`);
block = new $node.RootBlock(lex);
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
lex = new $lex.Lex(`fus 0.1.0, node module
aaa: import "aaa" all
`);
block = new $node.RootBlock(lex);
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
lex = new $lex.Lex(`fus 0.1.0, node module
import "aaa" all as aaa
`);
block = new $node.RootBlock(lex);
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
lex = new $lex.Lex(`fus 0.1.0, node module
{a, b as c}: import "aaa"
`);
block = new $node.RootBlock(lex);
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
lex = new $lex.Lex(`fus 0.1.0, node module
{a, b as c}: import "aaa" all
`);
block = new $node.RootBlock(lex);
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
lex = new $lex.Lex(`fus 0.1.0, node module
import "aaa" as {a, b as c}
`);
block = new $node.RootBlock(lex);
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
lex = new $lex.Lex(`fus 0.1.0, node module
import "aaa" all as {a, b as c}
`);
block = new $node.RootBlock(lex);
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
$lockedApi.writeTextFile("test/temp/a.fus", `fus 0.1.0, node module
aaa'export: 1
bbb'export: 2
`);
$lockedApi.writeTextFile("test/temp/b.fus", `fus 0.1.0, node module
import "./a" all
`);
lex = new $lex.Lex(undefined, "test/temp/b.fus");
block = new $node.RootBlock(lex);
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
                y: Piece "aaa"
            }
        ]
        module: Piece "\\"./a\\""
    }
    ImportStatement {
        batchall: false
        catchall: null
        mapping: Arr [
            Xy {
                x: VariableAssignee {
                    export: false
                    ifnull: false
                    ifvoid: false
                    variable: LocalVariable "bbb"
                }
                y: Piece "bbb"
            }
        ]
        module: Piece "\\"./a\\""
    }
]
`);
}); // ============================================================
