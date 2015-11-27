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
            module: PseudoCallExpression {
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
        module: PseudoCallExpression {
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
            module: PseudoCallExpression {
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
aaa: import "aaa" all
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
RootBlock [
    ImportStatement {
        batchall: false
        catchall: VariableAssignee {
            export: false
            ifnull: false
            ifvoid: false
            variable: Piece "aaa"
        }
        mapping: null
        module: PseudoCallExpression {
            arguments: Arr [
                StringExpression "aaa"
            ]
            callee: InlineNormalStringExpression
        }
    }
]
`);

lex = new $lex.Lex(`lemo 0.1.0, node module
import "aaa" all as aaa
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
RootBlock [
    ExpressionStatement {
        expression: ImportExpression {
            batchall: false
            catchall: VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: Piece "aaa"
            }
            mapping: null
            module: PseudoCallExpression {
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
{a, b as c}: import "aaa"
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
                    variable: Piece "a"
                }
                y: Piece "a"
            }
            Xy {
                x: VariableAssignee {
                    export: false
                    ifnull: false
                    ifvoid: false
                    variable: Piece "c"
                }
                y: Piece "b"
            }
        ]
        module: PseudoCallExpression {
            arguments: Arr [
                StringExpression "aaa"
            ]
            callee: InlineNormalStringExpression
        }
    }
]
`);

lex = new $lex.Lex(`lemo 0.1.0, node module
{a, b as c}: import "aaa" all
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
                    variable: Piece "a"
                }
                y: Piece "a"
            }
            Xy {
                x: VariableAssignee {
                    export: false
                    ifnull: false
                    ifvoid: false
                    variable: Piece "c"
                }
                y: Piece "b"
            }
        ]
        module: PseudoCallExpression {
            arguments: Arr [
                StringExpression "aaa"
            ]
            callee: InlineNormalStringExpression
        }
    }
]
`);

lex = new $lex.Lex(`lemo 0.1.0, node module
import "aaa" as {a, b as c}
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
                        variable: Piece "a"
                    }
                    y: Piece "a"
                }
                Xy {
                    x: VariableAssignee {
                        export: false
                        ifnull: false
                        ifvoid: false
                        variable: Piece "c"
                    }
                    y: Piece "b"
                }
            ]
            module: PseudoCallExpression {
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
import "aaa" all as {a, b as c}
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
                        variable: Piece "a"
                    }
                    y: Piece "a"
                }
                Xy {
                    x: VariableAssignee {
                        export: false
                        ifnull: false
                        ifvoid: false
                        variable: Piece "c"
                    }
                    y: Piece "b"
                }
            ]
            module: PseudoCallExpression {
                arguments: Arr [
                    StringExpression "aaa"
                ]
                callee: InlineNormalStringExpression
            }
        }
    }
]
`);
