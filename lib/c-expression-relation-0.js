import {hub} from "./c-expression-hub-0.js";
import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $block from "./c-block-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import * as $statement from "./c-statement-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

hub.InExpression = class extends hub.BinaryExpression {
    rawCompile() {
        return [this.y.compile(), ".indexOf(", this.x.compile(), ")>=0"];
    }
}
hub.InExpression.sign = $lex.In;

hub.NotInExpression = class extends hub.BinaryExpression {
    rawCompile() {
        return [this.y.compile(), ".indexOf(", this.x.compile(), ")<0"];
    }
}
hub.NotInExpression.sign = $lex.NotIn;

hub.IsExpression = class extends hub.BinaryExpression {
    rawCompile() {
        if (this.y instanceof hub.VariableExpression && (
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
hub.IsExpression.sign = $lex.Is;

hub.IsntExpression = class extends hub.BinaryExpression {
    rawCompile() {
        if (this.y instanceof hub.VariableExpression && (
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
hub.IsntExpression.sign = $lex.Isnt;
