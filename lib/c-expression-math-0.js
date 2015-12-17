import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $base from "./c-expression-base-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

export class PlusExpression extends $base.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "+", this.y.compile()];
    }
}
PlusExpression.sign = $lex.Plus;

export class MinusExpression extends $base.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "-", this.y.compile()];
    }
}
MinusExpression.sign = $lex.Minus;

export class TimesExpression extends $base.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "*", this.y.compile()];
    }
}
TimesExpression.sign = $lex.Times;

export class OverExpression extends $base.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "/", this.y.compile()];
    }
}
OverExpression.sign = $lex.Over;

export class EqualExpression extends $base.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "===", this.y.compile()];
    }
}
EqualExpression.sign = $lex.Equal;

export class NotEqualExpression extends $base.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "!==", this.y.compile()];
    }
}
NotEqualExpression.sign = $lex.NotEqual;

export class LessThanExpression extends $base.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "<", this.y.compile()];
    }
}
LessThanExpression.sign = $lex.LessThan;

export class GreaterThanExpression extends $base.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), ">", this.y.compile()];
    }
}
GreaterThanExpression.sign = $lex.GreaterThan;

export class LessThanOrEqualExpression extends $base.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "<=", this.y.compile()];
    }
}
LessThanOrEqualExpression.sign = $lex.LessThanOrEqual;

export class GreaterThanOrEqualExpression extends $base.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), ">=", this.y.compile()];
    }
}
GreaterThanOrEqualExpression.sign = $lex.GreaterThanOrEqual;

export class OrExpression extends $base.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "||", this.y.compile()];
    }
}
OrExpression.sign = $lex.Or;

export class AndExpression extends $base.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "&&", this.y.compile()];
    }
}
AndExpression.sign = $lex.And;

export class NotExpression extends $base.UnaryExpression {
    rawCompile() {
        return ["!", this.x.compile()];
    }
}
NotExpression.sign = $lex.Not;

export class PositiveExpression extends $base.UnaryExpression {
    rawCompile() {
        return ["+", this.x.compile()];
    }
}
PositiveExpression.sign = $lex.Positive;

export class NegativeExpression extends $base.UnaryExpression {
    rawCompile() {
        return ["-", this.x.compile()];
    }
}
NegativeExpression.sign = $lex.Negative;

export class RemExpression extends $base.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "%", this.y.compile()];
    }
}
RemExpression.sign = $lex.Rem;

export class ModExpression extends $base.BinaryExpression {
    rawCompile() {
        this.getRoot().predefinedLib.mod = true;
        return ["mod_" + $node.antiConflictString + "(", this.x.compile(), ",", this.y.compile(), ")"];
    }
}
ModExpression.sign = $lex.Mod;

export class PowerExpression extends $base.BinaryExpression {
    rawCompile() {
        return ["Math.pow(", this.x.compile(), ",", this.y.compile(), ")"];
    }
}
PowerExpression.sign = $lex.Power;
