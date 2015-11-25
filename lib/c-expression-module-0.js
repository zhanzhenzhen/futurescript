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
            [[$lex.Import, $lex.InlineNormalString, $pattern.CallParenthesisPair], [[1, 2], null, null]],
            [[$lex.Import, $lex.InlineNormalString, $pattern.CallParenthesisPair,
                $lex.As, $lex.NormalToken], [[1, 2], null, 4]],
            [[$lex.Import, $lex.InlineNormalString, $pattern.CallParenthesisPair,
                (m => m instanceof $lex.NormalToken && m.value === "all"),
                $lex.As, $lex.NormalToken], [[1, 2], 3, 5]],
            [[$lex.Import, $lex.InlineNormalString, $pattern.CallParenthesisPair,
                $lex.As, $lex.NormalBracePair], [[1, 2], null, 4]],
            [[$lex.Import, $lex.InlineNormalString, $pattern.CallParenthesisPair,
                (m => m instanceof $lex.NormalToken && m.value === "all"),
                $lex.As, $lex.NormalBracePair], [[1, 2], 3, 5]],
            [[$lex.Import, $lex.InlineNormalString, $pattern.CallParenthesisPair,
                (m => m instanceof $lex.NormalToken && m.value === "all")], [[1, 2], 3, null]]
        ];
    }

    static applyMatch(match, lex) {
        if (match[1] === null && match[2] === null) {
            return new this(this.build(lex.part(match[0])), null, null, false);
        }
        else {
            throw new Error("\"import\" syntax error.");
        }
    }

    rawCompile() {
    }
}
