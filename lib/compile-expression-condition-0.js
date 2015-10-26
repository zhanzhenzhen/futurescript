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
            [[$lex.If, $pattern.Tokens, $pattern.ChevronPair], [1, 2]],
            [[$lex.If, $pattern.Tokens, $lex.Then, $pattern.Any, $lex.Else, $pattern.Any], [1, 3, 5]],
            [[$lex.If, $pattern.Tokens, $lex.Then, $pattern.Any], [1, 3]],
            [[$pattern.Tokens, $lex.Then, $pattern.Any, $lex.Else, $pattern.Any], [0, 2, 4]],
            [[$pattern.Tokens, $lex.Then, $pattern.Any], [0, 2]]
        ];
    }

    static applyMatch(match, lexPart, parentBlock) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        let thenStuff = null;
        if (match[1] !== null) {
            thenStuff = $statement.Statement.buildBlock(lex.part(match[1]), parentBlock);
        }
        let elseStuff = null;
        if (match[2] !== null) {
            elseStuff = $statement.Statement.buildBlock(lex.part(match[2]), parentBlock);
        }
        return new this(
            this.build(lexPart.changeTo(match[0]), parentBlock),
            thenStuff,
            elseStuff
        );
    }
};
