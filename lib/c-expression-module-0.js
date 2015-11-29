import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $block from "./c-block-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import * as $statement from "./c-statement-0.js";
import * as $expressionBase from "./c-expression-base-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

export class ImportExpression extends $expressionBase.Expression {
    constructor(module, mapping, catchall, batchall) {
        super();
        this.module = module;
        this.mapping = mapping;
        this.catchall = catchall;
        this.batchall = batchall;
    }

    static patternsAndCaptures() {
        return [
            [[$lex.Import, $lex.InlineNormalString, $pattern.PseudoCallParenthesisPair],
                [[1, 2], null, null]]
        ];
    }

    static applyMatch(match, lex) {
        return new this(new $node.Piece(lex.part(match[0])), null, null, false);
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
