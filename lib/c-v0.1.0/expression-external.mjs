import * as $lex from "./lex.mjs";
import * as $node from "./node.mjs";
import * as $base from "./expression-base.mjs";
import * as $pattern from "./pattern.mjs";
import * as $print from "./print.mjs";
import {JsBuilder as J} from "./js-builder.mjs";

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
