import * as $statement from "./compile-statement-0";

export class Block {
    constructor() {
        this.value = [];
    }

    static build(codeLines, range, isRoot) {
        let block = new RootBlock();
        let blockIndent = codeLines[range.startLine].indent;
        let statementPos = null;
        for (let i = range.startLine; i <= range.endLine; i++) {
            if (codeLines[i].indent === blockIndent) {
                if (statementPos !== null) {
                    block.add($statement.Statement.build(codeLines, {
                        startLine: statementPos,
                        startColumn: 0,
                        endLine: i,
                        endColumn: codeLines[i].length - 1
                    }));
                }
                statementPos = i;
            }
        }
        block.add($statement.Statement.build(codeLines, {
            startLine: statementPos,
            startColumn: 0,
            endLine: range.endLine,
            endColumn: codeLines[range.endLine].length - 1
        }));
        return block;
    }

    add(statement) {
        this.value.push(statement);
    }

    print(level = 0) {
        return this.value.map(statement => statement.print(level)).join("");
    }
};

export class RootBlock extends Block {};
