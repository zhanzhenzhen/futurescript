import * as $lex from "./lex.mjs";
import * as $node from "./node.mjs";
import * as $base from "./expression-base.mjs";
import * as $pattern from "./pattern.mjs";
import * as $print from "./print.mjs";
import {JsBuilder as J} from "./js-builder.mjs";

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

    bareCompile() {
        return [$node.compileAssignee(this.assignee), "=", this.value.compile()];
    }
}

export class IfvoidExpression extends $base.BinaryExpression {
    bareCompile() {
        this.getRoot().predefinedLib.ifvoid = true;
        return ["ifvoid_" + $node.antiConflictString + "(", this.x.compile(), ",", this.y.compile(), ")"];
    }
}
IfvoidExpression.sign = $lex.Ifvoid;

export class IfnullExpression extends $base.BinaryExpression {
    bareCompile() {
        this.getRoot().predefinedLib.ifnull = true;
        return ["ifnull_" + $node.antiConflictString + "(", this.x.compile(), ",", this.y.compile(), ")"];
    }
}
IfnullExpression.sign = $lex.Ifnull;
