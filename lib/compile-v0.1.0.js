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
//import * as $expression from "./compile-expression-0";
//import * as $statement from "./compile-statement-0";
//import * as $block from "./compile-block-0";

let codeLines = null;

export default function(input) {
    let lex = new $lex.Lex(input.code).toString();
    //codeLines = convertToCodeLines(input.code);
    //let block = Block.build(lex);
    return lex;
    let block = Block.build(
        codeLines,
        {
            startLine: 1,
            startColumn: 0,
            endLine: codeLines.length - 1,
            endColumn: codeLines[codeLines.length - 1].code.length - 1
        },
        true
    );
    console.log(lines);
    console.log(block);
    return {code: "haha", sourceMap: null};
};

let calcIndent = function(lineCode) {
    return lineCode.match(/^[ \t]*/)[0].length;
};

let CombineParallel = function(lines, startLine, endLine) {
}
