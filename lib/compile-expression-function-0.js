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

    static patternsAndCaptures() {
        return [
            [[$pattern.NormalParenthesisPair, $lex.ArrowFunction, $pattern.any], [0, 2]],
            [[$pattern.NormalBracketPair, $lex.ArrowFunction, $pattern.any], [0, 2]],
            [[$lex.NormalToken, $lex.ArrowFunction, $pattern.any], [0, 2]]
        ];
    }

    static applyMatch(match, lex, parentBlock) {
        let argumentsLexPart =
            lex.at(match[0].startIndex) instanceof $lex.NormalLeftParenthesis ?
            lex.part(match[0]).shrink() :
            lex.part(match[0]);
        let argumentRanges = $pattern.Pattern
        .split($lex.Comma, argumentsLexPart)
        .filter(m => m.endIndex >= m.startIndex);
        return new this(
            new $statement.Arr(argumentRanges.map(m =>
                new $statement.Atom(lex.at(m.startIndex).value)
            )),
            this.build(lex.part(match[1]), parentBlock)
        );
    }
};

export class ParenthesisCallExpression extends $expressionBase.Expression {
    constructor(callee, args) {
        super();
        this.callee = callee;
        this.arguments = args;
    }

    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, $pattern.CallParenthesisPair], [0, 1]]
        ];
    }

    static applyMatch(match, lex, parentBlock) {
        let argumentRanges = $pattern.Pattern
        .split($lex.Comma, lex.part(match[1]).shrink())
        .filter(m => m.endIndex >= m.startIndex);
        return new this(
            this.build(lex.part(match[0]), parentBlock),
            new $statement.Arr(argumentRanges.map(m =>
                this.build(lex.part(m), parentBlock)
            ))
        );
    }
};

export class SpaceCallExpression extends $expressionBase.Expression {
    static match(lexPart, parentBlock) {
        let pos = this.searchOne(
            (token, index, lexPart) => {
                let next = lexPart.lex.at(index + 1);
                return (token instanceof $lex.RightParenthesis || token.constructor.canBeCalleeEnd) &&
                    next !== undefined && index < lexPart.endIndex &&
                    (
                        next instanceof $lex.NormalLeftParenthesis ||
                        next instanceof $lex.NormalLeftBracket ||
                        next instanceof $lex.NormalLeftBrace ||
                        !(
                            next.constructor.expressionStartForbidden ||
                            next.constructor.isJoint ||
                            next instanceof $lex.Chevron ||
                            next instanceof $lex.Parenthesis ||
                            next instanceof $lex.Bracket ||
                            next instanceof $lex.Brace
                        )
                    );
            },
            lexPart
        );
        if (pos === null) {
            return null;
        }
        else {
            return [
                {startIndex: lexPart.startIndex, endIndex: pos},
                {startIndex: pos + 1, endIndex: lexPart.endIndex}
            ];
        }
    }

    static applyMatch(match, lex, parentBlock) {
        return new ParenthesisCallExpression(
            this.build(lex.part(match[0]), parentBlock),
            new $statement.Arr([this.build(lex.part(match[1]), parentBlock)])
        );
    }
};
