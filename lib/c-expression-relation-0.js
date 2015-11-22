import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $block from "./c-block-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import * as $statement from "./c-statement-0.js";
import * as $expressionBase from "./c-expression-base-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

export class InExpression extends $expressionBase.BinaryExpression {
    rawCompile() {
        return [this.y.compile(), ".indexOf(", this.x.compile(), ")>=0"];
    }
}
InExpression.sign = $lex.In;

export class NotInExpression extends $expressionBase.BinaryExpression {
    rawCompile() {
        return [this.y.compile(), ".indexOf(", this.x.compile(), ")<0"];
    }
}
NotInExpression.sign = $lex.NotIn;

export class IsExpression extends $expressionBase.BinaryExpression {
    rawCompile() {
        if (this.y instanceof $expressionBase.VariableExpression && (
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
IsExpression.sign = $lex.Is;

export class IsntExpression extends $expressionBase.BinaryExpression {
    rawCompile() {
        if (this.y instanceof $expressionBase.VariableExpression && (
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
IsntExpression.sign = $lex.Isnt;
