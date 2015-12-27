import * as $lex from "../c-v0.1.0/lex.js";
import * as $node from "../c-v0.1.0/node.js";
import * as $base from "../c-v0.1.0/expression-base.js";
import * as $pattern from "../c-v0.1.0/pattern.js";
import * as $print from "../c-v0.1.0/print.js";
import {JsBuilder as J} from "../c-v0.1.0/js-builder.js";

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
