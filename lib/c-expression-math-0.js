import {hub} from "./c-expression-hub-0.js";
import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $block from "./c-block-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import * as $statement from "./c-statement-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

hub.PlusExpression = class extends hub.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "+", this.y.compile()];
    }
}
hub.PlusExpression.sign = $lex.Plus;

hub.MinusExpression = class extends hub.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "-", this.y.compile()];
    }
}
hub.MinusExpression.sign = $lex.Minus;

hub.TimesExpression = class extends hub.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "*", this.y.compile()];
    }
}
hub.TimesExpression.sign = $lex.Times;

hub.OverExpression = class extends hub.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "/", this.y.compile()];
    }
}
hub.OverExpression.sign = $lex.Over;

hub.EqualExpression = class extends hub.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "===", this.y.compile()];
    }
}
hub.EqualExpression.sign = $lex.Equal;

hub.NotEqualExpression = class extends hub.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "!==", this.y.compile()];
    }
}
hub.NotEqualExpression.sign = $lex.NotEqual;

hub.LessThanExpression = class extends hub.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "<", this.y.compile()];
    }
}
hub.LessThanExpression.sign = $lex.LessThan;

hub.GreaterThanExpression = class extends hub.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), ">", this.y.compile()];
    }
}
hub.GreaterThanExpression.sign = $lex.GreaterThan;

hub.LessThanOrEqualExpression = class extends hub.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "<=", this.y.compile()];
    }
}
hub.LessThanOrEqualExpression.sign = $lex.LessThanOrEqual;

hub.GreaterThanOrEqualExpression = class extends hub.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), ">=", this.y.compile()];
    }
}
hub.GreaterThanOrEqualExpression.sign = $lex.GreaterThanOrEqual;

hub.OrExpression = class extends hub.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "||", this.y.compile()];
    }
}
hub.OrExpression.sign = $lex.Or;

hub.AndExpression = class extends hub.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "&&", this.y.compile()];
    }
}
hub.AndExpression.sign = $lex.And;

hub.NotExpression = class extends hub.UnaryExpression {
    rawCompile() {
        return ["!", this.x.compile()];
    }
}
hub.NotExpression.sign = $lex.Not;

hub.PositiveExpression = class extends hub.UnaryExpression {
    rawCompile() {
        return ["+", this.x.compile()];
    }
}
hub.PositiveExpression.sign = $lex.Positive;

hub.NegativeExpression = class extends hub.UnaryExpression {
    rawCompile() {
        return ["-", this.x.compile()];
    }
}
hub.NegativeExpression.sign = $lex.Negative;

hub.RemExpression = class extends hub.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "%", this.y.compile()];
    }
}
hub.RemExpression.sign = $lex.Rem;

hub.ModExpression = class extends hub.BinaryExpression {
    rawCompile() {
        this.getRoot().predefinedLib.mod = true;
        return ["mod_" + $block.antiConflictString + "(", this.x.compile(), ",", this.y.compile(), ")"];
    }
}
hub.ModExpression.sign = $lex.Mod;

hub.PowerExpression = class extends hub.BinaryExpression {
    rawCompile() {
        return ["Math.pow(", this.x.compile(), ",", this.y.compile(), ")"];
    }
}
hub.PowerExpression.sign = $lex.Power;
