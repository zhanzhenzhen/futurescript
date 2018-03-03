import {test, assert, code} from "./test-base.js";
import * as $lex from "./lex.js";
import * as $node from "./node.js";

let lex, block;

test(() => {
lex = new $lex.Lex(code`, node modules
match a
    1 ? 10
    2 ? 100
    |   0
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ExpressionStatement {
        expression: MatchExpression {
            comparer: VariableExpression "a"
            items: Arr [
                Xy {
                    x: NumberExpression "1"
                    y: Block [
                        ExpressionStatement {
                            expression: NumberExpression "10"
                        }
                    ]
                }
                Xy {
                    x: NumberExpression "2"
                    y: Block [
                        ExpressionStatement {
                            expression: NumberExpression "100"
                        }
                    ]
                }
                Xy {
                    x: null
                    y: Block [
                        ExpressionStatement {
                            expression: NumberExpression "0"
                        }
                    ]
                }
            ]
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
match a
    1
        10
    2
        100
    |
        0
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ExpressionStatement {
        expression: MatchExpression {
            comparer: VariableExpression "a"
            items: Arr [
                Xy {
                    x: NumberExpression "1"
                    y: Block [
                        ExpressionStatement {
                            expression: NumberExpression "10"
                        }
                    ]
                }
                Xy {
                    x: NumberExpression "2"
                    y: Block [
                        ExpressionStatement {
                            expression: NumberExpression "100"
                        }
                    ]
                }
                Xy {
                    x: null
                    y: Block [
                        ExpressionStatement {
                            expression: NumberExpression "0"
                        }
                    ]
                }
            ]
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
match a
    1, |
        10
    2
        100
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ExpressionStatement {
        expression: MatchExpression {
            comparer: VariableExpression "a"
            items: Arr [
                Xy {
                    x: NumberExpression "1"
                    y: Block [
                        ExpressionStatement {
                            expression: NumberExpression "10"
                        }
                    ]
                }
                Xy {
                    x: NumberExpression "2"
                    y: Block [
                        ExpressionStatement {
                            expression: NumberExpression "100"
                        }
                    ]
                }
                Xy {
                    x: null
                    y: Block [
                        ExpressionStatement {
                            expression: NumberExpression "10"
                        }
                    ]
                }
            ]
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
match a
    1, 2
        10
    3
        100
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ExpressionStatement {
        expression: MatchExpression {
            comparer: VariableExpression "a"
            items: Arr [
                Xy {
                    x: OrPattern [
                        NumberExpression "1"
                        NumberExpression "2"
                    ]
                    y: Block [
                        ExpressionStatement {
                            expression: NumberExpression "10"
                        }
                    ]
                }
                Xy {
                    x: NumberExpression "3"
                    y: Block [
                        ExpressionStatement {
                            expression: NumberExpression "100"
                        }
                    ]
                }
            ]
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
match x -> a = x
    1, 2, 3, |
        10
    4
        100
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ExpressionStatement {
        expression: MatchExpression {
            comparer: ArrowFunctionExpression {
                arguments: Arr [
                    ArrowArgument {
                        nullDefault: null
                        variable: LocalVariable "x"
                        voidDefault: null
                    }
                ]
                argumentsHasSpread: false
                argumentsReal: true
                body: ScopeBlock [
                    ExpressionStatement {
                        expression: EqualExpression {
                            x: VariableExpression "a"
                            y: VariableExpression "x"
                        }
                    }
                ]
            }
            items: Arr [
                Xy {
                    x: OrPattern [
                        NumberExpression "1"
                        NumberExpression "2"
                        NumberExpression "3"
                    ]
                    y: Block [
                        ExpressionStatement {
                            expression: NumberExpression "10"
                        }
                    ]
                }
                Xy {
                    x: NumberExpression "4"
                    y: Block [
                        ExpressionStatement {
                            expression: NumberExpression "100"
                        }
                    ]
                }
                Xy {
                    x: null
                    y: Block [
                        ExpressionStatement {
                            expression: NumberExpression "10"
                        }
                    ]
                }
            ]
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
match a
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ExpressionStatement {
        expression: MatchExpression {
            comparer: VariableExpression "a"
            items: Arr [
            ]
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
match a
    1, | 10
    2  ? 100
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ExpressionStatement {
        expression: MatchExpression {
            comparer: VariableExpression "a"
            items: Arr [
                Xy {
                    x: NumberExpression "1"
                    y: Block [
                        ExpressionStatement {
                            expression: NumberExpression "10"
                        }
                    ]
                }
                Xy {
                    x: NumberExpression "2"
                    y: Block [
                        ExpressionStatement {
                            expression: NumberExpression "100"
                        }
                    ]
                }
                Xy {
                    x: null
                    y: Block [
                        ExpressionStatement {
                            expression: NumberExpression "10"
                        }
                    ]
                }
            ]
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
match a
    1 | 10
    2 ? 100
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ExpressionStatement {
        expression: MatchExpression {
            comparer: VariableExpression "a"
            items: Arr [
                Xy {
                    x: NumberExpression "1"
                    y: Block [
                        ExpressionStatement {
                            expression: NumberExpression "10"
                        }
                    ]
                }
                Xy {
                    x: NumberExpression "2"
                    y: Block [
                        ExpressionStatement {
                            expression: NumberExpression "100"
                        }
                    ]
                }
                Xy {
                    x: null
                    y: Block [
                        ExpressionStatement {
                            expression: NumberExpression "10"
                        }
                    ]
                }
            ]
        }
    }
]
`);
}); // ============================================================
