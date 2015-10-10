import * as $lex from "./compile-lex-0";
import * as $expression from "./compile-expression-0";

export class Statement {
    static build(lex, startIndex, endIndex, parentBlock) {
        let r = null;
        r = AssignStatement.build(lex, startIndex, endIndex, parentBlock);
        if (r === null) {
            r = ExpressionStatement.build(lex, startIndex, endIndex, parentBlock);
        }
        return r;
    }

    static indent(lex, index) {
        for (let i = index; i >= 0; i--) {
            if (lex.at(i) instanceof $lex.Indent) {
                return lex.at(i).value;
            }
        }
    }

    static searchOuter(token, lex, startIndex, endIndex, leftToRight) {
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

    static searchOuterSequence(tokenTypes, lex, startIndex, endIndex, leftToRight) {
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

    static searchOuterPattern(tokenTypes, lex, startIndex, endIndex, leftToRight) {
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

            if (level === 0) {
                let result = [];
                let stack = [];
                let matched = true;
                let tokenTypeIndex = 0;
                let inWildcard = false;
                for (let j = i; j <= endIndex; j++) {
                    let token = lex.at(j);
                    let tokenType = tokenTypes[tokenTypeIndex];
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
                    else if (
                        token instanceof $lex.RightChevron ||
                        token instanceof $lex.RightParenthesis ||
                        token instanceof $lex.RightBracket ||
                        token instanceof $lex.RightBrace
                    ) {
                        stack.pop();
                    }

                    if (tokenType === undefined) {
                        matched = false;
                        break;
                    }
                    else if (tokenType === ChevronPair && stack[0] === ChevronPair) {
                        if (!inWildcard) {
                            result.push(j);
                            inWildcard = true;
                        }
                    }
                    else if (tokenType === ChevronPair && stack.length === 0) {
                        inWildcard = false;
                        tokenTypeIndex++;
                    }
                    else if (
                        tokenType === Any && stack.length === 0 &&
                        tokenTypeIndex === tokenTypes.length - 1 && !inWildcard
                    ) {
                        break;
                    }
                    else if (tokenType === Any && stack.length === 0) {
                        if (
                            tokenTypeIndex === tokenTypes.length - 1 ||
                            !(token instanceof tokenTypes[tokenTypeIndex + 1])
                        ) {
                            if (!inWildcard) {
                                result.push(j);
                                inWildcard = true;
                            }
                        }
                        else {
                            if (!inWildcard) { // if the part is zero-length
                                result.push(j);
                            }
                            result.push(j);
                            inWildcard = false;
                            tokenTypeIndex += 2;
                        }
                    }
                    else if (token instanceof tokenType && stack.length === 0) {
                        result.push(j);
                        tokenTypeIndex++;
                    }
                    else {
                        matched = false;
                        break;
                    }
                }
                if (tokenTypeIndex < tokenTypes.length && !(
                    tokenTypeIndex === tokenTypes.length - 1 &&
                    tokenTypes[tokenTypeIndex] === Any
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

            if (tokenTypes[0] !== Any || leftToRight) {
                break;
            }
        }
        return null;
    }

    print(level = 0) {
        return "    ".repeat(level) + this.constructor.name + " {\n" +
        Object.keys(this).map(key =>
            "    ".repeat(level + 1) + key + ": " +
            this[key].constructor.name + " " + this[key].print(level + 1)
        ) +
        "    ".repeat(level) + "}\n";
    }
};

// Every subclass must have a `expression` property.
export class ExpressionStatement extends Statement {
    constructor(expression) {
        super();
        this.expression = expression;
    }

    static build(lex, startIndex, endIndex, parentBlock) {
        let expression = $expression.Expression.build(lex, startIndex, endIndex, parentBlock);
        if (expression !== null) {
            return new ExpressionStatement(expression);
        }
        else {
            return null;
        }
    }

    print(level = 0) {
        return "    ".repeat(level) + this.expression.print(level).replace(/[^{ ]+/, this.constructor.name);
    }
};

export class AssignStatement extends Statement {
    constructor(assignee, value) {
        super();
        this.assignee = assignee;
        this.value = value;
    }

    static build(lex, startIndex, endIndex, parentBlock) {
        console.log("assign", startIndex, endIndex);
        let colonPos = AssignStatement.searchOuter($lex.Colon, lex, startIndex, endIndex);
        if (colonPos !== null) {
            return new AssignStatement(
                $expression.Expression.build(lex, startIndex, colonPos - 1, parentBlock),
                $expression.Expression.build(lex, colonPos + 1, endIndex, parentBlock)
            );
        }
        else {
            return null;
        }
    }
};

export class CallStatement extends ExpressionStatement {
    constructor(callee, args) {
        super();
        this.expression = new $expression.CallExpression(callee, args);
    }
};

export class IfStatement extends ExpressionStatement {
    constructor(condition, thenBranch, elseBranch) {
        super();
        this.expression = new $expression.IfExpression(condition, thenBranch, elseBranch);
    }
};

export class Any {} // including zero tokens
export class Tokens {} // at least 1 token
export class ChevronPair {}
export class ParenthesisPair {}
export class BracketPair {}
export class BracePair {}
