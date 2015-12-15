import {pool} from "./c-expression-pool-0.js";
import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $block from "./c-block-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import * as $statement from "./c-statement-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

pool.PlusExpression = class extends pool.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "+", this.y.compile()];
    }
}
pool.PlusExpression.sign = $lex.Plus;

pool.MinusExpression = class extends pool.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "-", this.y.compile()];
    }
}
pool.MinusExpression.sign = $lex.Minus;

pool.TimesExpression = class extends pool.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "*", this.y.compile()];
    }
}
pool.TimesExpression.sign = $lex.Times;

pool.OverExpression = class extends pool.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "/", this.y.compile()];
    }
}
pool.OverExpression.sign = $lex.Over;

pool.EqualExpression = class extends pool.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "===", this.y.compile()];
    }
}
pool.EqualExpression.sign = $lex.Equal;

pool.NotEqualExpression = class extends pool.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "!==", this.y.compile()];
    }
}
pool.NotEqualExpression.sign = $lex.NotEqual;

pool.LessThanExpression = class extends pool.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "<", this.y.compile()];
    }
}
pool.LessThanExpression.sign = $lex.LessThan;

pool.GreaterThanExpression = class extends pool.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), ">", this.y.compile()];
    }
}
pool.GreaterThanExpression.sign = $lex.GreaterThan;

pool.LessThanOrEqualExpression = class extends pool.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "<=", this.y.compile()];
    }
}
pool.LessThanOrEqualExpression.sign = $lex.LessThanOrEqual;

pool.GreaterThanOrEqualExpression = class extends pool.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), ">=", this.y.compile()];
    }
}
pool.GreaterThanOrEqualExpression.sign = $lex.GreaterThanOrEqual;

pool.OrExpression = class extends pool.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "||", this.y.compile()];
    }
}
pool.OrExpression.sign = $lex.Or;

pool.AndExpression = class extends pool.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "&&", this.y.compile()];
    }
}
pool.AndExpression.sign = $lex.And;

pool.NotExpression = class extends pool.UnaryExpression {
    rawCompile() {
        return ["!", this.x.compile()];
    }
}
pool.NotExpression.sign = $lex.Not;

pool.PositiveExpression = class extends pool.UnaryExpression {
    rawCompile() {
        return ["+", this.x.compile()];
    }
}
pool.PositiveExpression.sign = $lex.Positive;

pool.NegativeExpression = class extends pool.UnaryExpression {
    rawCompile() {
        return ["-", this.x.compile()];
    }
}
pool.NegativeExpression.sign = $lex.Negative;

pool.RemExpression = class extends pool.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "%", this.y.compile()];
    }
}
pool.RemExpression.sign = $lex.Rem;

pool.ModExpression = class extends pool.BinaryExpression {
    rawCompile() {
        this.getRoot().predefinedLib.mod = true;
        return ["mod_" + $block.antiConflictString + "(", this.x.compile(), ",", this.y.compile(), ")"];
    }
}
pool.ModExpression.sign = $lex.Mod;

pool.PowerExpression = class extends pool.BinaryExpression {
    rawCompile() {
        return ["Math.pow(", this.x.compile(), ",", this.y.compile(), ")"];
    }
}
pool.PowerExpression.sign = $lex.Power;
