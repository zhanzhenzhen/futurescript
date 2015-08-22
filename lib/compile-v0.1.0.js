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

import * as $expression from "./compile-expression-0";
import * as $statement from "./compile-statement-0";

export default function(input) {
    let statementPos = 0;
    let indent = 0;
    let lines = [];
    let inIndent = false;
    let pos = 0;
    for (let i = 0; i < input.code.length; i++) {
        let char = input.code[i];
        let endPos = null;
        if (char === "\n") {
            if (input.code[i - 1] === "\r") {
                endPos = i - 2;
            }
            else {
                endPos = i - 1;
            }
            lines.push({code: input.code.substr(pos, endPos - pos + 1), position: pos});
            pos = i + 1;
        }
    }
    lines.forEach(line => line.indent = calcIndent(line.code));
    let block = generateBlock(lines, 1, 0, lines.length - 1, lines[lines.length - 1].length - 1, true);
    console.log(lines);
    console.log(block);
    return {code: "haha", sourceMap: null};
    while (i < input.code.length) {
        let char = input.code[i];
        let endPos = null;
        if (input.code[i] === "\n") {
            if (input.code[i - 1] === "\r") {
                endPos = i - 2;
            }
            else {
                endPos = i - 1;
            }
            lines.push({code: input.code.substr(pos, endPos - pos), position: pos});
            inIndent = true;
            indent++;
        }
        if (char === ";" || char === "\n") {
            lines.push({});
            statement = input.code.substr(statementPos, i - statementPos);
        }
        if (!inIndent && (char === " " || char === "\t") && input.code[i - 1] === "\n") {
            inIndent = true;
            indent++;
        }
        if (inIndent && char !== " " && char !== "\t") {
            inIndent = false;
            lines[lines.length - 1].indent = indent;
            lines.push({indent: indent});
        }
        i++;
    }
    return {code: "haha", sourceMap: null};
};

let calcIndent = function(lineCode) {
    return lineCode.match(/^[ \t]*/)[0].length;
};

let generateBlock = function(lines, startLine, startColumn, endLine, endColumn, isRoot) {
    let block = new RootBlock();
    let blockIndent = lines[startLine].indent;
    let statementPos = null;
    for (let i = startLine; i <= endLine; i++) {
        if (lines[i].indent === blockIndent) {
            if (statementPos !== null) {
                block.add($statement.Statement.build(
                    lines.slice(statementPos, i).map(line => line.code).join("")
                ));
            }
            statementPos = i;
        }
    }
    return block;
};

let Block = class Block {
    constructor() {
        this.value = [];
    }

    add(statement) {
        this.value.push(statement);
    }

    print(level = 0) {
        return this.value.map(statement => statement.print(level)).join("");
    }
};

let RootBlock = class RootBlock extends Block {};
