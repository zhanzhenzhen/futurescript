import * as $lex from "./lex.mjs";
import * as $node from "./node.mjs";
import * as $nodeBase from "./node-base.mjs";
import * as $print from "./print.mjs";
import * as $lockedApi from "../locked-api.mjs";
import * as $tools from "./tools.mjs";
import {JsBuilder as J} from "./js-builder.mjs";

export let antiConflictString = "573300145710716007";

export class Block extends $nodeBase.MappableNode {
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
                this.value.push($node.Statement.build(lex.part(statementStartIndex, i - 1)));
                statementStartIndex = i + 1;
            }
        }
        this.value.push($node.Statement.build(lex.part(statementStartIndex, endIndex)));
        this.setLexPart(lexPart);
    }

    insertStatementBefore(newStatement, refStatement) {
        let index = this.value.indexOf(refStatement);
        if (index !== -1) {
            this.value.splice(index, 0, newStatement);
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
            let root = this.getRoot();
            let commentMap = "";
            if (root.outputCodeReadability === 1) {
                let lexPart = statement.getLexPart();
                let lex = lexPart.lex;
                let token = null;
                for (let i = lexPart.startIndex; i <= lexPart.endIndex; i++) {
                    if (lex.at(i).rawStartIndex !== undefined) {
                        token = lex.at(i);
                        break;
                    }
                }
                if (token !== null) {
                    commentMap = "/*" + (lex.rawLineColumn(token.rawStartIndex)[0] + 1) + "*/";
                }
            }
            if (
                index === this.value.length - 1 &&
                !(this instanceof RootBlock) &&
                statement instanceof $node.ExpressionStatement
            ) {
                return new J([commentMap, "return ", statement.compile(), ";"]);
            }
            else {
                return new J([commentMap, statement.compile(), ";"]);
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
                        root.hasCompilerDirective("node modules") ||
                        root.hasCompilerDirective("node import")
                    )
                );
            }).concat(this.refs);
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
            let libDotDotCalc = this.predefinedLib.dotDotCalc ?
                "var dotDotCalc_" + antiConflictString +
`=function(dotDot, a, b, c) {
    return dotDot(a)[b](a, ...c);
};`
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
                "\"use strict\";",
                hoisted,

                libMod, libOk, libDotDotCalc, libFormattedRegex,

                jb,
                lowered
            ]);
        }
        else {
            if (this.getParent() instanceof $node.FunctionExpression && this.getParent().getAsync()) {
                // While it's more reasonable to write this logic in function expressions,
                // it's simpler to write it here.
                return new J(["((async()=>{", jb, "})())"]);
            }
            else {
                return new J(["(", $node.compileWrapperFunction(jb, this), ")"]);
            }
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
        this._scopeItems = Object.create(null);
        this.refs = [];
    }

    getScopeItems() {
        return this._scopeItems;
    }

    getScopeItemNames() {
        return Object.keys(this._scopeItems);
    }

    // `type` and `declarationNode` are optional.
    addScopeItem(name, type = scopeItemType.NORMAL, declarationNode) {
        if (!this.hasScopeItem(name)) {
            this._scopeItems[name] = {type: type, declarationNode: declarationNode, nodes: []};
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

    renameScopeItem(oldName, newName) {
        this._scopeItems[newName] = this._scopeItems[oldName];
        delete this._scopeItems[oldName];
    }
}

export class RootBlock extends ScopeBlock {
    constructor(lex, outputCodeReadability = 0) {return new Promise((resolve, reject) => {(async () => {try {
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

        this.outputCodeReadability = outputCodeReadability;

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

        await $tools.asyncForEach(this.value, async statement => {
            if (statement instanceof $node.ImportStatement && statement.batchall) {
                let insert = (moduleName, variableName) => {
                    this.insertStatementBefore(new $node.ImportStatement(
                        new $node.Piece("\"" + moduleName + "\""),
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

                // Note: the return value can be an absolute or relative path.
                let resolvePath = (path, baseDir) => {
                    if (baseDir === "") baseDir = ".";
                    if (baseDir.length > 1 && baseDir.endsWith("/")) {
                        baseDir = baseDir.substr(0, baseDir.length - 1);
                    }
                    let s = path;
                    if (!s.startsWith("/")) {
                        if (baseDir === "/") {
                            s = "/" + s;
                        }
                        else {
                            s = baseDir + "/" + s;
                        }
                    }
                    return s;
                };

                let dirName = (path) => {
                    let slashPos = path.lastIndexOf("/");
                    if (slashPos === -1) {
                        return ".";
                    }
                    else {
                        let s = path.substr(0, slashPos);
                        if (s === "") s = "/";
                        return s;
                    }
                };

                if (lex.path === undefined) {
                    throw new NoPathInCodeHavingBatchImportError();
                }
                let baseDir = dirName(lex.path);
                let moduleName = $tools.shrinkString(statement.module.value);
                if (moduleName.endsWith("/")) {
                    throw new BatchImportNameEndsWithSlashError(statement.module.getLexPart());
                }
                let pathToRead = resolvePath(moduleName, baseDir);

                let allVariableNames = null;
                try {
                    allVariableNames = await $lockedApi.fileExports(pathToRead);
                } catch (ex) {}
                if (allVariableNames === null) {
                    try {
                        allVariableNames = await $lockedApi.fileExports(pathToRead + ".fus");
                    } catch (ex) {}
                }
                if (allVariableNames === null) {
                    throw new LoadBatchImportError(statement.getLexPart());
                }

                let variableNames = allVariableNames.filter(m => m !== "default");
                variableNames.forEach(variableName => {
                    insert(moduleName, variableName);
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
            else if (thing instanceof $node.AtomExpression) {
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
            // Note that removing can't be done here, because "parent's child" may be not linked yet,
            // so we can't search "parent's child's parent" (for arrow function arguments).
            if (piece instanceof $node.LocalVariable) {
                if (piece.getParent($node.Statement) instanceof $node.ImportStatement) {
                    piece.getParent(ScopeBlock).addScopeItem(piece.value, scopeItemType.IMPORT);
                }
                else if (piece.getParent() instanceof $node.ArrowArgument) {
                    piece.getParent($node.ArrowFunctionExpression)
                    .body.addScopeItem(piece.value, scopeItemType.ARGUMENT, piece);
                }
                else {
                    piece.getParent(ScopeBlock).addScopeItem(piece.value);
                }
            }

            else if (piece instanceof $node.SymbolMemberName) {
                piece.getParent($node.ClassExpression).addSymbolMember(piece.value);
            }
        };
        makeLinks(this, null);

        // Remove incorrect (i.e. inner scope item with the same name) scope items.
        this.allScopeBlocks.forEach(block => {
            block.getScopeItemNames().forEach(name => {
                if (block.ancestorWithScopeItem(name) !== null) {
                    if (block.getScopeItem(name).type === scopeItemType.ARGUMENT) {
                        throw new ScopeItemNameConflictError(
                            block.getScopeItem(name).declarationNode.getLexPart()
                        );
                    }
                    else {
                        block.removeScopeItem(name);
                    }
                }
            });
        });

        this.allNodes.forEach(node => {
            if (node instanceof $node.LocalVariable) {
                if (node.getParent() instanceof $node.ArrowArgument) {
                    node.getParent($node.ArrowFunctionExpression)
                    .body.addNodeToScopeItem(node, node.value);
                }
                else {
                    let scopeBlock = node.getParent(ScopeBlock).blockWithScopeItem(node.value);
                    scopeBlock.addNodeToScopeItem(node, node.value);
                }
            }
            else if (node instanceof $node.VariableExpression) {
                let scopeBlock = node.getParent(ScopeBlock).blockWithScopeItem(node.value);
                if (scopeBlock !== null) {
                    scopeBlock.addNodeToScopeItem(node, node.value);
                }
            }
        });

        this.allNodes.forEach(node => {
            if (node instanceof $node.SymbolMemberName) {
                node.getParent($node.ClassExpression).addNodeToSymbolMember(node, node.value);
            }
        });

        this.allNodes.forEach(node => {
            if (node instanceof $node.SelfExpression) {
                node.getParent($node.Statement).setHasSelf(true);
            }
        });
        this.allNodes.forEach(node => {
            if (node instanceof $node.AssignStatement) {
                let firstAssignee = node.assignees.value[0];
                if (
                    firstAssignee instanceof $node.DotAssignee &&
                    (node.getHasSelf() || firstAssignee.ifvoid || firstAssignee.ifnull)
                ) {
                    node.setUseBase(true);
                }
            }
        });

        this.allNodes.forEach(node => {
            if (node instanceof $node.WaitExpression) {
                let asyncFunction = node.getParent($node.FunctionExpression);
                if (asyncFunction === null) {
                    throw new AsyncFunctionNotFoundError(node.getLexPart());
                }
                asyncFunction.setAsync(true);
            }
        });

        this.exports = [];
        this.allNodes.forEach(node => {
            if (node instanceof $node.ExportAsExpression) {
                this.exports.push(node.externalName.value);
            }
            else if (node instanceof $node.ExportStatement) {
                this.exports.push(node.externalName.value);
            }
            else if (node instanceof $node.VariableAssignee && node.export) {
                this.exports.push(node.variable.value);
            }
            else if (node instanceof $node.ExportColonStatement) {
                this.exports.push("default");
            }
        });

        this.allNodes.forEach(node => {
            if (node instanceof $node.FunExpression) {
                let fn = node.getParent(m =>
                    m instanceof $node.ArrowFunctionExpression ||
                    m instanceof $node.DiamondFunctionExpression
                );
                if (fn === null) {
                    throw new FunWithoutFunctionError(node.getLexPart());
                }
                if (
                    fn.getParent() instanceof $node.Xy &&
                    fn.getParent().getParent() instanceof $node.Arr &&
                    fn.getParent().getParent().getParent() instanceof $node.ClassExpression
                ) {
                    throw new FunInClassMemberError(node.getLexPart());
                }
                fn.setHasFun(true);
            }
            else if (node instanceof $node.ArgExpression) {
                if (node.getParent($node.DiamondFunctionExpression) === null) {
                    throw new ArgWithoutFunctionError(node.getLexPart());
                }
            }
        });

        resolve(this);
    } catch (ex) {reject(ex);}})();});}

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
                if ($tools.includes(jsForbiddens, name)) {
                    let scopeItem = block.getScopeItem(name);
                    scopeItem.nodes.forEach(node => {
                        if (
                            node.getParent() instanceof $node.VariableAssignee &&
                            node.getParent().variable === node &&
                            node.getParent().export
                        ) {
                            // If the variable name is a JS forbidden and it has export,
                            // then we must save the variable name somewhere else, otherwise
                            // when it gets replaced the name is lost. Here we use the `export`
                            // property, so its value is no longer `true` but a piece
                            // holding the variable name.
                            node.getParent().export = new $node.Piece(node);
                        }
                        node.value = this.replacer();
                    });
                    block.renameScopeItem(name, this.replacer());
                    this.renewReplacer();
                }
            });
        });

        this.allNodes.forEach(node => {
            if (node instanceof $node.ClassExpression) {
                node.getSymbolMemberNames().forEach(name => {
                    let symbolMember = node.getSymbolMember(name);
                    symbolMember.nodes.forEach(node => {
                        node.value = this.replacer();
                    });
                    node.renameSymbolMember(name, this.replacer());
                    this.renewReplacer();
                });
            }
        });

        // The remaining incompatible variable expressions are all global. So we find them
        // and raise error.
        this.allNodes.forEach(node => {
            if (
                node instanceof $node.VariableExpression &&
                $tools.includes(jsForbiddens, node.value)
            ) {
                throw new GlobalVariableNameError(node.getLexPart());
            }
        });

        if (this.comment !== null) {
            this.comment = this.comment.replace(/\*\//g, "  ");
        }
    }

    precompile() {
        // There used to be some code here, but removed. Reserved for possible future use.
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

export class GlobalVariableNameError extends $lex.SyntaxError {
    constructor(lexPart) {
        super(lexPart, "Global variable name can't be a JS forbidden identifier name.");
    }
}

export class NoPathInCodeHavingBatchImportError extends $lex.SyntaxError {
    constructor() {
        super(undefined, "Code having batch import must be in a file.");
    }
}

export class LoadBatchImportError extends $lex.SyntaxError {
    constructor(lexPart) {
        super(lexPart, "Batch import module not found.");
    }
}

export class BatchImportNameEndsWithSlashError extends $lex.SyntaxError {
    constructor(lexPart) {
        super(lexPart, "Batch import path can't end with \"/\".");
    }
}

export class ScopeItemNameConflictError extends $lex.SyntaxError {
    constructor(lexPart) {
        super(lexPart, "Variable name conflict. Inner function's argument can't share " +
            "the same name with an outer variable.");
    }
}

export class AsyncFunctionNotFoundError extends $lex.SyntaxError {
    constructor(lexPart) {
        super(lexPart, "`'wait` must be in a function.");
    }
}

export class FunWithoutFunctionError extends $lex.SyntaxError {
    constructor(lexPart) {
        super(lexPart, "`fun` must be in an arrow or diamond function.");
    }
}

export class FunInClassMemberError extends $lex.SyntaxError {
    constructor(lexPart) {
        super(lexPart, "The `fun` function can't be a class member.");
    }
}

export class ArgWithoutFunctionError extends $lex.SyntaxError {
    constructor(lexPart) {
        super(lexPart, "`@` must be in a diamond function.");
    }
}
