import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $base from "./c-expression-base-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

export class PipeExpression extends $base.BinaryExpression {
    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, this.sign, $pattern.tokensExcept([$lex.FatDot])], [0, 2]]
        ];
    }

    bareCompile() {
        let arg = this.x.compile();
        if (this.y instanceof $node.ParenthesisCallExpression) {
            let args = new J(this.y.arguments.value.map(m => m.compile()), ",");
            return [this.y.callee.compile(), "(", arg, ",", args, ")"];
        }
        else {
            return [this.y.compile(), "(", arg, ")"];
        }
    }
}
PipeExpression.sign = $lex.Pipe;
