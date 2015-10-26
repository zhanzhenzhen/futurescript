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
