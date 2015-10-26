import * as $lex from "./compile-lex-0";
import * as $block from "./compile-block-0";
import * as $pattern from "../lib/compile-pattern-0";
import * as $print from "../lib/compile-print-0";
import * as $statement from "./compile-statement-0";

export class Expression {
    static leftToRight() {
        return this.precedence.find(group => group.types.includes(this)).leftToRight;
    }

    static build(lexPart, parentBlock) {
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
            else {
                throw new Error("The single token can't be parsed as expression.");
            }
        }
        else if (
            lex.at(startIndex) instanceof $lex.NormalLeftParenthesis &&
            lex.at(endIndex) instanceof $lex.RightParenthesis
        ) {
            return this.build(lexPart.shrink(), parentBlock);
        }
        else {
            for (let i = 0; i < this.precedence.length; i++) {
                let group = this.precedence[i];
                let nearest = null;
                for (let j = 0; j < group.types.length; j++) {
                    let type = group.types[j];
                    let match = type.match(lexPart, parentBlock);
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
                    return nearest.type.applyMatch(nearest.match, lexPart, parentBlock);
                }
            }
            throw new Error("No pattern matches the possible expression.");
        }
    }

    print(level = 0) {
        return $print.printObject(this, this.constructor, level);
    }
};

export class AtomExpression extends Expression {
    constructor(value) {
        super();
        this.value = value;
    }

    print() {
        return $print.printAtom(this);
    }
};

// Every subclass must have a `sign` static property.
export class BinaryExpression extends Expression {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }

    static match(lexPart, parentBlock) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        let patternMatch = $pattern.Pattern.searchPattern(
            [$pattern.Tokens, this.sign, $pattern.Tokens],
            lexPart,
            this.leftToRight()
        );
        if (patternMatch !== null) {
            return [
                {startIndex: startIndex, endIndex: patternMatch[1] - 1},
                {startIndex: patternMatch[2], endIndex: endIndex}
            ];
        }
        else {
            return null;
        }
    }

    static applyMatch(match, lexPart, parentBlock) {
        return new this(
            this.build(lexPart.changeTo(match[0]), parentBlock),
            this.build(lexPart.changeTo(match[1]), parentBlock)
        );
    }
};

export class VariableExpression extends AtomExpression {
    compile() {
        return this.value;
    }
};

export class NumberExpression extends AtomExpression {
    compile() {
        return this.value;
    }
};

// This represents a virtual argument inside the virtual caller that denotes the whole string.
export class StringExpression extends AtomExpression {};

// This represents the virtual caller that denotes the whole string.
export class InlineNormalStringExpression extends AtomExpression {};