import * as $lex from "./lex.mjs";
import * as $node from "./node.mjs";
import * as $base from "./expression-base.mjs";
import * as $pattern from "./pattern.mjs";
import * as $print from "./print.mjs";
import {JsBuilder as J} from "./js-builder.mjs";

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
