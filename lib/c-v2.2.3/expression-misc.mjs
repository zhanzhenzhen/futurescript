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
        lex.part(match[1]).addStyle(16);
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
        let root = this.getRoot();
        let ref = root.replacer();
        this.getParent($node.ScopeBlock).refs.push(ref);
        root.renewReplacer();
        return [
            "(" + ref + "=", this.x.compile(), ")===undefined?",
            this.y.compile(), ":" + ref
        ];
    }
}
IfvoidExpression.sign = $lex.Ifvoid;

export class IfnullExpression extends $base.BinaryExpression {
    bareCompile() {
        let root = this.getRoot();
        let ref = root.replacer();
        this.getParent($node.ScopeBlock).refs.push(ref);
        root.renewReplacer();
        return [
            "(" + ref + "=", this.x.compile(), ")===undefined||" +
            ref + "===null?",
            this.y.compile(), ":" + ref
        ];
    }
}
IfnullExpression.sign = $lex.Ifnull;
