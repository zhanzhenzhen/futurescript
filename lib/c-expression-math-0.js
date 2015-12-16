import {pool} from "./c-expression-pool-0.js";
import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $block from "./c-block-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import * as $statement from "./c-statement-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

export class PlusExpression extends pool.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "+", this.y.compile()];
    }
}
pool.PlusExpression.sign = $lex.Plus;

export class MinusExpression extends pool.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "-", this.y.compile()];
    }
}
pool.MinusExpression.sign = $lex.Minus;

export class TimesExpression extends pool.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "*", this.y.compile()];
    }
}
pool.TimesExpression.sign = $lex.Times;

export class OverExpression extends pool.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "/", this.y.compile()];
    }
}
pool.OverExpression.sign = $lex.Over;

export class EqualExpression extends pool.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "===", this.y.compile()];
    }
}
pool.EqualExpression.sign = $lex.Equal;

export class NotEqualExpression extends pool.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "!==", this.y.compile()];
    }
}
pool.NotEqualExpression.sign = $lex.NotEqual;

export class LessThanExpression extends pool.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "<", this.y.compile()];
    }
}
pool.LessThanExpression.sign = $lex.LessThan;

export class GreaterThanExpression extends pool.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), ">", this.y.compile()];
    }
}
pool.GreaterThanExpression.sign = $lex.GreaterThan;

export class LessThanOrEqualExpression extends pool.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "<=", this.y.compile()];
    }
}
pool.LessThanOrEqualExpression.sign = $lex.LessThanOrEqual;

export class GreaterThanOrEqualExpression extends pool.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), ">=", this.y.compile()];
    }
}
pool.GreaterThanOrEqualExpression.sign = $lex.GreaterThanOrEqual;

export class OrExpression extends pool.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "||", this.y.compile()];
    }
}
pool.OrExpression.sign = $lex.Or;

export class AndExpression extends pool.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "&&", this.y.compile()];
    }
}
pool.AndExpression.sign = $lex.And;

export class NotExpression extends pool.UnaryExpression {
    rawCompile() {
        return ["!", this.x.compile()];
    }
}
pool.NotExpression.sign = $lex.Not;

export class PositiveExpression extends pool.UnaryExpression {
    rawCompile() {
        return ["+", this.x.compile()];
    }
}
pool.PositiveExpression.sign = $lex.Positive;

export class NegativeExpression extends pool.UnaryExpression {
    rawCompile() {
        return ["-", this.x.compile()];
    }
}
pool.NegativeExpression.sign = $lex.Negative;

export class RemExpression extends pool.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "%", this.y.compile()];
    }
}
pool.RemExpression.sign = $lex.Rem;

export class ModExpression extends pool.BinaryExpression {
    rawCompile() {
        this.getRoot().predefinedLib.mod = true;
        return ["mod_" + $block.antiConflictString + "(", this.x.compile(), ",", this.y.compile(), ")"];
    }
}
pool.ModExpression.sign = $lex.Mod;

export class PowerExpression extends pool.BinaryExpression {
    rawCompile() {
        return ["Math.pow(", this.x.compile(), ",", this.y.compile(), ")"];
    }
}
pool.PowerExpression.sign = $lex.Power;
