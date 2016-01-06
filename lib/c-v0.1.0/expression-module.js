import * as $lex from "./lex.js";
import * as $node from "./node.js";
import * as $base from "./expression-base.js";
import * as $pattern from "./pattern.js";
import * as $print from "./print.js";
import {JsBuilder as J} from "./js-builder.js";

export class ImportExpression extends $base.Expression {
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

    bareCompile() {
        let root = this.getRoot();
        if (
            root.hasCompilerDirective("node modules") ||
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

export class ExportAsExpression extends $base.Expression {
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

    bareCompile() {
        let root = this.getRoot();
        if (
            root.hasCompilerDirective("node modules") ||
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
