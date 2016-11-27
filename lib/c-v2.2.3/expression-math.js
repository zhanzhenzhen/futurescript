import * as $tools from "./tools.js";
import * as $lex from "./lex.js";
import * as $node from "./node.js";
import * as $base from "./expression-base.js";
import * as $pattern from "./pattern.js";
import * as $print from "./print.js";
import {JsBuilder as J} from "./js-builder.js";

export class PlusExpression extends $base.BinaryExpression {
    bareCompile() {
        return [this.x.compile(), "+", this.y.compile()];
    }
}
PlusExpression.sign = $lex.Plus;

export class MinusExpression extends $base.BinaryExpression {
    bareCompile() {
        return [this.x.compile(), "-", this.y.compile()];
    }
}
MinusExpression.sign = $lex.Minus;

export class TimesExpression extends $base.BinaryExpression {
    bareCompile() {
        return [this.x.compile(), "*", this.y.compile()];
    }
}
TimesExpression.sign = $lex.Times;

export class OverExpression extends $base.BinaryExpression {
    bareCompile() {
        return [this.x.compile(), "/", this.y.compile()];
    }
}
OverExpression.sign = $lex.Over;

export class BinaryCompareExpression extends $base.BinaryExpression {
    static patternsAndCaptures() {
        return [
            [[$pattern.tokensExcept([
                $lex.Equal,
                $lex.NotEqual,
                $lex.LessThan,
                $lex.GreaterThan,
                $lex.LessThanOrEqual,
                $lex.GreaterThanOrEqual
            ]), this.sign, $pattern.tokensExcept([
                $lex.Equal,
                $lex.NotEqual,
                $lex.LessThan,
                $lex.GreaterThan,
                $lex.LessThanOrEqual,
                $lex.GreaterThanOrEqual
            ])], [0, 2]]
        ];
    }
}

export class EqualExpression extends BinaryCompareExpression {
    bareCompile() {
        return [this.x.compile(), "===", this.y.compile()];
    }
}
EqualExpression.sign = $lex.Equal;

export class NotEqualExpression extends BinaryCompareExpression {
    bareCompile() {
        return [this.x.compile(), "!==", this.y.compile()];
    }
}
NotEqualExpression.sign = $lex.NotEqual;

export class LessThanExpression extends BinaryCompareExpression {
    bareCompile() {
        return [this.x.compile(), "<", this.y.compile()];
    }
}
LessThanExpression.sign = $lex.LessThan;

export class GreaterThanExpression extends BinaryCompareExpression {
    bareCompile() {
        return [this.x.compile(), ">", this.y.compile()];
    }
}
GreaterThanExpression.sign = $lex.GreaterThan;

export class LessThanOrEqualExpression extends BinaryCompareExpression {
    bareCompile() {
        return [this.x.compile(), "<=", this.y.compile()];
    }
}
LessThanOrEqualExpression.sign = $lex.LessThanOrEqual;

export class GreaterThanOrEqualExpression extends BinaryCompareExpression {
    bareCompile() {
        return [this.x.compile(), ">=", this.y.compile()];
    }
}
GreaterThanOrEqualExpression.sign = $lex.GreaterThanOrEqual;

export class ChainedCompareExpression extends $base.Expression {
    constructor(chain) {
        super();
        this.chain = chain;
    }

    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, token => $tools.instanceof(token, [
                $lex.Equal,
                $lex.LessThan,
                $lex.LessThanOrEqual
            ]), $pattern.tokens, token => $tools.instanceof(token, [
                $lex.Equal,
                $lex.LessThan,
                $lex.LessThanOrEqual
            ]), $pattern.tokens], [0, 1, 2, 3, 4]],
            [[$pattern.tokens, token => $tools.instanceof(token, [
                $lex.Equal,
                $lex.GreaterThan,
                $lex.GreaterThanOrEqual
            ]), $pattern.tokens, token => $tools.instanceof(token, [
                $lex.Equal,
                $lex.GreaterThan,
                $lex.GreaterThanOrEqual
            ]), $pattern.tokens], [0, 1, 2, 3, 4]]
        ];
    }

    static applyMatch(match, lex) {
        let convert = lexPart => {
            let token = lexPart.token();
            if (token instanceof $lex.Equal) {
                return new $node.Equal().setLexPart(lexPart);
            }
            else if (token instanceof $lex.LessThan) {
                return new $node.LessThan().setLexPart(lexPart);
            }
            else if (token instanceof $lex.GreaterThan) {
                return new $node.GreaterThan().setLexPart(lexPart);
            }
            else if (token instanceof $lex.LessThanOrEqual) {
                return new $node.LessThanOrEqual().setLexPart(lexPart);
            }
            else if (token instanceof $lex.GreaterThanOrEqual) {
                return new $node.GreaterThanOrEqual().setLexPart(lexPart);
            }
        };
        return new this(
            new $node.Arr([
                this.build(lex.part(match[0])),
                convert(lex.part(match[1])),
                this.build(lex.part(match[2])),
                convert(lex.part(match[3])),
                this.build(lex.part(match[4]))
            ])
        );
    }

    bareCompile() {
        let convert = operator => {
            if (operator instanceof $node.Equal) {
                return "===";
            }
            else if (operator instanceof $node.NotEqual) {
                return "!==";
            }
            else if (operator instanceof $node.LessThan) {
                return "<";
            }
            else if (operator instanceof $node.GreaterThan) {
                return ">";
            }
            else if (operator instanceof $node.LessThanOrEqual) {
                return "<=";
            }
            else if (operator instanceof $node.GreaterThanOrEqual) {
                return ">=";
            }
        };
        let chain = this.chain.value;
        let root = this.getRoot();
        let ref = root.replacer();
        this.getParent($node.ScopeBlock).refs.push(ref);
        root.renewReplacer();
        return [
            chain[0].compile(),
            convert(chain[1]) +
            "(" + ref + "=", chain[2].compile(), ")&&" +
            ref + convert(chain[3]),
            chain[4].compile()
        ];
    }
}

export class OrExpression extends $base.BinaryExpression {
    bareCompile() {
        return [this.x.compile(), "||", this.y.compile()];
    }
}
OrExpression.sign = $lex.Or;

export class AndExpression extends $base.BinaryExpression {
    bareCompile() {
        return [this.x.compile(), "&&", this.y.compile()];
    }
}
AndExpression.sign = $lex.And;

export class NotExpression extends $base.UnaryExpression {
    bareCompile() {
        return ["!", this.x.compile()];
    }
}
NotExpression.sign = $lex.Not;

export class PositiveExpression extends $base.UnaryExpression {
    bareCompile() {
        return ["+", this.x.compile()];
    }
}
PositiveExpression.sign = $lex.Positive;

export class NegativeExpression extends $base.UnaryExpression {
    bareCompile() {
        return ["-", this.x.compile()];
    }
}
NegativeExpression.sign = $lex.Negative;

export class RemExpression extends $base.BinaryExpression {
    bareCompile() {
        return [this.x.compile(), "%", this.y.compile()];
    }
}
RemExpression.sign = $lex.Rem;

export class ModExpression extends $base.BinaryExpression {
    bareCompile() {
        this.getRoot().predefinedLib.mod = true;
        return ["mod_" + $node.antiConflictString + "(", this.x.compile(), ",", this.y.compile(), ")"];
    }
}
ModExpression.sign = $lex.Mod;

export class PowerExpression extends $base.BinaryExpression {
    bareCompile() {
        return ["Math.pow(", this.x.compile(), ",", this.y.compile(), ")"];
    }
}
PowerExpression.sign = $lex.Power;
