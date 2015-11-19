import * as $lex from "./c-lex-0";
import * as $node from "./c-node-0";
import * as $block from "./c-block-0";
import * as $pattern from "../lib/c-pattern-0";
import * as $print from "../lib/c-print-0";
import * as $statement from "./c-statement-0";
import * as $expressionBase from "./c-expression-base-0";
import {JsBuilder as J} from "./c-js-builder-0";

export class NormalVariantExpression extends $expressionBase.Expression {
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
            throw new Error("Variant name not supported.");
        }
    }
}

export class OkVariantExpression extends $expressionBase.Expression {
    constructor(x) {
        super();
        this.x = x;
    }
}

export class FunctionVariantExpression extends $expressionBase.Expression {
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
}
