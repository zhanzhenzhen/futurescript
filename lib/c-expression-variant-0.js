import {pool} from "./c-expression-pool-0.js";
import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $block from "./c-block-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import * as $statement from "./c-statement-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

export class NormalVariantExpression extends pool.Expression {
    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, $lex.NormalVariant, $lex.NormalToken], [0, 2]]
        ];
    }

    static applyMatch(match, lex) {
        let value = this.build(lex.part(match[0]));
        let variantName = lex.at(match[1].startIndex).value;
        if (variantName === "ok") {
            return new OkVariantExpression(value);
        }
        else {
            throw new VariantNameError(lex.part(match[1]));
        }
    }
}

export class OkVariantExpression extends pool.Expression {
    constructor(x) {
        super();
        this.x = x;
    }

    rawCompile() {
        this.getRoot().predefinedLib.ok = true;
        return ["ok_" + $block.antiConflictString + "(", this.x.compile(), ")"];
    }
}

export class FunctionVariantExpression extends pool.Expression {
    constructor(x) {
        super();
        this.x = x;
    }

    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, $lex.FunctionVariant], [0]]
        ];
    }

    static applyMatch(match, lex) {
        return new this(
            this.build(lex.part(match[0]))
        );
    }

    rawCompile() {
        let arg = "functionVariantArg_" + $block.antiConflictString;
        return [
            "(" + arg + ")=>{return ",
            this.x.compile(),
            "(..." + arg + ");}"
        ];
    }
}

export class VariantNameError extends $lex.SyntaxError {
    constructor(lexPart) {
        super(lexPart, "Variant name not supported.");
    }
}
