import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $base from "./c-expression-base-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

export class AsExpression extends $base.Expression {
    // `assignee` can be an assignee, or a `BracketAssignees` instance.
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
        return new this(
            this.build(lex.part(match[0])),
            $node.buildAssignee(lex.part(match[1]), false, false)
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

export class IfvoidExpression extends $base.BinaryExpression {
    rawCompile() {
        this.getRoot().predefinedLib.ifvoid = true;
        return ["ifvoid_" + $node.antiConflictString + "(", this.x.compile(), ",", this.y.compile(), ")"];
    }
}
IfvoidExpression.sign = $lex.Ifvoid;

export class IfnullExpression extends $base.BinaryExpression {
    rawCompile() {
        this.getRoot().predefinedLib.ifnull = true;
        return ["ifnull_" + $node.antiConflictString + "(", this.x.compile(), ",", this.y.compile(), ")"];
    }
}
IfnullExpression.sign = $lex.Ifnull;
