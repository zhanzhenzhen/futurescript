import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $block from "./c-block-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import * as $statement from "./c-statement-0.js";
import * as $expressionBase from "./c-expression-base-0.js";
import * as $expressionVariant from "./c-expression-variant-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

export class DotExpression extends $expressionBase.Expression {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }

    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, $lex.Dot, $pattern.tokens], [0, 2]]
        ];
    }

    static applyMatch(match, lex) {
        let left = this.build(lex.part(match[0]));
        let right = null;
        if (lex.at(match[1].startIndex) instanceof $lex.NormalLeftParenthesis) {
            right = this.build(lex.part(match[1]).shrink());
        }
        else {
            right = new $node.Piece(lex.part(match[1]));
        }
        return new this(left, right);
    }

    rawCompile() {
        let jb = (x, y) => new J(
            y instanceof $expressionBase.Expression ?
            [x.compile(), "[", y.compile(), "]"] :
            [x.compile(), ".", y.compile()]
        );
        if (this.x instanceof $expressionVariant.OkVariantExpression) {
            return [
                "ok_" + $block.antiConflictString + "(",
                this.x.x.compile(),
                ")?",
                jb(this.x.x, this.y),
                ":undefined"
            ];
        }
        else {
            return jb(this.x, this.y);
        }
    }
}

export class ObjectExpression extends $expressionBase.Expression {
    constructor(value) {
        super();
        this.value = value;
    }

    static patternsAndCaptures() {
        return [
            [[$pattern.BracePair], [0]]
        ];
    }

    static applyMatch(match, lex) {
        let innerLexPart = lex.part(match[0]).shrink();
        let memberRanges = $pattern.Pattern.split(
            [$lex.Comma, $lex.Semicolon],
            innerLexPart
        );
        return new this(
            new $node.Arr(
                innerLexPart.startIndex > innerLexPart.endIndex ?
                [] :
                memberRanges.map(m => {
                    let nvRanges = $pattern.Pattern.split(
                        $lex.Colon,
                        lex.part(m)
                    );
                    return new $node.Xy(
                        new $node.Piece(lex.part(nvRanges[0])),
                        this.build(lex.part(nvRanges[1]))
                    );
                })
            )
        );
    }

    rawCompile() {
        return [
            "{",
            new J(
                this.value.value.map(m => new J([m.x.compile(), ":", m.y.compile()])),
                ","
            ),
            "}"
        ];
    }
}

export class ArrayExpression extends $expressionBase.Expression {
    constructor(value) {
        super();
        this.value = value;
    }

    static patternsAndCaptures() {
        return [
            [[$pattern.BracketPair], [0]]
        ];
    }

    static applyMatch(match, lex) {
        let innerLexPart = lex.part(match[0]).shrink();
        let elementRanges = $pattern.Pattern.split(
            [$lex.Comma, $lex.Semicolon],
            innerLexPart
        );
        return new this(
            new $node.Arr(
                innerLexPart.startIndex > innerLexPart.endIndex ?
                [] :
                elementRanges.map(m =>
                    this.build(lex.part(m))
                )
            )
        );
    }

    rawCompile() {
        return [
            "[",
            new J(
                this.value.value.map(m => m.compile()),
                ","
            ),
            "]"
        ];
    }
}
