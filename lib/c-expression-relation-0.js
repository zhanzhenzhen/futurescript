import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $block from "./c-block-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import * as $statement from "./c-statement-0.js";
import * as $expressionBase from "./c-expression-base-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

export class InExpression extends $expressionBase.BinaryExpression {}
InExpression.sign = $lex.In;

export class NotInExpression extends $expressionBase.BinaryExpression {}
NotInExpression.sign = $lex.NotIn;

export class IsExpression extends $expressionBase.BinaryExpression {}
IsExpression.sign = $lex.Is;

export class IsntExpression extends $expressionBase.BinaryExpression {}
IsntExpression.sign = $lex.Isnt;
