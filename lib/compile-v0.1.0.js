/*
a: 123
if a > 100
    b: 456
console.log(a + b * b)

RootBlock [
    AssignStatement {
        assignee: "a"
        value: NumberExpression "123"
    }
    IfStatement {
        condition: GreaterThanExpression {
            x: VariableExpression "a"
            y: NumberExpression "100"
        }
        thenBranch: Block [
            AssignStatement {
                assignee: "b"
                value: NumberExpression "456"
            }
        ]
    }
    CallStatement {
        callee: DotExpression {
            x: VariableExpression "console"
            y: "log"
        }
        arguments: [
            PlusExpression {
                x: VariableExpression "a"
                y: MultiplyExpression {
                    x: VariableExpression "b"
                    y: VariableExpression "b"
                }
            }
        ]
    }
]
*/

import * as $lex from "./compile-lex-0";
import * as $block from "./compile-block-0";

export default function(input) {
    let lex = new $lex.Lex(input.code);
    let block = new $block.RootBlock(lex);
    return {code: block.compile()};
};
