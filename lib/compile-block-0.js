import * as $lex from "./compile-lex-0";
import * as $statement from "./compile-statement-0";
import * as $print from "../lib/compile-print-0";

export class Block {
    constructor(lexPart) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        this.value = [];
        if (endIndex < startIndex) {
            return;
        }
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
                this.add($statement.Statement.build(lex.part(statementStartIndex, i - 1), this));
                statementStartIndex = i + 1;
            }
        }
        this.add($statement.Statement.build(lex.part(statementStartIndex, endIndex), this));
    }

    add(statement) {
        this.value.push(statement);
    }

    print(level = 0) {
        return $print.printArray(this.value, this.constructor, level);
    }

    compile() {
        let s = this.value.map((statement, index) => {
            if (index === this.value.length - 1 && !(this instanceof RootBlock)) {
                return "return " + statement.compile() + ";";
            }
            else {
                return statement.compile() + ";";
            }
        }).join("");
        if (this instanceof RootBlock) {
            return s;
        }
        else {
            return "(function(){" + s + "})();";
        }
    }
};

export class RootBlock extends Block {};
