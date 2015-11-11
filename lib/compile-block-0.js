import * as $lex from "./compile-lex-0";
import * as $node from "./compile-node-0";
import * as $statement from "./compile-statement-0";
import * as $expression from "./compile-expression-0";
import * as $print from "../lib/compile-print-0";

export let antiConflictString = "573300145710716007";

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
        this._scopeItems = {};
    }

    getScopeItems() {
        return this._scopeItems;
    }

    addScopeItem(name) {
        if (!this.hasScopeItem(name)) {
            this._scopeItems[name] = [];
        }
    }

    hasScopeItem(name) {
        return Array.isArray(this._scopeItems[name]);
    }

    // Traverse itself and all its ancestors to find a scope item.
    blockWithScopeItem(name) {
        let next = this;
        while (next !== null) {
            if (next.hasScopeItem(name)) {
                return next;
            }
            next = next.getParent(ScopeBlock);
        }
        return null;
    }

    addNodeToScopeItem(node, scopeItemName) {
        this.getScopeItems()[scopeItemName].push(node);
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
        this.allNodes = [];

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
            this.allNodes.push(thing);
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
                let parent = node.getParent(ScopeBlock);
                let found = parent.blockWithScopeItem(node.assignee.variable);
                if (found === null) {
                    parent.addScopeItem(node.assignee.variable);
                }
            }
            else if (node instanceof $statement.AssignStatement) {
                node.assignees.value.forEach(assignee => {
                    if (assignee instanceof $node.VariableAssignee) {
                        let parent = node.getParent(ScopeBlock);
                        let found = parent.blockWithScopeItem(assignee.variable);
                        if (found === null) {
                            parent.addScopeItem(assignee.variable);
                        }
                    }
                });
            }
            else if (node instanceof $expression.ArrowFunctionExpression) {
                node.arguments.value.forEach(arg => {
                    node.body.addScopeItem(arg.variable);
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

        this.allNodes.forEach(node => {
            if (node instanceof $node.VariableAssignee) {
                let scopeBlock = node.getParent(ScopeBlock).blockWithScopeItem(node.variable);
                if (scopeBlock !== null) {
                    scopeBlock.addNodeToScopeItem(node, node.variable);
                }
            }
            else if (node instanceof $expression.VariableExpression) {
                let scopeBlock = node.getParent(ScopeBlock).blockWithScopeItem(node.value);
                if (scopeBlock !== null) {
                    scopeBlock.addNodeToScopeItem(node, node.value);
                }
            }
            else if (node instanceof $node.ArrowArgument) {
                node.getParent($expression.ArrowFunctionExpression)
                .body.addNodeToScopeItem(node, node.variable);
            }
        });
    }

    hasCompilerDirective(item) {
        return this.compilerDirectives.indexOf(item) !== -1;
    }

    antiConflict() {
        let jsForbiddens = [
            "await",
            "break",
            "case",
            "catch",
            "class",
            "const",
            "continue",
            "debugger",
            "default",
            "delete",
            "do",
            "else",
            "enum",
            "export",
            "extends",
            "false",
            "finally",
            "for",
            "function",
            "if",
            "implements",
            "import",
            "in",
            "instanceof",
            "interface",
            "let",
            "new",
            "null",
            "package",
            "private",
            "protected",
            "public",
            "return",
            "static",
            "super",
            "switch",
            "this",
            "throw",
            "true",
            "try",
            "typeof",
            "undefined",
            "var",
            "void",
            "while",
            "with",
            "yield"
        ];
        let replacerIndex = 0;
        this.allScopeBlocks.forEach(block => {
            let scopeItems = block.getScopeItems();
            Object.keys(scopeItems).forEach(key => {
                if (jsForbiddens.includes(key)) {
                    let scopeItem = scopeItems[key];
                    let replacer = "var_" + antiConflictString + "_" + replacerIndex.toString();
                    scopeItem.forEach(node => {
                        if (node instanceof $node.VariableAssignee) {
                            node.variable = replacer;
                        }
                        else if (node instanceof $expression.VariableExpression) {
                            node.value = replacer;
                        }
                        else if (node instanceof $node.ArrowArgument) {
                            node.variable = replacer;
                        }
                    });
                    replacerIndex++;
                }
            });
        });
    }

    toString() {
        return this.compilerDirectives.join("\n") + "\n" + super.toString();
    }
}
