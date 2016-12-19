import * as $lex from "./lex.js";
import * as $tools from "./tools.js";

// `ruler` can be a token type, an array of token types, or a validating function.
// Array means to return true if any element in the array matches.
let checkToken = (index, ruler, lexPart) => {
    let token = lexPart.lex.at(index);
    if (token instanceof $lex.Token) {
        if (Array.isArray(ruler)) {
            return $tools.instanceof(token, ruler);
        }
        else if ($tools.classIsClass(ruler, $lex.Token)) {
            return token instanceof ruler;
        }
        else {
            return ruler(token, index, lexPart);
        }
    }
    else {
        return false;
    }
};

let sameLevelNextIndex = (index, lex, leftToRight) => {
    let token = lex.at(index);
    if (token instanceof $lex.Enclosing && token.constructor.leftFlag === (leftToRight ? true : undefined)) {
        return token.oppositeIndex;
    }
    else {
        return index + (leftToRight ? 1 : -1);
    }
};

let sameLevelNextIndexForPattern = (index, lex, leftToRight) => {
    let token = lex.at(index);
    if (token instanceof $lex.Enclosing && token.constructor.leftFlag === (leftToRight ? true : undefined)) {
        return token.oppositeIndex + (leftToRight ? 1 : -1);
    }
    else {
        return index + (leftToRight ? 1 : -1);
    }
};

let checkNonQuantifier = (index, ruler, lexPart, leftToRight) => {
    let lex = lexPart.lex;
    let token = lex.at(index);
    if ($tools.classIsClass(ruler, Pair)) { // for jumping quickly if it isn't pair
        let matched = null;
        if (ruler === ChevronPair) {
            matched = token instanceof (leftToRight ? $lex.LeftChevron : $lex.RightChevron);
        }
        else if (ruler === ParenthesisPair) {
            matched = token instanceof (leftToRight ? $lex.LeftParenthesis : $lex.RightParenthesis);
        }
        else if (ruler === NormalParenthesisPair) {
            matched = token instanceof (
                leftToRight ? $lex.NormalLeftParenthesis : $lex.NormalRightParenthesis
            );
        }
        else if (ruler === CallParenthesisPair) {
            matched = token instanceof (leftToRight ? $lex.CallLeftParenthesis : $lex.CallRightParenthesis);
        }
        else if (ruler === PseudoCallParenthesisPair) {
            matched = token instanceof (
                leftToRight ? $lex.PseudoCallLeftParenthesis : $lex.PseudoCallRightParenthesis
            );
        }
        else if (ruler === BracketPair) {
            matched = token instanceof (leftToRight ? $lex.LeftBracket : $lex.RightBracket);
        }
        else if (ruler === NormalBracketPair) {
            matched = token instanceof (leftToRight ? $lex.NormalLeftBracket : $lex.NormalRightBracket);
        }
        else if (ruler === CallBracketPair) {
            matched = token instanceof (leftToRight ? $lex.CallLeftBracket : $lex.CallRightBracket);
        }
        else if (ruler === BracePair) {
            matched = token instanceof (leftToRight ? $lex.LeftBrace : $lex.RightBrace);
        }
        else if (ruler === NormalBracePair) {
            matched = token instanceof (leftToRight ? $lex.NormalLeftBrace : $lex.NormalRightBrace);
        }
        else if (ruler === CallBracePair) {
            matched = token instanceof (leftToRight ? $lex.CallLeftBrace : $lex.CallRightBrace);
        }
        else {
            throw new Error();
        }
        return matched && (
            leftToRight ?
            token.oppositeIndex <= lexPart.endIndex :
            token.oppositeIndex >= lexPart.startIndex
        );
    }
    else {
        return checkToken(index, ruler, lexPart);
    }
};

export class Pattern {
    // `ruler` can't be a pair or quantifier. Note: For performance, it won't check that.
    static searchOne(ruler, lexPart, leftToRight) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;
        let i = leftToRight ? startIndex : endIndex;
        while (leftToRight ? i <= endIndex : i >= startIndex) {
            if (checkToken(i, ruler, lexPart)) {
                return i;
            }
            i = sameLevelNextIndex(i, lex, leftToRight);
        }
        return null;
    }

    /*
    We use non-greedy matching. And even when no match is found, it won't go backtracking to
    be greedier, but will directly return null.

    `lexPart` can be empty (`endIndex` smaller than `startIndex` by 1). `rulers` can also be empty.
    If both `lexPart` and `rulers` are empty then it will return an empty array, not `null`.

    Quantifiers can't be consecutive. Note: For performance, it won't check that.

    A ruler won't match the ending token of a "pair" or tokens in it. For example:

    lexPart: [LeftChevron, NormalToken "a", RightChevron], leftToRight: true

    If `rulers` is [LeftChevron], then the pattern will be matched.
    If `rulers` is [LeftChevron, NormalToken, RightChevron], then the pattern won't be matched.
    If `rulers` is [LeftChevron, RightChevron], then the pattern won't be matched.

    So, if `leftToRight` is true then the token representing the right side of the pair will be
    jumped. If false then the left will be jumped.

    But it's not a good practice to use `LeftChevron` or `RightChevron` for a ruler. Better use
    `ChevronPair`. `LeftChevron` or `RightChevron` is only useful inside a function ruler.
    */
    static matchPattern(rulers, lexPart, leftToRight) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;
        let nextLexCursor = leftToRight ? startIndex : endIndex;
        let nextPatternCursor = leftToRight ? 0 : rulers.length - 1;
        let result = [];
        let quantifierAfter = null;
        let quantifierTokenCount = 0;
        let quantifierStartTokenIndex = null;
        let k = 0;
        let previousRuler = null;

        while (
            leftToRight ?
            nextLexCursor <= endIndex && nextPatternCursor < rulers.length :
            nextLexCursor >= startIndex && nextPatternCursor >= 0
        ) {
            let lexCursor = nextLexCursor;
            let patternCursor = nextPatternCursor;
            let token = lex.at(lexCursor);
            let ruler = rulers[patternCursor];

            if (quantifierAfter !== null) {
                nextPatternCursor += leftToRight ? 1 : -1;
                nextLexCursor = sameLevelNextIndexForPattern(quantifierAfter, lex, leftToRight);
                quantifierAfter = null;
            }
            else if (ruler instanceof AnyExcept || ruler instanceof TokensExcept) {
                if (ruler !== previousRuler) {
                    quantifierStartTokenIndex = lexCursor;
                }

                if (
                    leftToRight ?
                    (
                        patternCursor + 1 <= rulers.length - 1 &&
                        checkNonQuantifier(lexCursor, rulers[patternCursor + 1], lexPart, leftToRight)
                    ) :
                    (
                        patternCursor - 1 >= 0 &&
                        checkNonQuantifier(lexCursor, rulers[patternCursor - 1], lexPart, leftToRight)
                    )
                ) {
                    quantifierAfter = lexCursor;
                }

                let isLastRuler = patternCursor === (leftToRight ? rulers.length - 1 : 0);
                let candidateNextLexCursor = sameLevelNextIndexForPattern(lexCursor, lex, leftToRight);
                let hasNoFurtherToken =
                    leftToRight ?
                    candidateNextLexCursor > endIndex :
                    candidateNextLexCursor < startIndex;
                let exceptionFound = $tools.instanceof(token, ruler.tokenTypes);
                if (isLastRuler && hasNoFurtherToken) {
                    if (exceptionFound) {
                        return null;
                    }
                    nextLexCursor = candidateNextLexCursor;
                    nextPatternCursor += leftToRight ? 1 : -1;
                }
                else if (quantifierAfter !== null || exceptionFound) {
                    if (ruler instanceof TokensExcept && quantifierTokenCount === 0) {
                        if (quantifierAfter !== null && !exceptionFound) {
                            quantifierTokenCount++;
                            nextLexCursor = candidateNextLexCursor;
                        }
                        else {
                            return null;
                        }
                    }
                    else {
                        quantifierTokenCount = 0;
                        nextPatternCursor += leftToRight ? 1 : -1;
                    }
                }
                else {
                    quantifierTokenCount++;
                    nextLexCursor = candidateNextLexCursor;
                }
            }
            else if (checkNonQuantifier(lexCursor, ruler, lexPart, leftToRight)) {
                nextPatternCursor += leftToRight ? 1 : -1;
                nextLexCursor = sameLevelNextIndexForPattern(lexCursor, lex, leftToRight);
            }
            else {
                return null;
            }

            if (
                k === 0 || (
                    patternCursor !== nextPatternCursor &&
                    patternCursor !== (leftToRight ? 0 : rulers.length - 1)
                )
            ) {
                result.push(ruler instanceof Quantifier ? quantifierStartTokenIndex : lexCursor);
            }

            k++;
            previousRuler = ruler;
        }

        if (
            (
                leftToRight ? nextPatternCursor === rulers.length - 1 : nextPatternCursor === 0
            ) && rulers[nextPatternCursor] instanceof AnyExcept
        ) {
            result.push(leftToRight ? endIndex + 1 : startIndex - 1);
        }
        else if (
            leftToRight ?
            nextPatternCursor < rulers.length || nextLexCursor <= endIndex :
            nextPatternCursor >= 0 || nextLexCursor >= startIndex
        ) {
            return null;
        }

        if (!leftToRight && result.length > 0) {
            result.shift();
            result.reverse();
            result.forEach((m, index) => {
                result[index]++;
            });
            result.unshift(startIndex);
        }
        return result;
    }

    // `capture` elements must be in ascendant order.
    // A `capture` element can be a number, or an array of 2 numbers meaning "combine
    // all matches from x to y".
    static matchPatternCapture(rulers, lexPart, leftToRight, capture) {
        let match = this.matchPattern(rulers, lexPart, leftToRight);
        if (match === null) {
            return null;
        }
        else {
            return this.captureAfterMatch(match, capture, lexPart);
        }
    }

    // If `capture` is undefined, then it will capture all.
    static captureAfterMatch(match, capture, lexPart) {
        if (capture === undefined) {
            capture = [];
            for (let i = 0; i < match.length; i++) {
                capture.push(i);
            }
        }
        return capture.map(x => {
            if (x === null) {
                return null;
            }
            else if (Array.isArray(x)) {
                return {
                    startIndex: match[x[0]],
                    endIndex: x[1] === match.length - 1 ? lexPart.endIndex : match[x[1] + 1] - 1
                };
            }
            else {
                return {
                    startIndex: match[x],
                    endIndex: x === match.length - 1 ? lexPart.endIndex : match[x + 1] - 1
                };
            }
        });
    }

    // `wraps` is optional, defaulting to false. If true, it also returns the "capture all"
    // array (these 2 arrays will be wrapped in an object).
    static matchPatternsAndCaptures(pcs, lexPart, leftToRight, wraps = false) {
        let best = null;
        let extremeValue = null;
        for (let i = 0; i < pcs.length; i++) {
            let pc = pcs[i];
            let match = this.matchPattern(pc[0], lexPart, leftToRight);
            if (match !== null) {
                let checker = this.captureAfterMatch(match, undefined, lexPart);
                let candidate = this.captureAfterMatch(match, pc[1], lexPart);
                let value =
                    leftToRight ?
                    checker[0].endIndex :
                    checker[checker.length - 1].startIndex;
                if (extremeValue === null || (
                    leftToRight ? value < extremeValue : value > extremeValue
                )) {
                    extremeValue = value;
                    best = wraps ? {selected: candidate, all: checker} : candidate;
                }
            }
        }
        return best;
    }

    // `ruler` can't be a pair or quantifier. Note: For performance, it won't check that.
    // If lex part doesn't contain the splitter, the returned range will be the whole lex part.
    // If the first or last token is the splitter, or if one splitter is immediately after another,
    // then the corresponding range will be -1 (endIndex = startIndex - 1).
    // If the input range is negative (endIndex < startIndex), then the output range will be
    // the same.
    static split(ruler, lexPart) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;
        let oldPos = startIndex;
        let r = [];
        let i = startIndex;
        while (i <= endIndex) {
            if (checkToken(i, ruler, lexPart)) {
                r.push({startIndex: oldPos, endIndex: i - 1});
                oldPos = i + 1;
            }
            i = sameLevelNextIndex(i, lex, true);
        }
        r.push({startIndex: oldPos, endIndex: endIndex});
        return r;
    }
}

class Quantifier {}

// Including zero tokens. `anyExcept` and `any` are just shorthands.
export class AnyExcept extends Quantifier {
    constructor(tokenTypes) {
        super();
        this.tokenTypes = tokenTypes;
    }
}
export let anyExcept = function(tokenTypes) {
    return new AnyExcept(tokenTypes);
};
export let any = anyExcept([]);

// At least 1 token. `tokensExcept` and `tokens` are just shorthands.
export class TokensExcept extends Quantifier {
    constructor(tokenTypes) {
        super();
        this.tokenTypes = tokenTypes;
    }
}
export let tokensExcept = function(tokenTypes) {
    return new TokensExcept(tokenTypes);
};
export let tokens = tokensExcept([]);

class Pair {}

export class ChevronPair extends Pair {}
export class ParenthesisPair extends Pair {}
export class BracketPair extends Pair {}
export class BracePair extends Pair {}

export class NormalParenthesisPair extends ParenthesisPair {}
export class NormalBracketPair extends BracketPair {}
export class NormalBracePair extends BracePair {}

export class CallParenthesisPair extends ParenthesisPair {}
export class CallBracketPair extends BracketPair {}
export class CallBracePair extends BracePair {}

export class PseudoCallParenthesisPair extends ParenthesisPair {}
