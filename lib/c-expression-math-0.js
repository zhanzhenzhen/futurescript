import {face} from "./c-expression-face-0.js";
import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $block from "./c-block-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import * as $statement from "./c-statement-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

face.PlusExpression = class extends face.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "+", this.y.compile()];
    }
}
face.PlusExpression.sign = $lex.Plus;

face.MinusExpression = class extends face.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "-", this.y.compile()];
    }
}
face.MinusExpression.sign = $lex.Minus;

face.TimesExpression = class extends face.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "*", this.y.compile()];
    }
}
face.TimesExpression.sign = $lex.Times;

face.OverExpression = class extends face.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "/", this.y.compile()];
    }
}
face.OverExpression.sign = $lex.Over;

face.EqualExpression = class extends face.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "===", this.y.compile()];
    }
}
face.EqualExpression.sign = $lex.Equal;

face.NotEqualExpression = class extends face.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "!==", this.y.compile()];
    }
}
face.NotEqualExpression.sign = $lex.NotEqual;

face.LessThanExpression = class extends face.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "<", this.y.compile()];
    }
}
face.LessThanExpression.sign = $lex.LessThan;

face.GreaterThanExpression = class extends face.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), ">", this.y.compile()];
    }
}
face.GreaterThanExpression.sign = $lex.GreaterThan;

face.LessThanOrEqualExpression = class extends face.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "<=", this.y.compile()];
    }
}
face.LessThanOrEqualExpression.sign = $lex.LessThanOrEqual;

face.GreaterThanOrEqualExpression = class extends face.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), ">=", this.y.compile()];
    }
}
face.GreaterThanOrEqualExpression.sign = $lex.GreaterThanOrEqual;

face.OrExpression = class extends face.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "||", this.y.compile()];
    }
}
face.OrExpression.sign = $lex.Or;

face.AndExpression = class extends face.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "&&", this.y.compile()];
    }
}
face.AndExpression.sign = $lex.And;

face.NotExpression = class extends face.UnaryExpression {
    rawCompile() {
        return ["!", this.x.compile()];
    }
}
face.NotExpression.sign = $lex.Not;

face.PositiveExpression = class extends face.UnaryExpression {
    rawCompile() {
        return ["+", this.x.compile()];
    }
}
face.PositiveExpression.sign = $lex.Positive;

face.NegativeExpression = class extends face.UnaryExpression {
    rawCompile() {
        return ["-", this.x.compile()];
    }
}
face.NegativeExpression.sign = $lex.Negative;

face.RemExpression = class extends face.BinaryExpression {
    rawCompile() {
        return [this.x.compile(), "%", this.y.compile()];
    }
}
face.RemExpression.sign = $lex.Rem;

face.ModExpression = class extends face.BinaryExpression {
    rawCompile() {
        this.getRoot().predefinedLib.mod = true;
        return ["mod_" + $block.antiConflictString + "(", this.x.compile(), ",", this.y.compile(), ")"];
    }
}
face.ModExpression.sign = $lex.Mod;

face.PowerExpression = class extends face.BinaryExpression {
    rawCompile() {
        return ["Math.pow(", this.x.compile(), ",", this.y.compile(), ")"];
    }
}
face.PowerExpression.sign = $lex.Power;
