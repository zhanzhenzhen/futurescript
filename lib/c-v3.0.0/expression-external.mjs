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
            let leftPart = new J([(this.y.determineUseNew() ? "new " : ""), this.y.callee.compile()]);
            let args = new J(this.y.arguments.value.map(m => m.compile()), ",");
            if (this.y.arguments.value.length > 0) {
                return [leftPart, "(", arg, ",", args, ")"];
            }
            else {
                return [leftPart, "(", arg, ")"];
            }
        }
        else {
            return [this.y.compile(), "(", arg, ")"];
        }
    }
}
PipeExpression.sign = $lex.Pipe;

export class DotDotExpression extends $base.Expression {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }

    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, $lex.DotDot, $lex.NormalToken], [0, 2]]
        ];
    }

    static applyMatch(match, lex) {
        return new this(
            this.build(lex.part(match[0])),
            new $node.Piece(lex.part(match[1]))
        );
    }
}
