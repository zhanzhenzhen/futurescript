import * as $lex from "./compile-lex-0";
import * as $node from "./compile-node-0";
import * as $block from "./compile-block-0";
import * as $pattern from "../lib/compile-pattern-0";
import * as $print from "../lib/compile-print-0";
import * as $statement from "./compile-statement-0";
import * as $expressionBase from "./compile-expression-base-0";

export class PlusExpression extends $expressionBase.BinaryExpression {
    compile() {
        return this.x.compile() + "+" + this.y.compile();
    }
}
PlusExpression.sign = $lex.Plus;

export class MinusExpression extends $expressionBase.BinaryExpression {
    compile() {
        return this.x.compile() + "-" + this.y.compile();
    }
}
MinusExpression.sign = $lex.Minus;

export class TimesExpression extends $expressionBase.BinaryExpression {
    compile() {
        return this.x.compile() + "*" + this.y.compile();
    }
}
TimesExpression.sign = $lex.Times;

export class OverExpression extends $expressionBase.BinaryExpression {
    compile() {
        return this.x.compile() + "/" + this.y.compile();
    }
}
OverExpression.sign = $lex.Over;

export class EqualExpression extends $expressionBase.BinaryExpression {
    compile() {
        return this.x.compile() + "===" + this.y.compile();
    }
}
EqualExpression.sign = $lex.Equal;

export class NotEqualExpression extends $expressionBase.BinaryExpression {
    compile() {
        return this.x.compile() + "!==" + this.y.compile();
    }
}
NotEqualExpression.sign = $lex.NotEqual;

export class LessThanExpression extends $expressionBase.BinaryExpression {
    compile() {
        return this.x.compile() + "<" + this.y.compile();
    }
}
LessThanExpression.sign = $lex.LessThan;

export class GreaterThanExpression extends $expressionBase.BinaryExpression {
    compile() {
        return this.x.compile() + ">" + this.y.compile();
    }
}
GreaterThanExpression.sign = $lex.GreaterThan;

export class LessThanOrEqualExpression extends $expressionBase.BinaryExpression {
    compile() {
        return this.x.compile() + "<=" + this.y.compile();
    }
}
LessThanOrEqualExpression.sign = $lex.LessThanOrEqual;

export class GreaterThanOrEqualExpression extends $expressionBase.BinaryExpression {
    compile() {
        return this.x.compile() + ">=" + this.y.compile();
    }
}
GreaterThanOrEqualExpression.sign = $lex.GreaterThanOrEqual;

export class OrExpression extends $expressionBase.BinaryExpression {
    compile() {
        return this.x.compile() + "||" + this.y.compile();
    }
}
OrExpression.sign = $lex.Or;

export class AndExpression extends $expressionBase.BinaryExpression {
    compile() {
        return this.x.compile() + "&&" + this.y.compile();
    }
}
AndExpression.sign = $lex.And;

export class NotExpression extends $expressionBase.UnaryExpression {
    compile() {
        return "!" + this.x.compile();
    }
}
NotExpression.sign = $lex.Not;
