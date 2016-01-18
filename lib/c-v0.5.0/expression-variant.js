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
        if (variantName === "ok") {
            return new OkVariantExpression(value);
        }
        else if (variantName === "wait") {
            this.getParent($node.FunctionExpression).setAsync(true);
            return new WaitExpression(value);
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
        let acs = $node.antiConflictString;
        return ["yield ", this.x.compile(), ",currentValue_" + acs];
        return [
`
var generator_${acs} = function*() {
    yield getMovies();
    r = currentValue_${acs};
    console.log r;
    return r;
};
var gen = generator_${acs}();
var yieldResult = gen.next();
var currentValue_${acs} = undefined;
var checkFunction = () => {
    if (yieldResult.done) {
        setTimeout(() => {
            gen.finish(yieldResult.value);
        }, 0);
    }
    else if (yieldResult.value.next !== undefined) {
        yieldResult.value.finish = result => {
            currentValue_${acs} = result;
            yieldResult = gen.next();
            checkFunction();
        };
    }
    else if (yieldResult.value instanceof Promise) {
        yieldResult.value.then(x => {
            currentValue_${acs} = x;
            yieldResult = gen.next();
            checkFunction();
        });
    }
};
checkFunction();
return gen;
`
        ];
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
