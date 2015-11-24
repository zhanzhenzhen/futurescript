import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $block from "./c-block-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import * as $statement from "./c-statement-0.js";
import * as $expressionBase from "./c-expression-base-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

export class ImportExpression extends $expressionBase.Expression {
    constructor(module, properties, to) {
        super();
        this.module = module;
        this.properties = properties;
        this.to = to;
    }

    static patternsAndCaptures() {
        return [
            [[$lex.Import, $lex.InlineNormalString, $pattern.CallParenthesisPair], [[1, 2], null, null]],
            [[$lex.Import, $lex.InlineNormalString, $pattern.CallParenthesisPair,
                $lex.As, $lex.NormalToken], [[1, 2], null, null]],
            [[$lex.Import, $lex.InlineNormalString, $pattern.CallParenthesisPair,
                (m => m instanceof $lex.NormalToken && m.value === "all"),
                $lex.As, $lex.NormalToken], [1, null, null]],
            [[$lex.Try, $pattern.any], [1, null, null, null]]
        ];
    }

    static applyMatch(match, lex) {
    }

    rawCompile() {
    }
}
