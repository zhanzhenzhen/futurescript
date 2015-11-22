import * as $lex from "../lib/c-lex-0.js";
import * as $block from "../lib/c-block-0.js";

let lex, block;

lex = new $lex.Lex(`lemo 0.1.0, node module
match a
    1 ? 10
    2 ? 100
    |   0
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
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

lex = new $lex.Lex(`lemo 0.1.0, node module
match a
    1
        10
    2
        100
    |
        0
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
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

lex = new $lex.Lex(`lemo 0.1.0, node module
match a
    1, |
        10
    2
        100
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
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

lex = new $lex.Lex(`lemo 0.1.0, node module
match a
    1, 2
        10
    3
        100
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
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

lex = new $lex.Lex(`lemo 0.1.0, node module
match a
    1, 2, 3, |
        10
    4
        100
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
RootBlock [
    ExpressionStatement {
        expression: MatchExpression {
            comparer: VariableExpression "a"
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

lex = new $lex.Lex(`lemo 0.1.0, node module
match a
`);
block = new $block.RootBlock(lex);
console.log(block.toString() === `node module
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
