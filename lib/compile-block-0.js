import * as $statement from "./compile-statement-0";

export class Block {
    constructor(lex, startIndex, endIndex) {
        this.value = [];
        let blockIndent = lex[startIndex];
        let statementStartIndex = null;
        for (let i = startIndex; i <= endIndex; i++) {
            if (lex[i] instanceof Indent && lex[i].value === blockIndent.value) {
                if (statementStartIndex !== null) {
                    this.add($statement.Statement.build(lex, statementStartIndex + 1, i - 1, this);
                }
                statementStartIndex = i;
            }
        }
        this.add($statement.Statement.build(lex, statementStartIndex + 1, endIndex, this);
    }

    add(statement) {
        this.value.push(statement);
    }

    print(level = 0) {
        return this.value.map(statement => statement.print(level)).join("");
    }
};

export class RootBlock extends Block {};
