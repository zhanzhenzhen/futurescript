import * as $lex from "./compile-lex-0";
import * as $node from "./compile-node-0";
import * as $expression from "./compile-expression-0";
import * as $block from "./compile-block-0";
import * as $pattern from "./compile-pattern-0";
import * as $print from "../lib/compile-print-0";

export class Statement extends $node.Node {
    static match(lexPart) {
        let pcs = this.patternsAndCaptures();
        for (let i = 0; i < pcs.length; i++) {
            let pc = pcs[i];

            // For statement, `leftToRight` argument in pattern doesn't have any effect,
            // but it's better to set it to true so that it will run faster.
            let candidate = $pattern.Pattern.matchPatternCapture(pc[0], lexPart, true, pc[1]);

            if (candidate !== null) {
                return candidate;
            }
        }
        return null;
    }

    static matchAndApply(lexPart) {
        let match = this.match(lexPart);
        if (match === null) {
            return null;
        }
        else {
            return this.applyMatch(match, lexPart.lex);
        }
    }

    static buildBlock(lexPart) {
        if (lexPart === null) {
            return null;
        }
        else if (lexPart.lex.at(lexPart.startIndex) instanceof $lex.LeftChevron) {
            return new $block.Block(lexPart.shrink());
        }
        else {
            return new $block.Block(lexPart);
        }
    }

    static build(lexPart) {
        let r = null;
        r = PostIfStatement.matchAndApply(lexPart);
        if (r === null) {
            r = AssignStatement.matchAndApply(lexPart);
        }
        if (r === null) {
            r = new ExpressionStatement($expression.Expression.build(lexPart));
        }
        return r;
    }
}

export class ExpressionStatement extends Statement {
    constructor(expression) {
        super();
        this.expression = expression;
    }
}

export class PostIfStatement extends ExpressionStatement {
    static patternsAndCaptures() {
        return $expression.PostIfExpression.patternsAndCaptures();
    }

    static applyMatch(match, lex) {
        return new this($expression.PostIfExpression.applyMatch(...arguments));
    }
}

export class AssignStatement extends Statement {
    constructor(assignee, value) {
        super();
        this.assignee = assignee;
        this.value = value;
    }

    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, $lex.Colon, $pattern.tokens], [0, 2]]
        ];
    }

    static applyMatch(match, lex) {
        return new this(
            $expression.Expression.build(lex.part(match[0])),
            $expression.Expression.build(lex.part(match[1]))
        );
    }

    compile() {
        return this.assignee.compile() + "=" + this.value.compile();
    }
}
