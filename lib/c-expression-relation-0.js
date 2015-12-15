import {pool} from "./c-expression-pool-0.js";
import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $block from "./c-block-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import * as $statement from "./c-statement-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

pool.InExpression = class InExpression extends pool.BinaryExpression {
    rawCompile() {
        return [this.y.compile(), ".indexOf(", this.x.compile(), ")>=0"];
    }
}
pool.InExpression.sign = $lex.In;

pool.NotInExpression = class NotInExpression extends pool.BinaryExpression {
    rawCompile() {
        return [this.y.compile(), ".indexOf(", this.x.compile(), ")<0"];
    }
}
pool.NotInExpression.sign = $lex.NotIn;

pool.IsExpression = class IsExpression extends pool.BinaryExpression {
    rawCompile() {
        if (this.y instanceof pool.VariableExpression && (
            this.y.value === "Number" ||
            this.y.value === "Boolean" ||
            this.y.value === "String" ||
            this.y.value === "Symbol"
        )) {
            return ["typeof ", this.x.compile(), "===\"" + this.y.value.toLowerCase() + "\""];
        }
        else {
            return [this.x.compile(), " instanceof ", this.y.compile()];
        }
    }
}
pool.IsExpression.sign = $lex.Is;

pool.IsntExpression = class IsntExpression extends pool.BinaryExpression {
    rawCompile() {
        if (this.y instanceof pool.VariableExpression && (
            this.y.value === "Number" ||
            this.y.value === "Boolean" ||
            this.y.value === "String" ||
            this.y.value === "Symbol"
        )) {
            return ["typeof ", this.x.compile(), "!==\"" + this.y.value.toLowerCase() + "\""];
        }
        else {
            return ["!(", this.x.compile(), " instanceof ", this.y.compile(), ")"];
        }
    }
}
pool.IsntExpression.sign = $lex.Isnt;
