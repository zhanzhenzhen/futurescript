import * as $lex from "./compile-lex-0";
import * as $block from "./compile-block-0";
import * as $pattern from "../lib/compile-pattern-0";
import * as $print from "../lib/compile-print-0";
import * as $statement from "./compile-statement-0";
import * as $expressionBase from "./compile-expression-base-0";

export class ArrowFunctionExpression extends $expressionBase.Expression {
    constructor(args, body) {
        super();
        this.arguments = args;
        this.body = body;
    }

    static match(lexPart, parentBlock) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        let patternMatch = null;
        let argumentsMatch = null;

        patternMatch = $pattern.Pattern.matchPattern(
            [$pattern.ParenthesisPair, $lex.ArrowFunction, $pattern.Any],
            lexPart,
            true
        );
        if (patternMatch !== null) {
            argumentsMatch = $pattern.Pattern.split(
                $lex.Comma,
                lex.part(patternMatch[0] + 1, patternMatch[1] - 2)
            );
        }
        else {
            patternMatch = $pattern.Pattern.matchPattern(
                [$pattern.BracketPair, $lex.ArrowFunction, $pattern.Any],
                lexPart,
                true
            );
            if (patternMatch !== null) {
                argumentsMatch = [{startIndex: patternMatch[0] + 1, endIndex: patternMatch[1] - 2}];
            }
            else {
                patternMatch = $pattern.Pattern.matchPattern(
                    [$lex.NormalToken, $lex.ArrowFunction, $pattern.Any],
                    lexPart,
                    true
                );
                if (patternMatch !== null) {
                    argumentsMatch = [{startIndex: patternMatch[0], endIndex: patternMatch[0]}];
                }
            }
        }

        if (argumentsMatch !== null) {
            let r = [];
            for (let i = 0; i < argumentsMatch.length; i++) {
                if (argumentsMatch[i].endIndex >= argumentsMatch[i].startIndex) {
                    r.push({
                        startIndex: argumentsMatch[i].startIndex,
                        endIndex: argumentsMatch[i].endIndex
                    });
                }
            }
            r.push({startIndex: patternMatch[2], endIndex: endIndex});
            return r;
        }

        return null;
    }

    static applyMatch(match, lexPart, parentBlock) {
        let lastMatch = match[match.length - 1];
        return new this(
            new $statement.Arr(match.slice(0, match.length - 1).map(arg =>
                new $statement.Atom(lexPart.lex.at(arg.startIndex).value)
            )),
            this.build(lexPart.lex.part(lastMatch.startIndex, lastMatch.endIndex), parentBlock)
        );
    }
};

export class ParenthesisCallExpression extends $expressionBase.Expression {
    constructor(callee, args) {
        super();
        this.callee = callee;
        this.arguments = args;
    }

    static match(lexPart, parentBlock) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        let patternMatch = $pattern.Pattern.matchPattern(
            [$pattern.Tokens, $pattern.ParenthesisPair],
            lexPart,
            false
        );
        if (patternMatch !== null && lex.at(patternMatch[1]) instanceof $lex.CallLeftParenthesis) {
            let argumentsMatch = $pattern.Pattern.split(
                $lex.Comma,
                lex.part(patternMatch[1] + 1, endIndex - 1)
            );
            let r = [{startIndex: startIndex, endIndex: patternMatch[1] - 1}];
            for (let i = 0; i < argumentsMatch.length; i++) {
                if (argumentsMatch[i].endIndex >= argumentsMatch[i].startIndex) {
                    r.push({
                        startIndex: argumentsMatch[i].startIndex,
                        endIndex: argumentsMatch[i].endIndex
                    });
                }
            }
            return r;
        }
        else {
            return null;
        }
    }

    static applyMatch(match, lexPart, parentBlock) {
        return new this(
            this.build(lexPart.changeTo(match[0]), parentBlock),
            new $statement.Arr(match.slice(1).map(arg =>
                this.build(lexPart.changeTo(arg), parentBlock)
            ))
        );
    }

    print(level = 0) {
        return $print.printObject(this, this.constructor, level);
    }
};
