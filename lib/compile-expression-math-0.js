import * as $expressionBase from "./compile-expression-base-0";
import * as $lex from "./compile-lex-0";

export class PlusExpression extends $expressionBase.BinaryExpression {};
PlusExpression.sign = $lex.Plus;

export class MinusExpression extends $expressionBase.BinaryExpression {};
MinusExpression.sign = $lex.Minus;

export class TimesExpression extends $expressionBase.BinaryExpression {};
TimesExpression.sign = $lex.Times;

export class OverExpression extends $expressionBase.BinaryExpression {};
OverExpression.sign = $lex.Over;

export class EqualExpression extends $expressionBase.BinaryExpression {};
EqualExpression.sign = $lex.Equal;

export class NotEqualExpression extends $expressionBase.BinaryExpression {};
NotEqualExpression.sign = $lex.NotEqual;

export class LessThanExpression extends $expressionBase.BinaryExpression {};
LessThanExpression.sign = $lex.LessThan;

export class GreaterThanExpression extends $expressionBase.BinaryExpression {};
GreaterThanExpression.sign = $lex.GreaterThan;

export class LessThanOrEqualExpression extends $expressionBase.BinaryExpression {};
LessThanOrEqualExpression.sign = $lex.LessThanOrEqual;

export class GreaterThanOrEqualExpression extends $expressionBase.BinaryExpression {};
GreaterThanOrEqualExpression.sign = $lex.GreaterThanOrEqual;
