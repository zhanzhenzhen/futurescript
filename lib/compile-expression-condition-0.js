import * as $lex from "./compile-lex-0";
import * as $node from "./compile-node-0";
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

    static patternsAndCaptures() {
        return [
            [[$lex.If, $pattern.tokensExcept([$lex.LeftChevron]),
                $lex.Then, $pattern.any, $lex.Else, $pattern.any], [1, 3, 5]],
            [[$lex.If, $pattern.tokensExcept([$lex.LeftChevron]), $lex.Then, $pattern.any], [1, 3, null]],
            [[$lex.If, $pattern.tokensExcept([$lex.LeftChevron, $lex.Then]),
                $lex.Else, $pattern.any], [1, null, 3]],
            [[$lex.If, $pattern.tokens, $pattern.ChevronPair, $lex.Else, $pattern.any], [1, 2, 4]],
            [[$lex.If, $pattern.tokens, $pattern.ChevronPair], [1, 2, null]],
            [[$lex.If, $pattern.tokens], [1, null, null]],
            [[$pattern.tokens, $lex.Then, $pattern.any, $lex.Else, $pattern.any], [0, 2, 4]],
            [[$pattern.tokens, $lex.Then, $pattern.any], [0, 2, null]],
            [[$pattern.tokens, $lex.If, $pattern.tokensExcept([$lex.LeftChevron, $lex.Then, $lex.Else])],
                [2, 0, null]]
        ];
    }

    static applyMatch(match, lex, parentBlock) {
        return new this(
            this.build(lex.part(match[0]), parentBlock),
            $statement.Statement.buildBlock(lex.part(match[1]), parentBlock),
            $statement.Statement.buildBlock(lex.part(match[2]), parentBlock)
        );
    }
}

export class PostIfExpression extends $expressionBase.Expression {
    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, $lex.If,
                $pattern.tokensExcept([$lex.LeftChevron, $lex.If, $lex.Then, $lex.Else])],
                [2, 0, null]]
        ];
    }

    static applyMatch(match, lex, parentBlock) {
        return new IfExpression(
            this.build(lex.part(match[0]), parentBlock),
            $statement.Statement.buildBlock(lex.part(match[1]), parentBlock),
            $statement.Statement.buildBlock(lex.part(match[2]), parentBlock)
        );
    }
}

export class MatchExpression extends $expressionBase.Expression {
    constructor(comparer, items) {
        super();
        this.comparer = comparer;
        this.items = items;
    }

    static patternsAndCaptures() {
        return [
            [[$lex.Match, $pattern.tokens, $pattern.ChevronPair], [1, 2]]
        ];
    }

    static applyMatch(match, lex, parentBlock) {
        let comparerLastToken = lex.at(match[0].endIndex);
        let comparer = null;
        if (
            comparerLastToken instanceof $lex.Equal ||
            comparerLastToken instanceof $lex.NotEqual ||
            comparerLastToken instanceof $lex.LessThan ||
            comparerLastToken instanceof $lex.GreaterThan ||
            comparerLastToken instanceof $lex.LessThanOrEqual ||
            comparerLastToken instanceof $lex.GreaterThanOrEqual
        ) {
        }
        else {
            comparer = this.build(lex.part(match[0]), parentBlock);
        }
        let itemRanges = $pattern.Pattern
        .split($lex.Semicolon, lex.part(match[1]).shrink())
        .filter(m => m.endIndex >= m.startIndex);
        let items = new $node.Arr(itemRanges.map(m => {
            let pair = $pattern.Pattern.matchPatternsAndCaptures([
                [[$pattern.tokensExcept([$lex.LeftChevron]), $lex.Then, $pattern.any], [0, 2]],
                [[$pattern.tokens, $pattern.ChevronPair], [0, 1]],
                [[$pattern.tokensExcept([$lex.Else])], [0, null]],
                [[$lex.Else, $pattern.any], [null, 1]]
            ], lex.part(m), true);
            let pattern = null;
            if (pair[0] !== null && lex.at(pair[0].startIndex) instanceof $lex.LeftBracket) {
            }
            else {
                pattern = this.build(lex.part(pair[0]), parentBlock);
            }
            let output = this.build(lex.part(pair[1]), parentBlock);
            return new $node.NameValue(pattern, output);
        }));
        return new this(comparer, items);
    }
}
