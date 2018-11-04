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
        let treeY = null;
        let awaitPart = null;

        if (this.y instanceof $node.WaitExpression) {
            treeY = this.y.x;
            awaitPart = "await ";
        }
        else {
            treeY = this.y;
            awaitPart = "";
        }

        if (treeY instanceof $node.ParenthesisCallExpression) {
            let leftPart = new J([(treeY.determineUseNew() ? "new " : ""), treeY.callee.compile()]);
            let args = new J(treeY.arguments.value.map(m => m.compile()), ",");
            if (treeY.arguments.value.length > 0) {
                return [awaitPart, leftPart, "(", arg, ",", args, ")"];
            }
            else {
                return [awaitPart, leftPart, "(", arg, ")"];
            }
        }
        else {
            let useNew = $node.ParenthesisCallExpression.determineUseNew(
                treeY.getRoot(), treeY, false, false
            );
            return [awaitPart, (useNew ? "new " : ""), treeY.compile(), "(", arg, ")"];
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
