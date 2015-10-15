import * as $lex from "./compile-lex-0";

export class Pattern {
    static searchOne(token, lexPart, leftToRight) {
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
            else if (lex.at(i) instanceof token && level === 0) {
                return i;
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

    static searchPattern(tokenTypes, lexPart, leftToRight) {
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

            if (level === 0) {
                let result = [];
                let stack = [];
                let matched = true;
                let tokenTypeIndex = 0;
                let inWildcard = false;
                for (let j = i; j <= endIndex; j++) {
                    let token = lex.at(j);
                    let tokenType = tokenTypes[tokenTypeIndex];
                    //console.log(j);

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
                            if (
                                token instanceof $lex.LeftChevron ||
                                token instanceof $lex.LeftParenthesis ||
                                token instanceof $lex.LeftBracket ||
                                token instanceof $lex.LeftBrace
                            ) {
                                result.push(j);
                                inWildcard = true;
                            }
                            else if (
                                token instanceof $lex.RightChevron ||
                                token instanceof $lex.RightParenthesis ||
                                token instanceof $lex.RightBracket ||
                                token instanceof $lex.RightBrace
                            ) {
                                inWildcard = false;
                                tokenTypeIndex++;
                            }
                        }
                        else if (
                            (tokenType === Any || tokenType == Tokens) &&
                            tokenTypeIndex === tokenTypes.length - 1 && !inWildcard
                        ) {
                            break;
                        }
                        else if (tokenType === Any || tokenType == Tokens) {
                            if (
                                !inWildcard && tokenTypeIndex < tokenTypes.length - 1 &&
                                (
                                    tokenTypes[tokenTypeIndex + 1] === ChevronPair ?
                                    token instanceof $lex.LeftChevron :
                                    token instanceof tokenTypes[tokenTypeIndex + 1]
                                )
                            ) { // if the part is zero-length
                                if (tokenType === Any) {
                                    result.push(j);
                                    result.push(j);
                                    tokenTypeIndex++;
                                }
                                else {
                                    matched = false;
                                    break;
                                }
                            }
                            else if (
                                tokenTypeIndex < tokenTypes.length - 1 &&
                                (
                                    tokenTypes[tokenTypeIndex + 1] === ChevronPair ?
                                    lex.at(j + 1) instanceof $lex.LeftChevron :
                                    lex.at(j + 1) instanceof tokenTypes[tokenTypeIndex + 1]
                                )
                            ) {
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
                        else if (token instanceof tokenType) {
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
                }
                if (tokenTypeIndex < tokenTypes.length && !(
                    tokenTypeIndex === tokenTypes.length - 1 &&
                    (tokenTypes[tokenTypeIndex] === Any || tokenTypes[tokenTypeIndex] === Tokens)
                )) {
                    matched = false;
                }
                if (matched) {
                    if (result.length < tokenTypes.length) {
                        result.push(result[result.length - 1] + 1);
                    }
                    return result;
                }
            }

            if ((tokenTypes[0] !== Any && tokenTypes[0] !== Tokens) || leftToRight) {
                break;
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
}

export class Any {} // including zero tokens
export class Tokens {} // at least 1 token
export class ChevronPair {}
export class ParenthesisPair {}
export class BracketPair {}
export class BracePair {}
