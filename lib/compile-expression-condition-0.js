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

    static patternsAndCaptures() {
        return [
            [[$lex.If, $pattern.Tokens, $pattern.ChevronPair, $lex.Else, $pattern.Any], [1, 2, 4]],
            [[$lex.If, $pattern.Tokens, $pattern.ChevronPair], [1, 2, null]],
            [[$lex.If, $pattern.Tokens, $lex.Then, $pattern.Any, $lex.Else, $pattern.Any], [1, 3, 5]],
            [[$lex.If, $pattern.Tokens, $lex.Then, $pattern.Any], [1, 3, null]],
            [[$lex.If, $pattern.Tokens, $lex.Else, $pattern.Any], [1, null, 3]],
            [[$pattern.Tokens, $lex.Then, $pattern.Any, $lex.Else, $pattern.Any], [0, 2, 4]],
            [[$pattern.Tokens, $lex.Then, $pattern.Any], [0, 2, null]],
            [[$pattern.Tokens, $lex.If, $pattern.Tokens], [2, 0, null]]
        ];
    }

    static applyMatch(match, lex, parentBlock) {
        return new this(
            this.build(lex.part(match[0]), parentBlock),
            $statement.Statement.buildBlock(lex.part(match[1]), parentBlock),
            $statement.Statement.buildBlock(lex.part(match[2]), parentBlock)
        );
    }
};
