import {test, assert, code} from "./test-base.js";
import * as $lex from "./lex.js";
import * as $node from "./node.js";

let lex, block;

test(() => {
lex = new $lex.Lex(code`, node modules
Animal: class
    new: name ->
        me._name: name
    move: <>
        print "move!"
`);
block = await new $node.RootBlock(lex);
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
                        argumentsHasSpread: false
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

test(() => {
lex = new $lex.Lex(code`, node modules
Cat: class from Animal
    color'get: <> me._color
`);
block = await new $node.RootBlock(lex);
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

test(() => {
lex = new $lex.Lex(code`, node modules
Cmath: class
    static: <> abc()
    static add: <> @1 + @2
`);
block = await new $node.RootBlock(lex);
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

test(() => {
lex = new $lex.Lex(code`, node modules
Aaa: class
    _a: 7
    _b'get: <> 8
`);
block = await new $node.RootBlock(lex);
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

test(() => {
lex = new $lex.Lex(code`, node modules
Aaa: class
    _a: 7
    _b'get: <> me._a + Math.random()
`);
block = await new $node.RootBlock(lex);
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

test(() => {
lex = new $lex.Lex(code`, node modules
class
    "a b": 1
    (a): 2
`);
block = await new $node.RootBlock(lex);
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

test(() => {
lex = new $lex.Lex(code`, node modules
A: class
B: class from A
`);
block = await new $node.RootBlock(lex);
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

test(() => {
lex = new $lex.Lex(code`, node modules
A: class
    aaa: x -> fun
`);
assert.throws(() =>
{
    block = await new $node.RootBlock(lex);
},
e => e instanceof $node.FunInClassMemberError &&
    e.rawStart[0] === 2 && e.rawStart[1] === 14 &&
    e.rawEnd[0] === 2 && e.rawEnd[1] === 16
);
}); // ============================================================

// Should have no error.
test(() => {
lex = new $lex.Lex(code`, node modules
<>
    A: class
        aaa: -- fun
`);
block = await new $node.RootBlock(lex);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
B: class from A
    new: <>
        super @...
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
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
                Xy {
                    x: MemberKey {
                        get: false
                        name: null
                        new: true
                        set: false
                        static: false
                    }
                    y: DiamondFunctionExpression {
                        body: ScopeBlock [
                            ExpressionStatement {
                                expression: ParenthesisCallExpression {
                                    arguments: Arr [
                                        CallSpread {
                                            value: ArgExpression
                                        }
                                    ]
                                    callee: SuperExpression
                                    new: false
                                    nonew: false
                                }
                            }
                        ]
                    }
                }
            ]
            superClass: VariableExpression "A"
        }
    }
]
`);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
B: class from A
    m1: <>
        super()
        true
    m2: <>
        super.m1()
`);
block = await new $node.RootBlock(lex);
assert(block.toString() === `node modules
RootBlock [
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
                Xy {
                    x: MemberKey {
                        get: false
                        name: Piece "m1"
                        new: false
                        set: false
                        static: false
                    }
                    y: DiamondFunctionExpression {
                        body: ScopeBlock [
                            ExpressionStatement {
                                expression: ParenthesisCallExpression {
                                    arguments: Arr [
                                    ]
                                    callee: SuperExpression
                                    new: false
                                    nonew: false
                                }
                            }
                            ExpressionStatement {
                                expression: BooleanExpression "true"
                            }
                        ]
                    }
                }
                Xy {
                    x: MemberKey {
                        get: false
                        name: Piece "m2"
                        new: false
                        set: false
                        static: false
                    }
                    y: DiamondFunctionExpression {
                        body: ScopeBlock [
                            ExpressionStatement {
                                expression: ParenthesisCallExpression {
                                    arguments: Arr [
                                    ]
                                    callee: DotExpression {
                                        x: SuperExpression
                                        y: Piece "m1"
                                    }
                                    new: false
                                    nonew: false
                                }
                            }
                        ]
                    }
                }
            ]
            superClass: VariableExpression "A"
        }
    }
]
`);
}); // ============================================================
