import * as $lex from "./lex.js";
import * as $node from "./node.js";
import * as $base from "./expression-base.js";
import * as $pattern from "./pattern.js";
import * as $print from "./print.js";
import {JsBuilder as J} from "./js-builder.js";

export class NormalVariantExpression extends $base.Expression {
    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, $lex.NormalVariant, $lex.NormalToken], [0, 2]]
        ];
    }

    static applyMatch(match, lex) {
        let value = this.build(lex.part(match[0]));
        let variantName = lex.at(match[1].startIndex).value;
        let nextToken = lex.at(match[1].endIndex + 1);
        let chainContinues = $node.chainContinues(nextToken);
        if (variantName === "ok") {
            return new OkVariantExpression(value, chainContinues);
        }
        else if (variantName === "wait") {
            return new WaitExpression(value, chainContinues);
        }
        else {
            throw new VariantNameError(lex.part(match[1]));
        }
    }
}

export class OkVariantExpression extends $base.Expression {
    constructor(x, chainContinues = false) {
        super();
        this.x = x;
        this.chainContinues = chainContinues;
    }

    bareCompile() {
        this.getRoot().predefinedLib.ok = true;
        return ["ok_" + $node.antiConflictString + "(", this.x.compile(), ")"];
    }
}

export class WaitExpression extends $base.Expression {
    constructor(x, chainContinues = false) {
        super();
        this.x = x;
        this.chainContinues = chainContinues;
    }

    bareCompile() {
        this.getRoot().predefinedLib.asyncToGenerator = true;
        return ["yield ", this.x.compile()];
    }
}

export class FunctionVariantExpression extends $base.Expression {
    constructor(x, chainContinues = false) {
        super();
        this.x = x;
        this.chainContinues = chainContinues;
    }

    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, $lex.FunctionVariant], [0]]
        ];
    }

    static applyMatch(match, lex) {
        let nextToken = lex.at(match[0].endIndex + 2);
        let chainContinues = $node.chainContinues(nextToken);
        return new this(
            this.build(lex.part(match[0])), chainContinues
        );
    }

    bareCompile() {
        let arg = "functionVariantArg_" + $node.antiConflictString;
        return [
            "(" + arg + ")=>{return ",
            this.x.compile(),
            "(..." + arg + ");}"
        ];
    }
}

export class VariantNameError extends $lex.SyntaxError {
    constructor(lexPart) {
        super(lexPart, "Variant name not supported.");
    }
}
