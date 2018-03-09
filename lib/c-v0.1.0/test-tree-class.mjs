import {test, assert, code} from "./test-base.js";
import * as $lex from "./lex.js";
import * as $node from "./node.js";

test(async () => {
let lex = new $lex.Lex(code`, node modules
Animal: class
    new: name ->
        me._name: name
    move: <>
        print "move!"
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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
                        argumentsReal: true
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
                                    new: false
                                    nonew: false
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

test(async () => {
let lex = new $lex.Lex(code`, node modules
Cat: class from Animal
    color'get: <> me._color
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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

test(async () => {
let lex = new $lex.Lex(code`, node modules
Cmath: class
    static: <> abc()
    static add: <> @1 + @2
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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
                                    new: false
                                    nonew: false
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

test(async () => {
let lex = new $lex.Lex(code`, node modules
Aaa: class
    _a: 7
    _b'get: <> 8
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
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

test(async () => {
let lex = new $lex.Lex(code`, node modules
Aaa: class
    _a: 7
    _b'get: <> me._a + Math.random()
`);
let block = await new $node.RootBlock(lex);
block.complyWithJs();
assert(block.toString() === `node modules
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
                                        new: false
                                        nonew: false
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

test(async () => {
let lex = new $lex.Lex(code`, node modules
class
    "a b": 1
    (a): 2
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    ExpressionStatement {
        expression: ClassExpression {
            body: Arr [
                Xy {
                    x: MemberKey {
                        get: false
                        name: PseudoCallExpression {
                            arguments: Arr [
                                StringExpression "a b"
                            ]
                            callee: InlineNormalStringExpression
                        }
                        new: false
                        set: false
                        static: false
                    }
                    y: NumberExpression "1"
                }
                Xy {
                    x: MemberKey {
                        get: false
                        name: VariableExpression "a"
                        new: false
                        set: false
                        static: false
                    }
                    y: NumberExpression "2"
                }
            ]
            superClass: null
        }
    }
]
`);
}); // ============================================================

test(async () => {
let lex = new $lex.Lex(code`, node modules
A: class
B: class from A
`);
let block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "A"
            }
        ]
        value: ClassExpression {
            body: Arr [
            ]
            superClass: null
        }
    }
    AssignStatement {
        assignees: Arr [
            VariableAssignee {
                export: false
                ifnull: false
                ifvoid: false
                variable: LocalVariable "B"
            }
        ]
        value: ClassExpression {
            body: Arr [
            ]
            superClass: VariableExpression "A"
        }
    }
]
`);
}); // ============================================================
