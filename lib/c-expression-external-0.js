import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $block from "./c-block-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import * as $statement from "./c-statement-0.js";
import * as $expressionBase from "./c-expression-base-0.js";
import * as $expressionObject from "./c-expression-object-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

export class PipeExpression extends $expressionBase.BinaryExpression {
}
PipeExpression.sign = $lex.Pipe;

export class FatDotExpression extends $expressionBase.Expression {
    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, $lex.FatDot, $pattern.tokens], [0, 2]]
        ];
    }

    static applyMatch(match, lex) {
        return $expressionObject.DotExpression.applyMatch(...arguments);
    }
}
