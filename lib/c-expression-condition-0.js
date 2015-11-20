import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $block from "./c-block-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import * as $statement from "./c-statement-0.js";
import * as $expressionBase from "./c-expression-base-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

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
            [[$lex.If, $pattern.tokensExcept([$lex.LeftChevron, $lex.Then, $lex.Else]),
                (token => token.constructor.isCommand), $pattern.any], [1, [2, 3], null]],
            [[$lex.If, $pattern.tokens, $pattern.ChevronPair, $lex.Else, $pattern.any], [1, 2, 4]],
            [[$lex.If, $pattern.tokens, $pattern.ChevronPair], [1, 2, null]],
            [[$lex.If, $pattern.tokens], [1, null, null]],
            [[$pattern.tokens, $lex.Then, $pattern.any, $lex.Else, $pattern.any], [0, 2, 4]],
            [[$pattern.tokens, $lex.Then, $pattern.any], [0, 2, null]],
            [[$pattern.tokens, $lex.If, $pattern.tokensExcept([$lex.LeftChevron, $lex.Then, $lex.Else])],
                [2, 0, null]]
        ];
    }

    static applyMatch(match, lex) {
        return new this(
            this.build(lex.part(match[0])),
            $statement.Statement.buildBlock(lex.part(match[1])),
            $statement.Statement.buildBlock(lex.part(match[2]))
        );
    }

    rawCompile() {
        return [
            this.condition.compile(),
            "?",
            this.thenBranch === null ? "undefined" : this.thenBranch.compile(),
            ":",
            this.elseBranch === null ? "undefined" : this.elseBranch.compile()
        ];
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

    static applyMatch(match, lex) {
        return new IfExpression(
            this.build(lex.part(match[0])),
            $statement.Statement.buildBlock(lex.part(match[1])),
            $statement.Statement.buildBlock(lex.part(match[2]))
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

    static applyMatch(match, lex) {
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
            comparer = this.build(lex.part(match[0]));
        }
        let itemRanges = $pattern.Pattern
        .split($lex.Semicolon, lex.part(match[1]).shrink())
        .filter(m => m.endIndex >= m.startIndex);
        let items = new $node.Arr(itemRanges.map(m => {
            let pair = $pattern.Pattern.matchPatternsAndCaptures([
                [[$lex.Else, $pattern.any], [null, 1]],
                [[$pattern.tokensExcept([$lex.LeftChevron, $lex.Else]), $lex.Then, $pattern.any], [0, 2]],
                [[$pattern.tokensExcept([$lex.Else, $lex.Then]), $pattern.ChevronPair], [0, 1]],
                [[$pattern.tokensExcept([$lex.LeftChevron, $lex.Else, $lex.Then])], [0, null]]
            ], lex.part(m), true);
            let pattern = null;
            if (pair[0] !== null && lex.at(pair[0].startIndex) instanceof $lex.LeftBracket) {
            }
            else {
                pattern = this.build(lex.part(pair[0]));
            }
            let output = $statement.Statement.buildBlock(lex.part(pair[1]));
            return new $node.Xy(pattern, output);
        }));
        return new this(comparer, items);
    }

    rawCompile() {
        let comparer = "matchComparer_" + $block.antiConflictString;
        let comparerDeclaration = new J(["var " + comparer + "=", this.comparer.compile(), ";"]);
        let items = new J(
            this.items.value
            .filter(m => m.x !== null)
            .map(m => new J([comparer + "===", m.x.compile(), "?", m.y.compile()])),
            ":"
        );
        let lastNode = this.items.value[this.items.value.length - 1];
        let last = lastNode.x === null ? lastNode.y.compile() : "undefined";
        return ["function(){", comparerDeclaration, "return ", items, ":", last, ";}()"];
    }
}
