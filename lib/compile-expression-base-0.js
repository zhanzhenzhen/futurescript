import * as $lex from "./compile-lex-0";
import * as $node from "./compile-node-0";
import * as $block from "./compile-block-0";
import * as $pattern from "../lib/compile-pattern-0";
import * as $print from "../lib/compile-print-0";
import * as $statement from "./compile-statement-0";

export class Expression extends $node.Node {
    static leftToRight() {
        return this.precedence.find(group => group.types.includes(this)).leftToRight;
    }

    static matchPatternCapture(tokenTypes, lexPart, capture) {
        return $pattern.Pattern.matchPatternCapture(tokenTypes, lexPart, this.leftToRight(), capture);
    }

    static searchOne(ruler, lexPart) {
        return $pattern.Pattern.searchOne(ruler, lexPart, this.leftToRight());
    }

    static match(lexPart) {
        let pcs = this.patternsAndCaptures();
        let leftToRight = this.leftToRight();
        return $pattern.Pattern.matchPatternsAndCaptures(pcs, lexPart, leftToRight);
    }

    static build(lexPart) {
        if (lexPart === null) {
            return null;
        }

        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        if (startIndex === endIndex) {
            let token = lex.at(startIndex);
            if (token instanceof $lex.NormalToken) {
                return new VariableExpression(lex.at(startIndex).value);
            }
            else if (token instanceof $lex.Num) {
                return new NumberExpression(lex.at(startIndex).value);
            }
            else if (token instanceof $lex.Str) {
                return new StringExpression(lex.at(startIndex).value);
            }
            else if (token instanceof $lex.InlineNormalString) {
                return new InlineNormalStringExpression();
            }
            else if (token instanceof $lex.True) {
                return new BooleanExpression("true");
            }
            else if (token instanceof $lex.False) {
                return new BooleanExpression("false");
            }
            else if (token instanceof $lex.Null) {
                return new NullExpression();
            }
            else if (token instanceof $lex.Void) {
                return new VoidExpression();
            }
            else if (token instanceof $lex.Arg) {
                return new ArgExpression();
            }
            else if (token instanceof $lex.Fun) {
                return new FunExpression();
            }
            else if (token instanceof $lex.Self) {
                return new SelfExpression();
            }
            else {
                throw new Error("The single token can't be parsed as expression.");
            }
        }
        else if (
            lex.at(startIndex) instanceof $lex.NormalLeftParenthesis &&
            lex.at(endIndex) instanceof $lex.RightParenthesis
        ) {
            return this.build(lexPart.shrink());
        }
        else {
            for (let i = 0; i < this.precedence.length; i++) {
                let group = this.precedence[i];
                let nearest = null;
                for (let j = 0; j < group.types.length; j++) {
                    let type = group.types[j];
                    let match = type.match(lexPart);
                    if (match !== null) {
                        if (nearest === null) {
                            nearest = {match: match, type: type};
                        }
                        else {
                            if (group.leftToRight) {
                                if (
                                    Math.min(...match.map(m => m.endIndex)) <
                                    Math.min(...nearest.match.map(m => m.endIndex))
                                ) {
                                    nearest = {match: match, type: type};
                                }
                            }
                            else {
                                if (
                                    Math.max(...match.map(m => m.startIndex)) > Math.max(...nearest.match.map(m => m.startIndex))
                                ) {
                                    nearest = {match: match, type: type};
                                }
                            }
                        }
                    }
                }
                if (nearest !== null) {
                    return nearest.type.applyMatch(nearest.match, lex);
                }
            }
            throw new Error("No pattern matches the possible expression.");
        }
    }

    compile() {
        return "(" + this.rawCompile() + ")";
    }
}

export class AtomExpression extends Expression {
    constructor(value) {
        super();
        this.value = value;
    }

    toString() {
        return $print.printAtom(this);
    }
}

// Every subclass must have a `sign` static property.
// This class is only for convenience for `a op b` form where both `a` and `b` are expressions.
// It doesn't include all binary expressions.
export class BinaryExpression extends Expression {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }

    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, this.sign, $pattern.tokens], [0, 2]]
        ];
    }

    static applyMatch(match, lex) {
        return new this(
            this.build(lex.part(match[0])),
            this.build(lex.part(match[1]))
        );
    }
}

// Every subclass must have a `sign` static property.
// This class is only for convenience for `op a` form when `a` is an expression.
// It doesn't include all unary expressions.
export class UnaryExpression extends Expression {
    constructor(x) {
        super();
        this.x = x;
    }

    static patternsAndCaptures() {
        return [
            [[this.sign, $pattern.tokens], [1]]
        ];
    }

    static applyMatch(match, lex) {
        return new this(
            this.build(lex.part(match[0]))
        );
    }
}

export class VariableExpression extends AtomExpression {
    rawCompile() {
        return this.value;
    }
}

export class NumberExpression extends AtomExpression {
    rawCompile() {
        return this.value;
    }
}

export class BooleanExpression extends AtomExpression {
    rawCompile() {
        return this.value;
    }
}

export class NullExpression extends AtomExpression {
    rawCompile() {
        return "null";
    }
}

export class VoidExpression extends AtomExpression {
    rawCompile() {
        return "undefined";
    }
}

export class ArgExpression extends AtomExpression {}

export class FunExpression extends AtomExpression {}

export class SelfExpression extends AtomExpression {}

// This refers to `Str` token.
export class StringExpression extends AtomExpression {}

// This refers to `InlineNormalString` token.
export class InlineNormalStringExpression extends AtomExpression {}
