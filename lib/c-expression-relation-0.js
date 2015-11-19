import * as $lex from "./c-lex-0";
import * as $node from "./c-node-0";
import * as $block from "./c-block-0";
import * as $pattern from "../lib/c-pattern-0";
import * as $print from "../lib/c-print-0";
import * as $statement from "./c-statement-0";
import * as $expressionBase from "./c-expression-base-0";
import {JsBuilder as J} from "./c-js-builder-0";

export class InExpression extends $expressionBase.BinaryExpression {}
InExpression.sign = $lex.In;

export class NotInExpression extends $expressionBase.BinaryExpression {}
NotInExpression.sign = $lex.NotIn;

export class IsExpression extends $expressionBase.BinaryExpression {}
IsExpression.sign = $lex.Is;

export class IsntExpression extends $expressionBase.BinaryExpression {}
IsntExpression.sign = $lex.Isnt;
