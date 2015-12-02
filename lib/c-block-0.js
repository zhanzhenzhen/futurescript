import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $statement from "./c-statement-0.js";
import * as $expression from "./c-expression-0.js";
import * as $print from "./c-print-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

export let antiConflictString = "573300145710716007";

export class Block extends $node.MappableNode {
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
            if (
                lex.at(i) instanceof $lex.LeftChevron ||
                lex.at(i) instanceof $lex.LeftParenthesis ||
                lex.at(i) instanceof $lex.LeftBracket ||
                lex.at(i) instanceof $lex.LeftBrace
            ) {
                level++;
            }
            else if (
                lex.at(i) instanceof $lex.RightChevron ||
                lex.at(i) instanceof $lex.RightParenthesis ||
                lex.at(i) instanceof $lex.RightBracket ||
                lex.at(i) instanceof $lex.RightBrace
            ) {
                level--;
            }
            else if (lex.at(i) instanceof $lex.Semicolon && level === 0) {
                this.value.push($statement.Statement.build(lex.part(statementStartIndex, i - 1)));
                statementStartIndex = i + 1;
            }
        }
        this.value.push($statement.Statement.build(lex.part(statementStartIndex, endIndex)));
        this.setLexPart(lexPart);
    }

    insertStatementBefore(newStatement, refStatement) {
        let index = this.value.indexOf(refStatement);
        if (index !== -1) {
            this.value.splice(index, 0, statement);
        }
    }

    removeStatement(statement) {
        let index = this.value.indexOf(statement);
        if (index !== -1) {
            this.value.splice(index, 1);
        }
    }

    toString(level = 0) {
        return $print.printArray(this.value, this.constructor, level);
    }

    compile() {
        let jb = new J(this.value.map((statement, index) => {
            if (
                index === this.value.length - 1 &&
                !(this instanceof RootBlock) &&
                statement instanceof $statement.ExpressionStatement
            ) {
                return new J(["return ", statement.compile(), ";"]);
            }
            else {
                return new J([statement.compile(), ";"]);
            }
        }));
        if (this instanceof ScopeBlock) {
            let root = this.getRoot();
            let vars = this.getScopeItemNames().filter(name => {
                let scopeItem = this.getScopeItem(name);
                return scopeItem.type === scopeItemType.NORMAL ||
                (
                    scopeItem.type === scopeItemType.IMPORT &&
                    (
                        root.hasCompilerDirective("node module") ||
                        root.hasCompilerDirective("node import")
                    )
                );
            });
            if (vars.length > 0) {
                jb = new J(["var " + vars.join(",") + ";", jb]);
            }
        }
        if (this instanceof RootBlock) {
            let comment = this.comment === null ? "" : "/*" + this.comment + "*/";
            let hoisted = this.hoistedCompiled;
            let lowered = this.loweredCompiled;
            let libMod = this.predefinedLib.mod ?
                "var mod_" + antiConflictString + "=function(a,b){return (a%b+b)%b;};" : "";
            let libOk = this.predefinedLib.ok ?
                "var ok_" + antiConflictString + "=function(a){return a!==undefined&&a!==null;};" : "";
            let libIfvoid = this.predefinedLib.ifvoid ?
                "var ifvoid_" + antiConflictString + "=function(a,b){return a===undefined?b:a;};" : "";
            let libIfnull = this.predefinedLib.ifnull ?
                "var ifnull_" + antiConflictString +
                    "=function(a,b){return a===undefined||a===null?b:a;};"
                : "";
            let libFormattedRegex = this.predefinedLib.formattedRegex ?
                "var formattedRegex_" + antiConflictString +
`=function(pattern, flags) {
    var s = pattern;
    var lines = s.split("\\n");
    lines = lines.map(line => {
        var commentPos = line.indexOf(" #");
        var r;
        if (commentPos === -1) {
            r = line;
        }
        else {
            r = line.substr(0, commentPos);
        }
        return r;
    });
    s = lines.join("").replace(/\\s/g, "");
    return new RegExp(s, flags);
};`
                : "";
            return new J([
                comment,
                hoisted,
                libMod, libOk, libIfvoid, libIfnull, libFormattedRegex,
                jb,
                lowered
            ]);
        }
        else {
            return new J(["((function(){", jb, "})())"]);
        }
    }
}

export let scopeItemType = {
    NORMAL: 0,
    ARGUMENT: 1,
    IMPORT: 2
};

export class ScopeBlock extends Block {
    constructor(lexPart) {
        super(lexPart);
        this._scopeItems = {};
    }

    getScopeItems() {
        return this._scopeItems;
    }

    getScopeItemNames() {
        return Object.keys(this._scopeItems);
    }

    addScopeItem(name, type = scopeItemType.NORMAL) {
        if (!this.hasScopeItem(name)) {
            this._scopeItems[name] = {type: type, nodes: []};
        }
    }

    getScopeItem(name) {
        return this._scopeItems[name];
    }

    hasScopeItem(name) {
        return this._scopeItems[name] !== undefined;
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

    // Traverse all its ancestors to find a scope item.
    ancestorWithScopeItem(name) {
        let next = this.getParent(ScopeBlock);
        while (next !== null) {
            if (next.hasScopeItem(name)) {
                return next;
            }
            next = next.getParent(ScopeBlock);
        }
        return null;
    }

    addNodeToScopeItem(node, scopeItemName) {
        this.getScopeItem(scopeItemName).nodes.push(node);
    }

    removeScopeItem(name) {
        delete this._scopeItems[name];
    }
}

export class RootBlock extends ScopeBlock {
    constructor(lex) {
        if (lex.at(1) instanceof $lex.FormattedComment) {
            if (lex.at(2) instanceof $lex.Semicolon) {
                super(lex.part(3));
            }
            else {
                // This should never run, written just for safety
                super(lex.part(2));
            }
        }
        else {
            super(lex.part(1));
        }

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
        lines.sort();
        this.compilerDirectives = lines;

        if (lex.at(1) instanceof $lex.FormattedComment) {
            this.comment = lex.at(1).value;
        }
        else {
            this.comment = null;
        }

        this.value.forEach(statement => {
            if (statement instanceof $statement.ImportStatement && statement.batchall) {
                let insert = (moduleName, variableName) => {
                    this.insertStatementBefore(new $statement.ImportStatement(
                        new $node.Piece(moduleName),
                        new $node.Arr([
                            new $node.Xy(
                                new $node.VariableAssignee({
                                    variable: new $node.LocalVariable(variableName)
                                }),
                                new $node.Piece(variableName)
                            )
                        ]),
                        null,
                        false
                    ), statement);
                };
                let code = Block.readFile(statement.module.value);
                let lex = new $lex.Lex(code);
                let block = new RootBlock(lex);
                block.allNodes.forEach(node => {
                    if (node instanceof $expression.ExportAsExpression) {
                        insert(statement.module.value, node.externalName.value);
                    }
                    else if (node instanceof $statement.ExportStatement) {
                        insert(statement.module.value, node.externalName.value);
                    }
                    else if (node instanceof $node.VariableAssignee && node.export) {
                        insert(statement.module.value, node.variable.value);
                    }
                });
                this.removeStatement(statement);
            }
        });

        this.allScopeBlocks = [];
        this.allNodes = [];
        this._replacerIndex = 0;

        this.predefinedLib = {};

        this.hoistedCompiled = "";
        this.loweredCompiled = "";

        let makeLinks = (thing, parent) => {
            if (
                thing === true || thing === false ||
                thing === null || thing === undefined ||
                typeof thing === "string" || typeof thing === "number"
            ) {
            }
            else if (thing instanceof $node.Piece) {
                makePieceLinks(thing, parent);
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
        let makePieceLinks = (piece, parent) => {
            piece.setParent(parent);

            // Add all possible scope items. Later we will remove incorrect ones.
            if (piece instanceof $node.LocalVariable) {
                if (piece.getParent($statement.Statement) instanceof $statement.ImportStatement) {
                    piece.getParent(ScopeBlock).addScopeItem(piece.value, scopeItemType.IMPORT);
                }
                else if (piece.getParent() instanceof $node.ArrowArgument) {
                    piece.getParent($expression.ArrowFunctionExpression)
                    .body.addScopeItem(piece.value, scopeItemType.ARGUMENT);
                }
                else {
                    piece.getParent(ScopeBlock).addScopeItem(piece.value);
                }
            }
        };
        makeLinks(this, null);

        // Remove incorrect (i.e. inner scope item with the same name) scope items.
        this.allScopeBlocks.forEach(block => {
            block.getScopeItemNames().forEach(name => {
                if (block.ancestorWithScopeItem(name) !== null) {
                    block.removeScopeItem(name);
                }
            });
        });

        this.allNodes.forEach(node => {
            if (node instanceof $node.LocalVariable) {
                if (node.getParent() instanceof $node.ArrowArgument) {
                    node.getParent($expression.ArrowFunctionExpression)
                    .body.addNodeToScopeItem(node, node.value);
                }
                else {
                    let scopeBlock = node.getParent(ScopeBlock).blockWithScopeItem(node.value);
                    scopeBlock.addNodeToScopeItem(node, node.value);
                }
            }
            else if (node instanceof $expression.VariableExpression) {
                let scopeBlock = node.getParent(ScopeBlock).blockWithScopeItem(node.value);
                if (scopeBlock !== null) {
                    scopeBlock.addNodeToScopeItem(node, node.value);
                }
            }
        });
    }

    hasCompilerDirective(item) {
        return this.compilerDirectives.indexOf(item) !== -1;
    }

    complyWithJs() {
        let jsForbiddens = [
            "arguments",
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
            "eval",
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
        this.allScopeBlocks.forEach(block => {
            block.getScopeItemNames().forEach(name => {
                if (jsForbiddens.includes(name)) {
                    let scopeItem = block.getScopeItem(name);
                    scopeItem.nodes.forEach(node => {
                        node.value = this.replacer();
                    });
                    this.renewReplacer();
                }
            });
        });
        if (this.comment !== null) {
            this.comment = this.comment.replace(/\*\//g, "  ");
        }
    }

    replacer() {
        return "var_" + antiConflictString + "_" + this._replacerIndex.toString();
    }

    renewReplacer() {
        this._replacerIndex++;
    }

    toString() {
        let a = this.compilerDirectives.length === 0 ? "" : this.compilerDirectives.join("\n") + "\n";
        let b = this.comment === null ? "" : "###" + this.comment + "###" + "\n";
        return a + b + super.toString();
    }
}
