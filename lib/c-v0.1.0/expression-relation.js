import * as $lex from "../c-v0.1.0/lex.js";
import * as $node from "../c-v0.1.0/node.js";
import * as $base from "../c-v0.1.0/expression-base.js";
import * as $pattern from "../c-v0.1.0/pattern.js";
import * as $print from "../c-v0.1.0/print.js";
import {JsBuilder as J} from "../c-v0.1.0/js-builder.js";

export class InExpression extends $base.BinaryExpression {
    bareCompile() {
        return [this.y.compile(), ".indexOf(", this.x.compile(), ")>=0"];
    }
}
InExpression.sign = $lex.In;

export class NotInExpression extends $base.BinaryExpression {
    bareCompile() {
        return [this.y.compile(), ".indexOf(", this.x.compile(), ")<0"];
    }
}
NotInExpression.sign = $lex.NotIn;

export class IsExpression extends $base.BinaryExpression {
    bareCompile() {
        if (this.y instanceof $node.VariableExpression && (
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

export class IsntExpression extends $base.BinaryExpression {
    bareCompile() {
        if (this.y instanceof $node.VariableExpression && (
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
