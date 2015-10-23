import * as $lex from "./compile-lex-0";
import * as $statement from "./compile-statement-0";
import * as $print from "../lib/compile-print-0";

export class Block {
    constructor(lexPart) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        this.value = [];
        let level = 0;
        let blockIndent = lex.at(startIndex);
        let statementStartIndex = startIndex;
        for (let i = startIndex; i <= endIndex; i++) {
            if (lex.at(i) instanceof $lex.LeftChevron) {
                level++;
            }
            else if (lex.at(i) instanceof $lex.RightChevron) {
                level--;
            }
            else if (lex.at(i) instanceof $lex.Semicolon && level === 0) {
                this.add($statement.Statement.build({
                    lex: lex,
                    startIndex: statementStartIndex,
                    endIndex: i - 1
                }, this));
                statementStartIndex = i + 1;
            }
        }
        this.add($statement.Statement.build({
            lex: lex,
            startIndex: statementStartIndex,
            endIndex: endIndex
        }, this));
    }

    add(statement) {
        this.value.push(statement);
    }

    print(level = 0) {
        return $print.printArray(this.value, this.constructor, level);
    }
};

export class RootBlock extends Block {};
