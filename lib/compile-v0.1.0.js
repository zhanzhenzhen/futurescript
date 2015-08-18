/*
a: 123
b: 456
console.log(a + b)

RootBlock [
    AssignStatement {
        assignee: "a"
        value: NumberExpression "123"
    }
    AssignStatement {
        assignee: "b"
        value: NumberExpression "456"
    }
    CallStatement {
        callee: DotExpression [
            VariableExpression "console"
            "log"
        ]
        arguments: [
            AddExpression [
                VariableExpression "a"
                VariableExpression "b"
            ]
        ]
    }
]
*/
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

var calcIndent = function(lineCode) {
    return lineCode.match(/^[ \t]*/)[0].length;
};

var generateBlock = function(lines, startLine, startColumn, endLine, endColumn, isRoot) {
    let block = [];
    let blockIndent = lines[startLine].indent;
    let subBlockPos = null;
    for (let i = startLine; i <= endLine; i++) {
        if (lines[i].indent === blockIndent) {
            if (subBlockPos === null) {
                let assignMatch = lines[i].code.match(/(.*):(.*)/);
                if (assignMatch !== null) {
                    block.push({assignee: assignMatch[1], value: assignMatch[2]});
                }
                else {
                    block.push({unknown: true});
                }
            }
            else {
                block.push(generateBlock(lines, subBlockPos, 0, i - 1, lines[i - 1].length - 1));
            }
        }
        else {
            subBlockPos = i;
        }
    }
    return block;
};
