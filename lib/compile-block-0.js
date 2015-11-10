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
            return "((function(){" + s + "})())";
        }
    }
}

export class ScopeBlock extends Block {
    constructor(lexPart) {
        super(lexPart);
        this._assignmentVariables = [];
        this._scopeVariables = [];
    }

    getAssignmentVariables() {
        return this._assignmentVariables;
    }

    addAssignmentVariable(variable) {
        if (this._assignmentVariables.indexOf(variable) === -1) {
            this._assignmentVariables.push(variable);
        }
    }

    getScopeVariables() {
        return this._scopeVariables;
    }

    addScopeVariable(variable) {
        if (this._scopeVariables.indexOf(variable) === -1) {
            this._scopeVariables.push(variable);
        }
    }

    hasScopeVariable(variable) {
        return this._scopeVariables.indexOf(variable) !== -1;
    }

    ancestorHasScopeVariable(variable) {
        let next = this.getParent(ScopeBlock);
        while (next !== null) {
            if (next.hasScopeVariable(variable)) {
                return true;
            }
            next = next.getParent(ScopeBlock);
        }
        return false;
    }
}

export class RootBlock extends ScopeBlock {
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

        this.allScopeBlocks = [];

        let makeLinks = (thing, parent) => {
            if (
                thing === true || thing === false ||
                thing === null || thing === undefined ||
                typeof thing === "string" || typeof thing === "number"
            ) {
            }
            else if (thing instanceof $expression.AtomExpression) {
                makeAtomExpressionLinks(thing, parent);
            }
            else if (thing instanceof Block) {
                makeBlockLinks(thing, parent);
            }
            else if (thing instanceof $node.Arr) {
                makeArrLinks(thing, parent);
            }
            else {
                makeGeneralLinks(thing, parent);
            }
        };
        let makeBlockLinks = (block, parent) => {
            block.setParent(parent);
            if (block instanceof ScopeBlock) {
                this.allScopeBlocks.push(block);
            }
            block.value.forEach(statement => {
                makeLinks(statement, block);
            });
        };
        let makeGeneralLinks = (node, parent) => {
            node.setParent(parent);
            if (
                node instanceof $expression.AsExpression &&
                node.assignee instanceof $node.VariableAssignee
            ) {
                let scopeBlock = node.getParent(ScopeBlock);
                scopeBlock.addAssignmentVariable(node.assignee.variable);
                if (!scopeBlock.ancestorHasScopeVariable(node.assignee.variable)) {
                    scopeBlock.addScopeVariable(node.assignee.variable);
                }
            }
            else if (node instanceof $statement.AssignStatement) {
                node.assignees.value.forEach(assignee => {
                    if (assignee instanceof $node.VariableAssignee) {
                        let scopeBlock = node.getParent(ScopeBlock);
                        scopeBlock.addAssignmentVariable(assignee.variable);
                        if (!scopeBlock.ancestorHasScopeVariable(assignee.variable)) {
                            scopeBlock.addScopeVariable(assignee.variable);
                        }
                    }
                });
            }
            else if (node instanceof $expression.ArrowFunctionExpression) {
                node.arguments.value.forEach(arg => {
                    node.body.addScopeVariable(arg.variable);
                });
            }
            Object.keys(node).forEach(key => {
                if (!key.startsWith("_")) {
                    let property = node[key];
                    makeLinks(property, node);
                }
            });
        };
        let makeArrLinks = (arr, parent) => {
            arr.setParent(parent);
            arr.value.forEach(element => {
                makeLinks(element, arr);
            });
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
