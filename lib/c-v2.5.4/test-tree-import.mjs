import {test, assert, code} from "./test-base.mjs";
import * as $api from "../test-locked-api.mjs";
import * as $lex from "./lex.mjs";
import * as $node from "./node.mjs";

test(async () => {
let lex = new $lex.Lex(code`, node modules
import "aaa"
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === String.raw`node modules
RootBlock [
    ExpressionStatement {
        expression: ImportExpression {
            module: Piece "\"aaa\""
        }
    }
]
`);
}); // ============================================================

test(async () => {
let lex = new $lex.Lex(code`, node modules
aaa: import "aaa" + 1
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === String.raw`node modules
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
                module: Piece "\"aaa\""
            }
            y: NumberExpression "1"
        }
    }
]
`);
}); // ============================================================

test(async () => {
let lex = new $lex.Lex(code`, node modules
aaa: import "bbb" as ccc
`);
await assert.throws(async () =>
{
    let block = await new $node.RootBlock(lex);
},
e => e instanceof $node.NoPatternMatchError &&
    e.rawStart[0] === 1 && e.rawStart[1] === 5 &&
    e.rawEnd[0] === 1 && e.rawEnd[1] === 23
);
}); // ============================================================

test(async () => {
let lex = new $lex.Lex(code`, node modules
aaa: import "aaa"
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === String.raw`node modules
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
        module: Piece "\"aaa\""
    }
]
`);
}); // ============================================================

test(async () => {
let lex = new $lex.Lex(code`, node modules
import "aaa" as aaa
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === String.raw`node modules
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
        module: Piece "\"aaa\""
    }
]
`);
}); // ============================================================

test(async () => {
let lex = new $lex.Lex(code`, node modules
aaa: import "aaa" all
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === String.raw`node modules
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
        module: Piece "\"aaa\""
    }
]
`);
}); // ============================================================

test(async () => {
let lex = new $lex.Lex(code`, node modules
import "aaa" all as aaa
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === String.raw`node modules
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
        module: Piece "\"aaa\""
    }
]
`);
}); // ============================================================

test(async () => {
let lex = new $lex.Lex(code`, node modules
{a, b as c}: import "aaa"
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === String.raw`node modules
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
        module: Piece "\"aaa\""
    }
]
`);
}); // ============================================================

test(async () => {
let lex = new $lex.Lex(code`, node modules
{a, b as c}: import "aaa" all
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === String.raw`node modules
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
        module: Piece "\"aaa\""
    }
]
`);
}); // ============================================================

test(async () => {
let lex = new $lex.Lex(code`, node modules
import "aaa" as {a, b as c}
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === String.raw`node modules
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
        module: Piece "\"aaa\""
    }
]
`);
}); // ============================================================

test(async () => {
let lex = new $lex.Lex(code`, node modules
import "aaa" all as {a, b as c}
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === String.raw`node modules
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
        module: Piece "\"aaa\""
    }
]
`);
}); // ============================================================

test(async () => {
$api.writeTextFile($api.tempDirectory + "/a1.fus", code`, node modules
aaa'export: 1
bbb'export: 2
`);

$api.writeTextFile($api.tempDirectory + "/a2.fus", code`, node modules
import "./a1" all
`);
let lex = await new $lex.Lex(undefined, $api.tempDirectory + "/a2.fus");
let block = await new $node.RootBlock(lex);
assert(block.toString() === String.raw`node modules
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
        module: Piece "\"./a1\""
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
        module: Piece "\"./a1\""
    }
]
`);

$api.writeTextFile($api.tempDirectory + "/a3.fus", code`, node modules
import "./a1.fus" all
`);
lex = await new $lex.Lex(undefined, $api.tempDirectory + "/a3.fus");
block = await new $node.RootBlock(lex);
assert(block.toString() === String.raw`node modules
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
        module: Piece "\"./a1.fus\""
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
        module: Piece "\"./a1.fus\""
    }
]
`);

$api.writeTextFile($api.tempDirectory + "/a4.fus", code`, node modules
import "./a1.mjs" all
`);
lex = await new $lex.Lex(undefined, $api.tempDirectory + "/a4.fus");
block = await new $node.RootBlock(lex);
assert(block.toString() === String.raw`node modules
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
        module: Piece "\"./a1.mjs\""
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
        module: Piece "\"./a1.mjs\""
    }
]
`);

$api.writeTextFile($api.tempDirectory + "/a5.fus", code`, node modules
import "./a1.js" all
`);
lex = await new $lex.Lex(undefined, $api.tempDirectory + "/a5.fus");
block = await new $node.RootBlock(lex);
assert(block.toString() === String.raw`node modules
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
        module: Piece "\"./a1.js\""
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
        module: Piece "\"./a1.js\""
    }
]
`);
}); // ============================================================

test(async () => {
$api.writeTextFile($api.tempDirectory + "/b1", code`, node modules
aaa'export: 1
bbb'export: 2
`);

$api.writeTextFile($api.tempDirectory + "/b2.fus", code`, node modules
import "./b1" all
`);
let lex = await new $lex.Lex(undefined, $api.tempDirectory + "/b2.fus");
let block = await new $node.RootBlock(lex);
assert(block.toString() === String.raw`node modules
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
        module: Piece "\"./b1\""
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
        module: Piece "\"./b1\""
    }
]
`);

$api.writeTextFile($api.tempDirectory + "/b3.fus", code`, node modules
import "./b1.mjs" all
`);
lex = await new $lex.Lex(undefined, $api.tempDirectory + "/b3.fus");
block = await new $node.RootBlock(lex);
assert(block.toString() === String.raw`node modules
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
        module: Piece "\"./b1.mjs\""
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
        module: Piece "\"./b1.mjs\""
    }
]
`);

$api.writeTextFile($api.tempDirectory + "/b4.fus", code`, node modules
import "./b1.js" all
`);
lex = await new $lex.Lex(undefined, $api.tempDirectory + "/b4.fus");
block = await new $node.RootBlock(lex);
assert(block.toString() === String.raw`node modules
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
        module: Piece "\"./b1.js\""
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
        module: Piece "\"./b1.js\""
    }
]
`);
}); // ============================================================
