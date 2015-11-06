import * as $lex from "./compile-lex-0";
import * as $node from "./compile-node-0";
import * as $block from "./compile-block-0";
import * as $pattern from "../lib/compile-pattern-0";
import * as $print from "../lib/compile-print-0";
import * as $statement from "./compile-statement-0";
import * as $expressionBase from "./compile-expression-base-0";

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
            right = new $node.AtomNode(lex.at(match[1].startIndex).value);
        }
        return new this(left, right);
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
        let memberRanges = $pattern.Pattern.split(
            [$lex.Comma, $lex.Semicolon],
            lex.part(match[0]).shrink()
        );
        return new this(
            new $node.Arr(memberRanges.map(m => {
                let nvRanges = $pattern.Pattern.split(
                    $lex.Colon,
                    lex.part(m)
                );
                return new $node.Xy(
                    new $node.AtomNode(lex.at(nvRanges[0].startIndex).value),
                    this.build(lex.part(nvRanges[1]))
                );
            }))
        );
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
        let elementRanges = $pattern.Pattern.split(
            [$lex.Comma, $lex.Semicolon],
            lex.part(match[0]).shrink()
        );
        return new this(
            new $node.Arr(elementRanges.map(m =>
                this.build(lex.part(m))
            ))
        );
    }
}
