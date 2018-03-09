import * as $lex from "./lex.mjs";
import * as $node from "./node.mjs";
import * as $base from "./expression-base.mjs";
import * as $pattern from "./pattern.mjs";
import * as $print from "./print.mjs";
import {JsBuilder as J} from "./js-builder.mjs";

export class DotExpression extends $base.Expression {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }

    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, $lex.Dot, $pattern.tokens], [0, 2]],
            [[$pattern.tokens, $lex.FatDot, $pattern.tokens], [0, 2]]
        ];
    }

    static applyMatch(match, lex) {
        let left = this.build(lex.part(match[0]));
        let right = null;
        if (lex.at(match[1].startIndex) instanceof $lex.NormalLeftParenthesis) {
            right = this.build(lex.part(match[1]).shrink());
        }
        else if (
            (
                lex.at(match[0].endIndex) instanceof $lex.Me ||
                lex.at(match[0].endIndex) instanceof $lex.ClassMe
            ) &&
            (
                lex.at(match[1].startIndex) instanceof $lex.NormalToken &&
                lex.at(match[1].startIndex).value.startsWith("_")
            )
        ) {
            right = new $node.SymbolMemberName(lex.part(match[1]));
        }
        else {
            right = new $node.Piece(lex.part(match[1]));
        }
        return new this(left, right);
    }

    bareCompile() {
        let jb = (x, y) => new J(
            y instanceof $node.Expression || y instanceof $node.SymbolMemberName ?
            [x.compile(), "[", y.compile(), "]"] :
            [x.compile(), ".", y.compile()]
        );
        if (this.x instanceof $node.OkVariantExpression) {
            this.getRoot().predefinedLib.ok = true;
            return [
                "ok_" + $node.antiConflictString + "(",
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

export class ObjectExpression extends $base.Expression {
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
                    let colonPos = $pattern.Pattern.searchOne($lex.Colon, lex.part(m), true);
                    let firstPart = lex.part(m.startIndex, colonPos - 1);
                    let secondPart = lex.part(colonPos + 1, m.endIndex);
                    return new $node.Xy(
                        (
                            lex.at(m.startIndex) instanceof $lex.NormalToken ?
                            new $node.Piece(firstPart) :
                            this.build(firstPart)
                        ),
                        this.build(secondPart)
                    );
                })
            )
        );
    }

    bareCompile() {
        return [
            "{",
            new J(
                this.value.value.map(m => new J([
                    (
                        m.x instanceof $node.Expression ?
                        new J(["[", m.x.compile(), "]"]) :
                        m.x.compile()
                    ),
                    ":",
                    m.y.compile()
                ])),
                ","
            ),
            "}"
        ];
    }
}

export class ArrayExpression extends $base.Expression {
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

    bareCompile() {
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
