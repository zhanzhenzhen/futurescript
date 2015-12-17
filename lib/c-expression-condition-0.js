import * as $tools from "./c-tools-0.js";
import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $base from "./c-expression-base-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

export class IfExpression extends $base.Expression {
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
            $node.Statement.buildBlock(lex.part(match[1])),
            $node.Statement.buildBlock(lex.part(match[2]))
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

export class PostIfExpression extends $base.Expression {
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
            $node.Statement.buildBlock(lex.part(match[1])),
            $node.Statement.buildBlock(lex.part(match[2]))
        );
    }
}

export class MatchExpression extends $base.Expression {
    constructor(comparer, items) {
        super();
        this.comparer = comparer;
        this.items = items;
    }

    static patternsAndCaptures() {
        return [
            [[$lex.Match, $pattern.tokens, $pattern.ChevronPair], [1, 2]],
            [[$lex.Match, $pattern.tokens], [1, null]]
        ];
    }

    static applyMatch(match, lex) {
        let comparer = this.build(lex.part(match[0]));
        let itemRanges = match[1] === null ? [] : $pattern.Pattern
        .split($lex.Semicolon, lex.part(match[1]).shrink())
        .filter(m => m.endIndex >= m.startIndex);
        let additionalElseToAdd = null;
        let items = new $node.Arr(itemRanges.map(m => {
            let pair = $pattern.Pattern.matchPatternsAndCaptures([
                [[$lex.Else, $pattern.any], [null, 1]],
                [[$pattern.tokensExcept([$lex.LeftChevron]), $lex.Then, $pattern.any], [0, 2]],
                [[$pattern.tokensExcept([$lex.Then]), $pattern.ChevronPair], [0, 1]]
            ], lex.part(m), true);
            let pattern = null;
            if (pair[0] !== null) {
                let hasElse = lex.at(pair[0].endIndex) instanceof $lex.Else;
                if (hasElse) {
                    if ($tools.instanceof(lex.at(pair[0].endIndex - 1), [$lex.Comma, $lex.Or])) {
                        pair[0].endIndex -= 2;
                    }
                    else {
                        pair[0].endIndex--;
                    }
                    additionalElseToAdd = $node.Statement.buildBlock(lex.part(pair[1]));
                }
                let orRanges = $pattern.Pattern.split(
                    [$lex.Comma, $lex.Or],
                    lex.part(pair[0])
                );
                let andRanges = $pattern.Pattern.split(
                    [$lex.And],
                    lex.part(pair[0])
                );
                let isOr = orRanges.length > 1;
                let isAnd = andRanges.length > 1;
                if (isOr) {
                    pattern = new $node.OrPattern(orRanges.map(m => this.build(lex.part(m))));
                }
                else if (isAnd) {
                    pattern = new $node.AndPattern(andRanges.map(m => this.build(lex.part(m))));
                }
                else {
                    pattern = this.build(lex.part(pair[0]));
                }
            }
            else {
                pattern = this.build(lex.part(pair[0]));
            }
            let output = $node.Statement.buildBlock(lex.part(pair[1]));
            return new $node.Xy(pattern, output);
        }));
        if (additionalElseToAdd !== null) {
            items.value.push(new $node.Xy(null, additionalElseToAdd));
        }
        return new this(comparer, items);
    }

    rawCompile() {
        let comparer = "matchComparer_" + $node.antiConflictString;
        let comparerDeclaration = new J(["var " + comparer + "=", this.comparer.compile(), ";"]);
        let treeNonElseItems = this.items.value.filter(m => m.x !== null);
        let body = null;
        if (this.items.value.length === 0) {
            body = new J("undefined");
        }
        else {
            let conditionPart = x =>
                $tools.instanceof(this.comparer, [
                    $node.ArrowFunctionExpression,
                    $node.DiamondFunctionExpression,
                    $node.DashFunctionExpression
                ]) ?
                new J([comparer + "(", x.compile(), ")"]) :
                new J([comparer + "===", x.compile()]);
            let items = treeNonElseItems.length === 0 ? new J("false?undefined") : new J(
                treeNonElseItems.map(m => {
                    let condition = null;
                    if (m.x instanceof $node.OrPattern) {
                        condition = new J(m.x.value.map(n => conditionPart(n)), "||");
                    }
                    else if (m.x instanceof $node.AndPattern) {
                        condition = new J(m.x.value.map(n => conditionPart(n)), "&&");
                    }
                    else {
                        condition = conditionPart(m.x);
                    }
                    return new J([condition, "?", m.y.compile()]);
                }),
                ":"
            );
            let lastNode = this.items.value[this.items.value.length - 1];
            let last = lastNode.x === null ? lastNode.y.compile() : "undefined";
            body = new J([items, ":", last]);
        }
        return ["(()=>{", comparerDeclaration, "return ", body, ";})()"];
    }
}
