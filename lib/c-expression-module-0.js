import {face} from "./c-expression-face-0.js";
import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $block from "./c-block-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import * as $statement from "./c-statement-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

face.ImportExpression = class extends face.Expression {
    constructor(module) {
        super();
        this.module = module;
    }

    static patternsAndCaptures() {
        return [
            [[$lex.Import, $lex.InlineNormalString, $pattern.PseudoCallParenthesisPair],
                [[1, 2]]]
        ];
    }

    static applyMatch(match, lex) {
        return new this(new $node.Piece(lex.part(match[0])));
    }

    rawCompile() {
        let root = this.getRoot();
        if (
            root.hasCompilerDirective("node module") ||
            root.hasCompilerDirective("node import")
        ) {
            return ["require(", this.module.compile(), ")"];
        }
        else {
            let varName = root.replacer();
            root.hoistedCompiled += "import " + varName + " from " + this.module.compile().js + ";";
            root.renewReplacer();
            return varName;
        }
    }
}

face.ExportAsExpression = class extends face.Expression {
    constructor(value, externalName) {
        super();
        this.value = value;
        this.externalName = externalName;
    }

    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, $lex.ExportAs, $lex.NormalToken], [0, 2]]
        ];
    }

    static applyMatch(match, lex) {
        return new this(
            this.build(lex.part(match[0])),
            new $node.Piece(lex.part(match[1]))
        );
    }

    rawCompile() {
        let root = this.getRoot();
        if (
            root.hasCompilerDirective("node module") ||
            root.hasCompilerDirective("node import")
        ) {
            return ["exports.", this.externalName.compile(), "=", this.value.compile()];
        }
        else {
            let varName = root.replacer();
            root.hoistedCompiled += "var " + varName + ";";
            root.loweredCompiled += "export {" + varName + " as " + this.externalName.compile().js + "};";
            root.renewReplacer();
            return [varName, "=", this.value.compile()];
        }
    }
}
