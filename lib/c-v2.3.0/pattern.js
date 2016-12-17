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
    return (token.oppositeIndex === undefined ? index : token.oppositeIndex) + (leftToRight ? 1 : -1);
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
    static searchOne(ruler, lexPart, leftToRight) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        let level = 0;
        for (
            let i = leftToRight ? startIndex : endIndex;
            leftToRight ? i <= endIndex : i >= startIndex;
            leftToRight ? i++ : i--
        ) {
            if (
                lex.at(i) instanceof $lex.RightParenthesis ||
                lex.at(i) instanceof $lex.RightBracket ||
                lex.at(i) instanceof $lex.RightBrace ||
                lex.at(i) instanceof $lex.RightChevron
            ) {
                level--;
            }
            if (level === 0 && checkToken(i, ruler, lexPart)) {
                return i;
            }
            if (
                lex.at(i) instanceof $lex.LeftParenthesis ||
                lex.at(i) instanceof $lex.LeftBracket ||
                lex.at(i) instanceof $lex.LeftBrace ||
                lex.at(i) instanceof $lex.LeftChevron
            ) {
                level++;
            }
        }
        return null;
    }

    static searchSequence(tokenTypes, lexPart, leftToRight) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        let level = 0;
        for (
            let i = leftToRight ? startIndex : endIndex;
            leftToRight ? i <= endIndex : i >= startIndex;
            leftToRight ? i++ : i--
        ) {
            if (
                lex.at(i) instanceof $lex.LeftParenthesis ||
                lex.at(i) instanceof $lex.LeftBracket ||
                lex.at(i) instanceof $lex.LeftBrace ||
                lex.at(i) instanceof $lex.LeftChevron
            ) {
                level++;
            }
            else if (
                lex.at(i) instanceof $lex.RightParenthesis ||
                lex.at(i) instanceof $lex.RightBracket ||
                lex.at(i) instanceof $lex.RightBrace ||
                lex.at(i) instanceof $lex.RightChevron
            ) {
                level--;
            }
            else if (lex.at(i) instanceof tokenTypes[0] && level === 0) {
                let matched = true;
                for (let j = i + 1; j <= endIndex; j++) {
                    if (j - i > tokenTypes.length - 1) {
                        break;
                    }
                    else if (!(lex.at(j) instanceof tokenTypes[j - i])) {
                        matched = false;
                        break;
                    }
                }
                if (matched) {
                    return i;
                }
            }
        }
        return null;
    }

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
        let lastRuler = null;

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
                nextLexCursor = sameLevelNextIndex(quantifierAfter, lex, leftToRight);
                quantifierAfter = null;
            }
            else if (ruler instanceof Quantifier) {
                if (ruler !== lastRuler) {
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

                let isLastPattern = patternCursor === (leftToRight ? rulers.length - 1 : 0);
                let candidateNextLexCursor = sameLevelNextIndex(lexCursor, lex, leftToRight);
                let hasNoFurtherToken =
                    leftToRight ?
                    candidateNextLexCursor > endIndex :
                    candidateNextLexCursor < startIndex;
                if (isLastPattern && hasNoFurtherToken) {
                    if ($tools.instanceof(token, ruler.tokenTypes)) {
                        return null;
                    }
                    nextLexCursor = candidateNextLexCursor;
                    nextPatternCursor += leftToRight ? 1 : -1;
                }
                else if (quantifierAfter !== null || $tools.instanceof(token, ruler.tokenTypes)) {
                    if (ruler instanceof TokensExcept && quantifierTokenCount === 0) {
                        return null;
                    }
                    quantifierTokenCount = 0;
                    nextPatternCursor += leftToRight ? 1 : -1;
                }
                else {
                    quantifierTokenCount++;
                    nextLexCursor = candidateNextLexCursor;
                }
            }
            else if (checkNonQuantifier(lexCursor, ruler, lexPart, leftToRight)) {
                nextPatternCursor += leftToRight ? 1 : -1;
                nextLexCursor = sameLevelNextIndex(lexCursor, lex, leftToRight);
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
            lastRuler = ruler;
        }

        if (
            leftToRight ?
            nextPatternCursor < rulers.length || nextLexCursor <= endIndex :
            nextPatternCursor >= 0 || nextLexCursor >= startIndex
        ) {
            return null;
        }

        if (!leftToRight) {
            result.shift();
            result.reverse();
            result.forEach((m, index) => {
                result[index]++;
            });
            result.unshift(startIndex);
        }
        return result;
    }

    // We use non-greedy matching. And even when no match is found, it won't go backtracking to
    // be greedier, but will directly return null.
    // Also, if a tokenType is a function, it currently can't process chevron, parenthesis,
    // bracket, or brace very well. So function ruler is limited in this method.
    // If function ruler is needed, better use `searchOne` method.
    /*
    static matchPattern(tokenTypes, lexPart, leftToRight) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;
        let rightToLeftHead = null;
        if (!leftToRight) {
            if (tokenTypes[0] instanceof AnyExcept || tokenTypes[0] instanceof TokensExcept) {
                rightToLeftHead = tokenTypes[0];
                tokenTypes = tokenTypes.slice(1);
            }
            else {
                // Simulate left-to-right, because no need to use the slower right-to-left.
                leftToRight = true;
            }
        }

        // For each token, label its level.
        let levels = [];
        let level = 0;
        for (let i = startIndex; i <= endIndex; i++) {
            if (
                lex.at(i) instanceof $lex.LeftParenthesis ||
                lex.at(i) instanceof $lex.LeftBracket ||
                lex.at(i) instanceof $lex.LeftBrace ||
                lex.at(i) instanceof $lex.LeftChevron
            ) {
                levels.push(level);
                level++;
            }
            else if (
                lex.at(i) instanceof $lex.RightParenthesis ||
                lex.at(i) instanceof $lex.RightBracket ||
                lex.at(i) instanceof $lex.RightBrace ||
                lex.at(i) instanceof $lex.RightChevron
            ) {
                level--;
                levels.push(level);
            }
            else {
                levels.push(level);
            }
        }

        for (
            let i = leftToRight ? startIndex : endIndex;
            leftToRight ? i <= endIndex : i >= startIndex;
            leftToRight ? i++ : i--
        ) {
            let level = levels[i - startIndex];

            if (level === 0 && !(
                lex.at(i) instanceof $lex.RightChevron ||
                lex.at(i) instanceof $lex.RightParenthesis ||
                lex.at(i) instanceof $lex.RightBracket ||
                lex.at(i) instanceof $lex.RightBrace
            )) {
                let result = [];
                let stack = [];
                let matched = true;
                let tokenTypeIndex = 0;
                let inWildcard = false;
                let earlyPassed = false;

                if (rightToLeftHead !== null) {
                    result.push(startIndex);
                }

                let j = i;
                while (j <= endIndex) {
                    let step = 1;
                    let token = lex.at(j);
                    let tokenType = tokenTypes[tokenTypeIndex];

                    if (
                        token instanceof $lex.RightChevron ||
                        token instanceof $lex.RightParenthesis ||
                        token instanceof $lex.RightBracket ||
                        token instanceof $lex.RightBrace
                    ) {
                        stack.pop();
                    }
                    if (stack.length === 0) {
                        if (tokenType === undefined) {
                            if (tokenTypes.length > 0) {
                                matched = false;
                            }
                            break;
                        }
                        else if (tokenType === ChevronPair) {
                            if (token instanceof $lex.LeftChevron) {
                                result.push(j);
                            }
                            else if (token instanceof $lex.RightChevron) {
                                tokenTypeIndex++;
                            }
                            else {
                                matched = false;
                                break;
                            }
                        }
                        else if (tokenType === ParenthesisPair) {
                            if (token instanceof $lex.LeftParenthesis) {
                                result.push(j);
                            }
                            else if (token instanceof $lex.RightParenthesis) {
                                tokenTypeIndex++;
                            }
                            else {
                                matched = false;
                                break;
                            }
                        }
                        else if (tokenType === NormalParenthesisPair) {
                            if (token instanceof $lex.NormalLeftParenthesis) {
                                result.push(j);
                            }
                            else if (token instanceof $lex.NormalRightParenthesis) {
                                tokenTypeIndex++;
                            }
                            else {
                                matched = false;
                                break;
                            }
                        }
                        else if (tokenType === CallParenthesisPair) {
                            if (token instanceof $lex.CallLeftParenthesis) {
                                result.push(j);
                            }
                            else if (token instanceof $lex.CallRightParenthesis) {
                                tokenTypeIndex++;
                            }
                            else {
                                matched = false;
                                break;
                            }
                        }
                        else if (tokenType === PseudoCallParenthesisPair) {
                            if (token instanceof $lex.PseudoCallLeftParenthesis) {
                                result.push(j);
                            }
                            else if (token instanceof $lex.PseudoCallRightParenthesis) {
                                tokenTypeIndex++;
                            }
                            else {
                                matched = false;
                                break;
                            }
                        }
                        else if (tokenType === BracketPair) {
                            if (token instanceof $lex.LeftBracket) {
                                result.push(j);
                            }
                            else if (token instanceof $lex.RightBracket) {
                                tokenTypeIndex++;
                            }
                            else {
                                matched = false;
                                break;
                            }
                        }
                        else if (tokenType === NormalBracketPair) {
                            if (token instanceof $lex.NormalLeftBracket) {
                                result.push(j);
                            }
                            else if (token instanceof $lex.NormalRightBracket) {
                                tokenTypeIndex++;
                            }
                            else {
                                matched = false;
                                break;
                            }
                        }
                        else if (tokenType === CallBracketPair) {
                            if (token instanceof $lex.CallLeftBracket) {
                                result.push(j);
                            }
                            else if (token instanceof $lex.CallRightBracket) {
                                tokenTypeIndex++;
                            }
                            else {
                                matched = false;
                                break;
                            }
                        }
                        else if (tokenType === BracePair) {
                            if (token instanceof $lex.LeftBrace) {
                                result.push(j);
                            }
                            else if (token instanceof $lex.RightBrace) {
                                tokenTypeIndex++;
                            }
                            else {
                                matched = false;
                                break;
                            }
                        }
                        else if (tokenType === NormalBracePair) {
                            if (token instanceof $lex.NormalLeftBrace) {
                                result.push(j);
                            }
                            else if (token instanceof $lex.NormalRightBrace) {
                                tokenTypeIndex++;
                            }
                            else {
                                matched = false;
                                break;
                            }
                        }
                        else if (tokenType === CallBracePair) {
                            if (token instanceof $lex.CallLeftBrace) {
                                result.push(j);
                            }
                            else if (token instanceof $lex.CallRightBrace) {
                                tokenTypeIndex++;
                            }
                            else {
                                matched = false;
                                break;
                            }
                        }
                        else if (tokenType instanceof AnyExcept || tokenType instanceof TokensExcept) {
                            let exceptions = tokenType.tokenTypes;
                            let checkJumpOut = k => (
                                exceptions.length === 0 ?
                                (
                                    tokenTypeIndex < tokenTypes.length - 1 &&
                                    checkToken(k, tokenTypes[tokenTypeIndex + 1], lexPart)
                                ) :
                                (
                                    tokenTypeIndex < tokenTypes.length - 1 &&
                                    checkToken(k, tokenTypes[tokenTypeIndex + 1], lexPart)
                                ) ||
                                exceptions.some(m => lex.at(k) instanceof m)
                            );
                            if (exceptions.length === 0 && tokenTypeIndex === tokenTypes.length - 1) {
                                result.push(j);
                                earlyPassed = true;
                                break; // no need to do further check
                            }
                            else if (!inWildcard && checkJumpOut(j)) { // if the part is zero-length
                                if (tokenType instanceof AnyExcept) {
                                    result.push(j);
                                    tokenTypeIndex++;
                                    step = 0;
                                }
                                else {
                                    matched = false;
                                    break;
                                }
                            }
                            else if (checkJumpOut(j + 1)) {
                                if (!inWildcard) {
                                    result.push(j);
                                }
                                inWildcard = false;
                                tokenTypeIndex++;
                            }
                            else {
                                if (!inWildcard) {
                                    result.push(j);
                                    inWildcard = true;
                                }
                            }
                        }
                        else if (checkToken(j, tokenType, lexPart)) {
                            result.push(j);
                            tokenTypeIndex++;
                        }
                        else {
                            matched = false;
                            break;
                        }
                    }
                    if (token instanceof $lex.LeftChevron) {
                        stack.push(ChevronPair);
                    }
                    else if (token instanceof $lex.LeftParenthesis) {
                        stack.push(ParenthesisPair);
                    }
                    else if (token instanceof $lex.LeftBracket) {
                        stack.push(BracketPair);
                    }
                    else if (token instanceof $lex.LeftBrace) {
                        stack.push(BracePair);
                    }

                    j += step;
                }
                if (rightToLeftHead !== null) { // check exceptions in rightToLeftHead
                    let last = result[1] === undefined ? endIndex : result[1] - 1;
                    if (rightToLeftHead instanceof TokensExcept && result[0] > last) {
                        matched = false;
                    }
                    else {
                        for (let k = result[0]; k <= last; k++) {
                            let exceptions = rightToLeftHead.tokenTypes;
                            if (exceptions.some(m => lex.at(k) instanceof m)) {
                                matched = false;
                                break;
                            }
                        }
                    }
                }
                if (matched) {
                    let tailCount = inWildcard ? 1 : 0;
                    if (tokenTypeIndex + tailCount < tokenTypes.length && !earlyPassed) {
                        if (
                            tokenTypeIndex === tokenTypes.length - 1 &&
                            tokenTypes[tokenTypeIndex] instanceof AnyExcept
                        ) {
                            result.push(j);
                        }
                        else {
                            matched = false;
                        }
                    }
                }
                if (matched) {
                    return result;
                }
            }

            if (leftToRight || rightToLeftHead === null) {
                break;
            }
        }
        return null;
    }
    */

    // `capture` elements must be in ascendant order.
    // A `capture` element can be a number, or an array of 2 numbers meaning "combine
    // all matches from x to y".
    static matchPatternCapture(tokenTypes, lexPart, leftToRight, capture) {
        let match = this.matchPattern(tokenTypes, lexPart, leftToRight);
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

    // `token` can be a token type or an array of token types.
    // If lex doesn't contain the token, the returned range will be the whole lex.
    // If the first or last token is the splitter, or if one splitter is immediately after another,
    // then the corresponding range will be -1 (endIndex = startIndex - 1).
    // If the input range is negative (endIndex < startIndex), then the output range will be
    // the same.
    static split(token, lexPart) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        let level = 0;
        let oldPos = startIndex;
        let r = [];
        let match = (lexToken) => {
            if (Array.isArray(token)) {
                return token.some(m => lexToken instanceof m);
            }
            else {
                return lexToken instanceof token;
            }
        };
        for (let i = startIndex; i <= endIndex; i++) {
            if (
                lex.at(i) instanceof $lex.LeftParenthesis ||
                lex.at(i) instanceof $lex.LeftBracket ||
                lex.at(i) instanceof $lex.LeftBrace ||
                lex.at(i) instanceof $lex.LeftChevron
            ) {
                level++;
            }
            else if (
                lex.at(i) instanceof $lex.RightParenthesis ||
                lex.at(i) instanceof $lex.RightBracket ||
                lex.at(i) instanceof $lex.RightBrace ||
                lex.at(i) instanceof $lex.RightChevron
            ) {
                level--;
            }
            else if (match(lex.at(i)) && level === 0) {
                r.push({startIndex: oldPos, endIndex: i - 1});
                oldPos = i + 1;
            }
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
