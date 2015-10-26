import * as $lex from "./compile-lex-0";
import * as $block from "./compile-block-0";
import * as $pattern from "../lib/compile-pattern-0";
import * as $print from "../lib/compile-print-0";
import * as $statement from "./compile-statement-0";
import * as $expressionBase from "./compile-expression-base-0";

export class IfExpression extends $expressionBase.Expression {
    constructor(condition, thenBranch, elseBranch) {
        super();
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
    }

    static match(lexPart, parentBlock) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        let patternMatch = null;

        patternMatch = $pattern.Pattern.matchPattern(
            [$lex.If, $pattern.Tokens, $pattern.ChevronPair, $lex.Else, $pattern.Any],
            lexPart,
            true
        );
        if (patternMatch !== null) {
            return [
                {startIndex: patternMatch[1], endIndex: patternMatch[2] - 1},
                {startIndex: patternMatch[2], endIndex: patternMatch[3] - 1},
                {startIndex: patternMatch[4], endIndex: endIndex}
            ];
        }

        patternMatch = $pattern.Pattern.matchPattern(
            [$lex.If, $pattern.Tokens, $pattern.ChevronPair],
            lexPart,
            true
        );
        if (patternMatch !== null) {
            return [
                {startIndex: patternMatch[1], endIndex: patternMatch[2] - 1},
                {startIndex: patternMatch[2], endIndex: patternMatch[3] - 1},
                null
            ];
        }

        patternMatch = $pattern.Pattern.matchPattern(
            [$lex.If, $pattern.Tokens, $lex.Then, $pattern.Any, $lex.Else, $pattern.Any],
            lexPart,
            true
        );
        if (patternMatch !== null) {
            return [
                {startIndex: patternMatch[1], endIndex: patternMatch[2] - 1},
                {startIndex: patternMatch[3], endIndex: patternMatch[4] - 1},
                {startIndex: patternMatch[5], endIndex: endIndex}
            ];
        }

        patternMatch = $pattern.Pattern.matchPattern(
            [$lex.If, $pattern.Tokens, $lex.Then, $pattern.Any],
            lexPart,
            true
        );
        if (patternMatch !== null) {
            return [
                {startIndex: patternMatch[1], endIndex: patternMatch[2] - 1},
                {startIndex: patternMatch[3], endIndex: patternMatch[4] - 1},
                null
            ];
        }

        patternMatch = $pattern.Pattern.matchPattern(
            [$pattern.Tokens, $lex.Then, $pattern.Any, $lex.Else, $pattern.Any],
            lexPart,
            true
        );
        if (patternMatch !== null) {
            return [
                {startIndex: patternMatch[0], endIndex: patternMatch[1] - 1},
                {startIndex: patternMatch[2], endIndex: patternMatch[3] - 1},
                {startIndex: patternMatch[4], endIndex: endIndex}
            ];
        }

        patternMatch = $pattern.Pattern.matchPattern(
            [$pattern.Tokens, $lex.Then, $pattern.Any],
            lexPart,
            true
        );
        if (patternMatch !== null) {
            return [
                {startIndex: patternMatch[0], endIndex: patternMatch[1] - 1},
                {startIndex: patternMatch[2], endIndex: patternMatch[3] - 1},
                null
            ];
        }

        return null;
    }

    static applyMatch(match, lexPart, parentBlock) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        let thenStuff = null;
        if (match[1] !== null) {
            let thenLexPart = lexPart.changeTo(match[1]);
            thenStuff =
                lex.at(match[1].startIndex) instanceof $lex.LeftChevron ?
                new $block.Block(thenLexPart.shrink()) :
                this.build(thenLexPart, parentBlock);
        }
        let elseStuff = null;
        if (match[2] !== null) {
            let elseLexPart = lexPart.changeTo(match[2]);
            elseStuff =
                lex.at(match[2].startIndex) instanceof $lex.LeftChevron ?
                new $block.Block(elseLexPart.shrink()) :
                this.build(elseLexPart, parentBlock);
        }
        return new this(
            this.build(lexPart.changeTo(match[0]), parentBlock),
            thenStuff,
            elseStuff
        );
    }
};
