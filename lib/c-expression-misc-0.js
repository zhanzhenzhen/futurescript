import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $block from "./c-block-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import * as $statement from "./c-statement-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

export class AsExpression extends $node.Expression {
    constructor(value, assignee) {
        super();
        this.value = value;
        this.assignee = assignee;
    }

    static patternsAndCaptures() {
        return [
            [[$pattern.tokensExcept([$lex.Import]), $lex.As, $pattern.tokens], [0, 2]]
        ];
    }

    static applyMatch(match, lex) {
        let assignee = null;
        let startIndex = match[1].startIndex;
        let endIndex = match[1].endIndex;

        let exportOn = false;
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
            let y = null;
            if (lex.at(dotMatch[1].startIndex) instanceof $lex.LeftParenthesis) {
                y = this.build(lex.part(dotMatch[1]));
            }
            else if (
                (
                    lex.at(dotMatch[0].endIndex) instanceof $lex.Me ||
                    lex.at(dotMatch[0].endIndex) instanceof $lex.ClassMe
                ) &&
                (
                    lex.at(dotMatch[1].startIndex) instanceof $lex.NormalToken &&
                    lex.at(dotMatch[1].startIndex).value.startsWith("_")
                )
            ) {
                y = new $node.SymbolMemberName(lex.part(match[1]));
            }
            else {
                y = new $node.Piece(lex.part(dotMatch[1]));
            }
            assignee = new $node.DotAssignee({
                x: this.build(lex.part(dotMatch[0])),
                y: y,
                export: exportOn
            });
        }
        else {
            assignee = new $node.VariableAssignee({
                variable: new $node.LocalVariable(lex.part(match[1])),
                export: exportOn
            });
        }

        return new this(
            this.build(lex.part(match[0])),
            assignee
        );
    }

    rawCompile() {
        let left = null;
        if (this.assignee instanceof $node.DotAssignee) {
            if (
                this.assignee.y instanceof $node.Expression ||
                this.assignee.y instanceof $node.SymbolMemberName
            ) {
                left = new J([this.assignee.x.compile(), "[", this.assignee.y.compile(), "]"]);
            }
            else {
                left = new J([this.assignee.x.compile(), ".", this.assignee.y.compile()]);
            }
        }
        else {
            left = this.assignee.variable.compile();
        }
        return new J([left, "=", this.value.compile()]);
    }
}

export class IfvoidExpression extends $node.BinaryExpression {
    rawCompile() {
        this.getRoot().predefinedLib.ifvoid = true;
        return ["ifvoid_" + $block.antiConflictString + "(", this.x.compile(), ",", this.y.compile(), ")"];
    }
}
IfvoidExpression.sign = $lex.Ifvoid;

export class IfnullExpression extends $node.BinaryExpression {
    rawCompile() {
        this.getRoot().predefinedLib.ifnull = true;
        return ["ifnull_" + $block.antiConflictString + "(", this.x.compile(), ",", this.y.compile(), ")"];
    }
}
IfnullExpression.sign = $lex.Ifnull;
