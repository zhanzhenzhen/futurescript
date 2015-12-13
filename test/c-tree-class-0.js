import {test, assert} from "./c-base-0.js";
import * as $lex from "../lib/c-lex-0.js";
import * as $block from "../lib/c-block-0.js";

let lex, block;

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
Animal: class
    new: name ->
        me._name: name
    move: <>
        print "move!"
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "Animal"
            }
        ]
        value: ClassExpression {
            body: Arr [
                Xy {
                    x: MemberKey {
                        get: false
                        name: null
                        new: true
                        set: false
                        static: false
                    }
                    y: ArrowFunctionExpression {
                        arguments: Arr [
                            ArrowArgument {
                                nullDefault: null
                                variable: LocalVariable "name"
                                voidDefault: null
                            }
                        ]
                        body: ScopeBlock [
                            AssignStatement {
                                assignees: Arr [
                                    DotAssignee {
                                        export: false
                                        ifnull: false
                                        ifvoid: false
                                        x: MeExpression
                                        y: SymbolMemberName "_name"
                                    }
                                ]
                                value: VariableExpression "name"
                            }
                        ]
                    }
                }
                Xy {
                    x: MemberKey {
                        get: false
                        name: Piece "move"
                        new: false
                        set: false
                        static: false
                    }
                    y: DiamondFunctionExpression {
                        body: ScopeBlock [
                            ExpressionStatement {
                                expression: ParenthesisCallExpression {
                                    arguments: Arr [
                                        PseudoCallExpression {
                                            arguments: Arr [
                                                StringExpression "move!"
                                            ]
                                            callee: InlineNormalStringExpression
                                        }
                                    ]
                                    callee: VariableExpression "print"
                                }
                            }
                        ]
                    }
                }
            ]
            superClass: null
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
Cat: class from Animal
    color'get: <> me._color
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "Cat"
            }
        ]
        value: ClassExpression {
            body: Arr [
                Xy {
                    x: MemberKey {
                        get: true
                        name: Piece "color"
                        new: false
                        set: false
                        static: false
                    }
                    y: DiamondFunctionExpression {
                        body: ScopeBlock [
                            ExpressionStatement {
                                expression: DotExpression {
                                    x: MeExpression
                                    y: SymbolMemberName "_color"
                                }
                            }
                        ]
                    }
                }
            ]
            superClass: VariableExpression "Animal"
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
Cmath: class
    static: <> abc()
    static add: <> @1 + @2
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "Cmath"
            }
        ]
        value: ClassExpression {
            body: Arr [
                Xy {
                    x: MemberKey {
                        get: false
                        name: null
                        new: false
                        set: false
                        static: true
                    }
                    y: DiamondFunctionExpression {
                        body: ScopeBlock [
                            ExpressionStatement {
                                expression: ParenthesisCallExpression {
                                    arguments: Arr [
                                    ]
                                    callee: VariableExpression "abc"
                                }
                            }
                        ]
                    }
                }
                Xy {
                    x: MemberKey {
                        get: false
                        name: Piece "add"
                        new: false
                        set: false
                        static: true
                    }
                    y: DiamondFunctionExpression {
                        body: ScopeBlock [
                            ExpressionStatement {
                                expression: PlusExpression {
                                    x: DotExpression {
                                        x: ArgExpression
                                        y: NumberExpression "1"
                                    }
                                    y: DotExpression {
                                        x: ArgExpression
                                        y: NumberExpression "2"
                                    }
                                }
                            }
                        ]
                    }
                }
            ]
            superClass: null
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
Aaa: class
    _a: 7
    _b'get: <> 8
`);
block = new $block.RootBlock(lex);
assert(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "Aaa"
            }
        ]
        value: ClassExpression {
            body: Arr [
                Xy {
                    x: MemberKey {
                        get: false
                        name: SymbolMemberName "_a"
                        new: false
                        set: false
                        static: false
                    }
                    y: NumberExpression "7"
                }
                Xy {
                    x: MemberKey {
                        get: true
                        name: SymbolMemberName "_b"
                        new: false
                        set: false
                        static: false
                    }
                    y: DiamondFunctionExpression {
                        body: ScopeBlock [
                            ExpressionStatement {
                                expression: NumberExpression "8"
                            }
                        ]
                    }
                }
            ]
            superClass: null
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(`lemo 0.1.0, node module
Aaa: class
    _a: 7
    _b'get: <> me._a + Math.random()
`);
block = new $block.RootBlock(lex);
block.complyWithJs();
assert(block.toString() === `node module
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "Aaa"
            }
        ]
        value: ClassExpression {
            body: Arr [
                Xy {
                    x: MemberKey {
                        get: false
                        name: SymbolMemberName "var_573300145710716007_0"
                        new: false
                        set: false
                        static: false
                    }
                    y: NumberExpression "7"
                }
                Xy {
                    x: MemberKey {
                        get: true
                        name: SymbolMemberName "var_573300145710716007_1"
                        new: false
                        set: false
                        static: false
                    }
                    y: DiamondFunctionExpression {
                        body: ScopeBlock [
                            ExpressionStatement {
                                expression: PlusExpression {
                                    x: DotExpression {
                                        x: MeExpression
                                        y: SymbolMemberName "var_573300145710716007_0"
                                    }
                                    y: ParenthesisCallExpression {
                                        arguments: Arr [
                                        ]
                                        callee: DotExpression {
                                            x: VariableExpression "Math"
                                            y: Piece "random"
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            ]
            superClass: null
        }
    }
]
`);
}); // ============================================================
