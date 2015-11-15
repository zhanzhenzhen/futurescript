import * as $lex from "./compile-lex-0";
import * as $node from "./compile-node-0";
import * as $block from "./compile-block-0";
import * as $pattern from "../lib/compile-pattern-0";
import * as $print from "../lib/compile-print-0";
import * as $statement from "./compile-statement-0";
import * as $expressionBase from "./compile-expression-base-0";
import {JsBuilder as J} from "./compile-js-builder-0";

export class InExpression extends $expressionBase.BinaryExpression {}
InExpression.sign = $lex.In;

export class NotInExpression extends $expressionBase.BinaryExpression {}
NotInExpression.sign = $lex.NotIn;

export class IsExpression extends $expressionBase.BinaryExpression {}
IsExpression.sign = $lex.Is;

export class IsntExpression extends $expressionBase.BinaryExpression {}
IsntExpression.sign = $lex.Isnt;
