import * as $lex from "./c-lex-0.js";

let checkToken = (index, ruler, lexPart) => {
    let token = lexPart.lex.at(index);
    if (token instanceof $lex.Token) {
        return ruler.prototype instanceof $lex.Token ?
            token instanceof ruler : ruler(token, index, lexPart);
    }
    else {
        return false;
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

    // We use non-greedy matching. And even when no match is found, it won't go backtracking to
    // be greedier, but will directly return null.
    // Also, if a tokenType is a function, it currently can't process chevron, parenthesis,
    // bracket, or brace very well. So function ruler is limited in this method.
    // If function ruler is needed, better use `searchOne` method.
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
                            matched = false;
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
                            else if (token instanceof $lex.RightParenthesis) {
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
                            else if (token instanceof $lex.RightParenthesis) {
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
                            else if (token instanceof $lex.RightBracket) {
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
                            else if (token instanceof $lex.RightBracket) {
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
                            else if (token instanceof $lex.RightBrace) {
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
                            else if (token instanceof $lex.RightBrace) {
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

    // `capture` elements must be in ascendant order.
    // A `capture` element can be a number, or an array of 2 numbers meaning "combine
    // all matches from x to y".
    static matchPatternCapture(tokenTypes, lexPart, leftToRight, capture) {
        let match = this.matchPattern(tokenTypes, lexPart, leftToRight);
        if (match === null) {
            return null;
        }
        else {
            return this._capture(match, capture, lexPart);
        }
    }

    static _capture(match, capture, lexPart) {
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

    static matchPatternsAndCaptures(pcs, lexPart, leftToRight) {
        let best = null;
        let extremeValue = null;
        for (let i = 0; i < pcs.length; i++) {
            let pc = pcs[i];

            let match = this.matchPattern(pc[0], lexPart, leftToRight);
            if (match !== null) {
                let c = [];
                for (let j = 0; j < pc[0].length; j++) {
                    c.push(j);
                }
                let all = this._capture(match, c, lexPart);

                let candidate = this._capture(match, pc[1], lexPart);
                if (best === null || (
                    leftToRight ?
                    all[0].endIndex < extremeValue :
                    all[all.length - 1].startIndex > extremeValue
                )) {
                    extremeValue = leftToRight ? all[0].endIndex : all[all.length - 1].startIndex;
                    best = candidate;
                }
            }
        }
        return best;
    }

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

// Including zero tokens. `anyExcept` and `any` are just shorthands.
export class AnyExcept {
    constructor(tokenTypes) {
        this.tokenTypes = tokenTypes;
    }
}
export let anyExcept = function(tokenTypes) {
    return new AnyExcept(tokenTypes);
};
export let any = anyExcept([]);

// At least 1 token. `tokensExcept` and `tokens` are just shorthands.
export class TokensExcept {
    constructor(tokenTypes) {
        this.tokenTypes = tokenTypes;
    }
}
export let tokensExcept = function(tokenTypes) {
    return new TokensExcept(tokenTypes);
};
export let tokens = tokensExcept([]);

export let ChevronPair = $lex.LeftChevron;
export let ParenthesisPair = $lex.LeftParenthesis;
export let BracketPair = $lex.LeftBracket;
export let BracePair = $lex.LeftBrace;

export let NormalParenthesisPair = $lex.NormalLeftParenthesis;
export let NormalBracketPair = $lex.NormalLeftBracket;
export let NormalBracePair = $lex.NormalLeftBrace;

export let CallParenthesisPair = $lex.CallLeftParenthesis;
export let CallBracketPair = $lex.CallLeftBracket;
export let CallBracePair = $lex.CallLeftBrace;
