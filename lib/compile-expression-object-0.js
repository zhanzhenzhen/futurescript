import * as $lex from "./compile-lex-0";
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

    static match(lexPart, parentBlock) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        let patternMatch = $pattern.Pattern.searchPattern(
            [$pattern.Tokens, $lex.Dot, $pattern.Tokens],
            lexPart,
            false
        );
        if (patternMatch !== null) {
            return [
                {startIndex: startIndex, endIndex: patternMatch[1] - 1},
                {startIndex: patternMatch[2], endIndex: endIndex}
            ];
        }
        else {
            return null;
        }
    }

    static applyMatch(match, lexPart, parentBlock) {
        let left = this.build(lexPart.lex.part(match[0].startIndex, match[0].endIndex), parentBlock);
        let right = null;
        if (lexPart.lex.at(match[1].startIndex) instanceof $lex.LeftParenthesis) {
            right = this.build(
                lexPart.lex.part(match[1].startIndex + 1, match[1].endIndex - 1),
                parentBlock
            );
        }
        else {
            right = new $statement.Atom(lexPart.lex.at(match[1].startIndex).value);
        }
        return new this(left, right);
    }
};

export class ObjectExpression extends $expressionBase.Expression {
    constructor(value) {
        super();
        this.value = value;
    }

    static match(lexPart, parentBlock) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        let patternMatch = $pattern.Pattern.searchPattern(
            [$pattern.BracePair],
            lexPart,
            false
        );
        if (patternMatch !== null) {
            return $pattern.Pattern.split(
                [$lex.Comma, $lex.Semicolon],
                lexPart.shrink()
            );
        }
        else {
            return null;
        }
    }

    static applyMatch(match, lexPart, parentBlock) {
        return new this(
            new $statement.Arr(match.map(arg => {
                let nvMatch = $pattern.Pattern.split(
                    $lex.Colon,
                    lexPart.lex.part(arg.startIndex, arg.endIndex)
                );
                return new $statement.NameValue(
                    new $statement.Atom(lexPart.lex.at(nvMatch[0].startIndex).value),
                    this.build(lexPart.changeTo(nvMatch[1]), parentBlock)
                );
            }))
        );
    }
};
