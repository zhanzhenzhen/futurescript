import * as $lex from "./compile-lex-0";
import * as $node from "./compile-node-0";
import * as $statement from "./compile-statement-0";
import * as $expression from "./compile-expression-0";
import * as $print from "../lib/compile-print-0";

export class Block extends $node.Node {
    constructor(lexPart) {
        super();

        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        this.value = [];
        if (endIndex < startIndex) {
            return;
        }
        let level = 0;
        let statementStartIndex = startIndex;
        for (let i = startIndex; i <= endIndex; i++) {
            if (lex.at(i) instanceof $lex.LeftChevron) {
                level++;
            }
            else if (lex.at(i) instanceof $lex.RightChevron) {
                level--;
            }
            else if (lex.at(i) instanceof $lex.Semicolon && level === 0) {
                this.value.push($statement.Statement.build(lex.part(statementStartIndex, i - 1)));
                statementStartIndex = i + 1;
            }
        }
        this.value.push($statement.Statement.build(lex.part(statementStartIndex, endIndex)));
    }

    toString(level = 0) {
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
}

export class RootBlock extends Block {
    constructor(lex) {
        super(lex.part(1));
        let s = lex.at(0).value;
        s = s.substr(s.search(/\b(\d+\.\d+\.\d+)\b/));
        let lines = s.split(/\n|\r\n|,/);
        lines = lines.slice(1).map(m => m.trim());
        if (lines[0] === "{") {
            lines = lines.slice(1);
        }
        if (lines[lines.length - 1] === "}") {
            lines.pop();
        }
        this.compilerDirectives = lines;

        let makeLinks = (thing, parent) => {
            if (thing instanceof $node.AtomNode) {
                makeAtomLinks(thing, parent);
            }
            else if (thing instanceof $expression.AtomExpression) {
                makeAtomExpressionLinks(thing, parent);
            }
            else if (thing instanceof Block) {
                makeBlockLinks(thing, parent);
            }
            else if (thing instanceof $expression.Expression) {
                makeExpressionLinks(thing, parent);
            }
            else if (thing instanceof $node.Arr) {
                makeArrLinks(thing, parent);
            }
            else if (thing instanceof $node.Xy) {
                makeXyLinks(thing, parent);
            }
        };
        let makeBlockLinks = (block, parent) => {
            block.value.forEach(statement => {
                Object.keys(statement).forEach(key => {
                    let property = statement[key];
                    makeLinks(property, statement);
                });
                statement.setParent(block);
            });
            block.setParent(parent);
        };
        let makeExpressionLinks = (expression, parent) => {
            Object.keys(expression).forEach(key => {
                let property = expression[key];
                makeLinks(property, expression);
            });
            expression.setParent(parent);
        };
        let makeArrLinks = (arr, parent) => {
            arr.value.forEach(element => {
                makeLinks(element, arr);
            });
            arr.setParent(parent);
        };
        let makeXyLinks = (nv, parent) => {
            makeLinks(nv.name, nv);
            makeLinks(nv.value, nv);
            nv.setParent(parent);
        };
        let makeAtomLinks = (atom, parent) => {
            atom.setParent(parent);
        };
        let makeAtomExpressionLinks = (expression, parent) => {
            expression.setParent(parent);
        };
        makeLinks(this, null);
    }

    hasCompilerDirective(item) {
        return this.compilerDirectives.indexOf(item) !== -1;
    }

    toString() {
        return this.compilerDirectives.join("\n") + "\n" + super.toString();
    }
}
