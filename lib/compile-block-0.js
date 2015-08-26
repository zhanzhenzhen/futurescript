import * as $statement from "./compile-statement-0";

export class Block {
    constructor() {
        this.value = [];
    }

    static build(lex, startIndex, endIndex, isRoot) {
        let block = isRoot ? new RootBlock() : new Block();
        let blockIndent = lex[startIndex];
        let statementStartIndex = null;
        for (let i = startIndex; i <= endIndex; i++) {
            if (lex[i] instanceof Indent && lex[i].value === blockIndent.value) {
                if (statementStartIndex !== null) {
                    block.add($statement.Statement.build(lex, statementStartIndex + 1, i - 1);
                }
                statementStartIndex = i;
            }
        }
        block.add($statement.Statement.build(lex, statementStartIndex + 1, endIndex);
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
