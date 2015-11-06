import * as $lex from "./compile-lex-0";
import * as $node from "./compile-node-0";
import * as $block from "./compile-block-0";
import * as $pattern from "../lib/compile-pattern-0";
import * as $print from "../lib/compile-print-0";
import * as $statement from "./compile-statement-0";
import * as $expressionBase from "./compile-expression-base-0";

export class AsExpression extends $expressionBase.Expression {
    constructor(value, assignee) {
        super();
        this.value = value;
        this.assignee = assignee;
    }

    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, $lex.As, $pattern.tokens], [0, 2]]
        ];
    }

    static applyMatch(match, lex) {
        let assignee = null;
        let startIndex = match[1].startIndex;
        let endIndex = match[1].endIndex;

        let exportOn;
        if (
            lex.at(endIndex - 1) instanceof $lex.NormalVariant &&
            lex.at(endIndex) instanceof $lex.NormalToken &&
            lex.at(endIndex).value === "export"
        ) {
            exportOn = true;
            endIndex -= 2;
        }

        let dotMatch = $pattern.Pattern.matchPatternCapture(
            [$pattern.tokens, $lex.Dot, $pattern.tokens],
            lex.part(startIndex, endIndex),
            false,
            [0, 2]
        );
        if (dotMatch !== null) {
            assignee = new $node.DotAssignee({
                x: $expression.Expression.build(lex.part(dotMatch[0])),
                y: (
                    lex.at(dotMatch[1].startIndex) instanceof $lex.LeftParenthesis ?
                    $expression.Expression.build(lex.part(dotMatch[1])) :
                    new $node.AtomNode(lex.at(dotMatch[1].startIndex).value)
                ),
                export: exportOn
            });
        }
        else {
            assignee = new $node.VariableAssignee({
                variable: new $node.AtomNode(lex.at(startIndex).value),
                export: exportOn
            });
        }

        return new this(
            this.build(lex.part(match[0])),
            assignee
        );
    }
}
