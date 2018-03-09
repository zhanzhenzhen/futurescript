import * as $lex from "./lex.mjs";
import * as $node from "./node.mjs";
import * as $base from "./expression-base.mjs";
import * as $pattern from "./pattern.mjs";
import * as $print from "./print.mjs";
import {JsBuilder as J} from "./js-builder.mjs";

export class NormalVariantExpression extends $base.Expression {
    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, $lex.NormalVariant, $lex.NormalToken], [0, 2]]
        ];
    }

    static applyMatch(match, lex) {
        let value = this.build(lex.part(match[0]));
        let variantName = lex.at(match[1].startIndex).value;
        if (variantName === "ok") {
            return new OkVariantExpression(value);
        }
        else if (variantName === "wait") {
            throw new VariantNameError(lex.part(match[1]));
            // TODO: wait expression
            //return new WaitExpression(value);
        }
        else {
            throw new VariantNameError(lex.part(match[1]));
        }
    }
}

export class OkVariantExpression extends $base.Expression {
    constructor(x) {
        super();
        this.x = x;
    }

    bareCompile() {
        this.getRoot().predefinedLib.ok = true;
        return ["ok_" + $node.antiConflictString + "(", this.x.compile(), ")"];
    }
}

export class WaitExpression extends $base.Expression {
    constructor(x) {
        super();
        this.x = x;
    }

    bareCompile() {
    }
}

export class FunctionVariantExpression extends $base.Expression {
    constructor(x) {
        super();
        this.x = x;
    }

    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, $lex.FunctionVariant], [0]]
        ];
    }

    static applyMatch(match, lex) {
        return new this(
            this.build(lex.part(match[0]))
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
