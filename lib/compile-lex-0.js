//import {Block} from "./compile-block-0";
//import {Expression} from "./compile-expression-0";
//import {Statement} from "./compile-statement-0";

export class Lex {
    constructor(raw) {
        this._round1(raw);
        this._round2();
        this._round3();
        this._round4();
        this._round5();
        this._round6();
        this._round7();
        this._round8();
        this._round9();
    }

    _round1(raw) {
        let result = [];

        let pendingToken = null;

        let i = 0;
        while (i < raw.length) {
            let char = raw[i];

            // single character as ending point
            if (pendingToken instanceof VersionDirective) {
                if (char !== "\r" && char !== "\n") {
                    pendingToken.value += char;
                }
                else {
                    result.push(pendingToken);
                    pendingToken = null;
                }
            }
            else if (pendingToken instanceof Indent) {
                if (char === " " || char === "\t") {
                    pendingToken.value++;
                }
                else {
                    result.push(pendingToken);
                    pendingToken = null;
                }
            }
            else if (pendingToken instanceof Num) {
                if (char.search(/[0-9.]/) !== -1) {
                    pendingToken.value += char;
                }
                else {
                    result.push(pendingToken);
                    pendingToken = null;
                }
            }
            else if (pendingToken instanceof Str) {
                if (char !== "\"") {
                    pendingToken.value += char;
                }
                else {
                    result.push(pendingToken);
                    pendingToken = null;
                }
            }
            else if (pendingToken instanceof NormalComment) {
                if (char !== "\r" && char !== "\n") {
                    pendingToken.value += char;
                }
                else {
                    result.push(pendingToken);
                    pendingToken = null;
                }
            }
            else if (pendingToken instanceof NormalToken) {
                if (char.search(/[A-Za-z0-9_$]/) !== -1) {
                    pendingToken.value += char;
                }
                else {
                    result.push(pendingToken);
                    pendingToken = null;
                }
            }

            if (pendingToken === null) {
                if (i === 0) {
                    pendingToken = new VersionDirective(char);
                    i++;
                }

                // double character
                else if (char === "-" && raw[i + 1] === "-") {
                    result.push(new DashFunction());
                    i += 2;
                }
                else if (char === "-" && raw[i + 1] === ">") {
                    result.push(new ArrowFunction());
                    i += 2;
                }
                else if (char === "<" && raw[i + 1] === ">") {
                    result.push(new DiamondFunction());
                    i += 2;
                }
                else if (char === "/" && raw[i + 1] === "=") {
                    result.push(new NotEqual());
                    i += 2;
                }
                else if (char === "<" && raw[i + 1] === "=") {
                    result.push(new LessThanOrEqual());
                    i += 2;
                }
                else if (char === ">" && raw[i + 1] === "=") {
                    result.push(new GreaterThanOrEqual());
                    i += 2;
                }

                // single character as starting point
                else if (char === "\n") {
                    pendingToken = new Indent(0);
                    i++;
                }
                else if (char.search(/[0-9]/) !== -1) {
                    pendingToken = new Num(char);
                    i++;
                }
                else if (result[result.length - 1] instanceof NormalStringStart) {
                    pendingToken = new Str(char);
                    i++;
                }
                else if (char === "#") {
                    pendingToken = new NormalComment("");
                    i++;
                }
                else if (char.search(/[A-Za-z_$]/) !== -1) {
                    pendingToken = new NormalToken(char);
                    i++;
                }

                // single character
                else if (char === ":" && raw[i + 1] !== ":") {
                    result.push(new Colon());
                    i++;
                }
                else if (char === ",") {
                    result.push(new Comma());
                    i++;
                }
                else if (char === ".") {
                    result.push(new Dot());
                    i++;
                }
                else if (char === "(") {
                    if (raw[i - 1].search(/[")\]}A-Za-z0-9_$]/) !== -1) {
                        result.push(new CallLeftParenthesis());
                    }
                    else {
                        result.push(new NormalLeftParenthesis());
                    }
                    i++;
                }
                else if (char === ")") {
                    result.push(new RightParenthesis());
                    i++;
                }
                else if (char === "[") {
                    result.push(new LeftBracket());
                    i++;
                }
                else if (char === "]") {
                    result.push(new RightBracket());
                    i++;
                }
                else if (char === "{") {
                    result.push(new LeftBrace());
                    i++;
                }
                else if (char === "}") {
                    result.push(new RightBrace());
                    i++;
                }
                else if (char === "=") {
                    result.push(new Equal());
                    i++;
                }
                else if (char === "<") {
                    result.push(new LessThan());
                    i++;
                }
                else if (char === ">") {
                    result.push(new GreaterThan());
                    i++;
                }
                else if (char === "+") {
                    if ((raw[i - 1] === " " || (
                        !(result[result.length - 1] instanceof Indent) &&
                        !(isExpressionEnd(result[result.length - 1]))
                    )) && raw[i + 1] !== " " && raw[i + 1] !== "\t" &&
                    raw[i + 1] !== "\r" && raw[i + 1] !== "\n") {
                        result.push(new Positive());
                    }
                    else {
                        result.push(new Plus());
                    }
                    i++;
                }
                else if (char === "-") {
                    if ((raw[i - 1] === " " || (
                        !(result[result.length - 1] instanceof Indent) &&
                        !(isExpressionEnd(result[result.length - 1]))
                    )) && raw[i + 1] !== " " && raw[i + 1] !== "\t" &&
                    raw[i + 1] !== "\r" && raw[i + 1] !== "\n") {
                        result.push(new Negative());
                    }
                    else {
                        result.push(new Minus());
                    }
                    i++;
                }
                else if (char === "*") {
                    result.push(new Times());
                    i++;
                }
                else if (char === "/") {
                    result.push(new Over());
                    i++;
                }
                else if (
                    raw[i - 1].search(/[A-Za-z0-9]/) === -1 &&
                    !(raw[i - 2] === "\"" && raw[i - 1] === "\"") && char === "\"" &&
                    !(result[result.length - 1] instanceof Str)
                ) {
                    result.push(new NormalStringStart());
                    i++;
                }
                else if (char === "\"" && result[result.length - 1] instanceof Str) {
                    result.push(new NormalStringEnd());
                    i++;
                }
                else if (char === "?") {
                    result.push(new Then());
                    i++;
                }
                else if (char === "|") {
                    result.push(new Else());
                    i++;
                }
                else if (char === "@") {
                    result.push(new Arg());
                    if (raw[i + 1].search(/[A-Za-z_$]/) !== -1) {
                        result.push(new Dot());
                    }
                    i++;
                }
                else if (char === "'") {
                    if (raw[i + 1].search(/[A-Za-z0-9]/) !== -1) {
                        result.push(new NormalVariant());
                    }
                    else {
                        result.push(new FunctionVariant());
                    }
                    i++;
                }

                else {
                    i++;
                }
            }
            else {
                i++;
            }
        }
        this.value = result;
    }

    _round2() {
        let indent = null;
        this.value.forEach(token => {
            if (token instanceof Indent) {
                indent = token.value;
            }
            token.indent = indent;
        });
    }

    _round3() {
        let newValue = [];
        this.value.forEach((token, index) => {
            if (token instanceof NormalToken) {
                let t = null;
                switch (token.value) {
                    case "class":
                        t = Class; break;
                    case "else":
                        t = Else; break;
                    case "false":
                        t = False; break;
                    case "if":
                        t = If; break;
                    case "match":
                        t = Match; break;
                    case "null":
                        t = Null; break;
                    case "then":
                        t = Then; break;
                    case "throw":
                        t = Throw; break;
                    case "true":
                        t = True; break;
                    case "void":
                        t = Void; break;
                }
                if (
                    t !== null &&
                    !(this.value[index - 1] instanceof Dot) &&
                    !(this.value[index + 1] instanceof Colon)
                ) {
                    newValue.push(new t());
                }
                else {
                    newValue.push(token);
                }
            }
            else {
                newValue.push(token);
            }
        });
        this.value = newValue;
    }

    _round4() {
        let newValue = [];
        this.value.forEach((token, index) => {
            if (token instanceof NormalComment) {
            }
            else if (token instanceof VersionDirective) {
            }
            else {
                newValue.push(token);
            }
        });
        this.value = newValue;
    }

    _round5() {
        let newValue = [];
        this.value.forEach((token, index) => {
            if (token instanceof Indent && (
                index === this.value.length - 1 || this.value[index + 1] instanceof Indent
            )) {
            }
            else {
                newValue.push(token);
            }
        });
        this.value = newValue;
    }

    // Each indent uses only 1 whitespace.
    _round6() {
        let newValue = [];
        let stack = [];
        this.value.forEach(token => {
            if (token instanceof Indent) {
                if (stack.length === 0 || token.value > stack[stack.length - 1]) {
                    let newIndentValue = stack.length;
                    stack.push(token.value);
                    newValue.push(new Indent(newIndentValue));
                }
                else if (token.value === stack[stack.length - 1]) {
                    newValue.push(new Indent(stack.length - 1));
                }
                else {
                    let found = stack.indexOf(token.value);
                    if (found !== -1) {
                        newValue.push(new Indent(found));
                        stack.splice(found + 1, stack.length - found - 1);
                    }
                    else {
                        throw new Error();
                    }
                }
            }
            else {
                newValue.push(token);
            }
        });
        this.value = newValue;
    }

    // Normalize indents to all use inline "<<" and ">>" and ";".
    _round7() {
        let newValue = [];
        let oldIndentValue = 0;
        this.value.forEach((token, index) => {
            if (token instanceof Indent) {
                if (token.value > oldIndentValue) {
                    newValue.push(new LeftChevron());
                    oldIndentValue = token.value;
                }
                else if (token.value < oldIndentValue) {
                    for (let i = 0; i < oldIndentValue - token.value; i++) {
                        newValue.push(new RightChevron());
                    }
                    if (!(
                        this.value[index + 1] instanceof RightParenthesis ||
                        this.value[index + 1] instanceof RightBracket ||
                        this.value[index + 1] instanceof RightBrace
                    )) {
                        newValue.push(new Semicolon());
                    }
                    oldIndentValue = token.value;
                }
                else if (newValue.length !== 0) {
                    newValue.push(new Semicolon());
                }
            }
            else {
                newValue.push(token);
            }
        });
        for (let i = 0; i < oldIndentValue; i++) {
            newValue.push(new RightChevron());
        }
        this.value = newValue;
    }

    // Remove redundant ";".
    _round8() {
        let newValue = [];
        this.value.forEach((token, index) => {
            if (token instanceof Semicolon) {
                if (this.value[index - 1] instanceof Semicolon) {
                }
                else {
                    newValue.push(token);
                }
            }
            else {
                newValue.push(token);
            }
        });
        this.value = newValue;
    }

    /* Remove useless or incorrect indents and semicolons to combine multiple lines. Example:

    a:
     if true
      1
     else
      2

    Or:

    a:
    if true
     1
    else
     2

    Both normalized to:

    a: if true
     1
    else
     2

    Objects and arrays like:

    {
        a: 2
        b: 3
    }

    Normalized to:

    {a: 2, b: 3}
    */
    _round9() {
        let newValue = [];
        let stack = [];
        this.value.forEach((token, index) => {
            if (token instanceof LeftChevron) {
                if (
                    this.value[index - 1] instanceof Colon ||
                    this.value[index - 1] instanceof NormalLeftParenthesis ||
                    this.value[index - 1] instanceof CallLeftParenthesis ||
                    this.value[index - 1] instanceof LeftBracket ||
                    this.value[index - 1] instanceof LeftBrace ||
                    this.value[index - 1] instanceof Dot ||
                    this.value[index - 1] instanceof Plus ||
                    this.value[index - 1] instanceof Minus ||
                    this.value[index - 1] instanceof Times ||
                    this.value[index - 1] instanceof Over ||
                    this.value[index + 1] instanceof Dot ||
                    this.value[index + 1] instanceof Plus ||
                    this.value[index + 1] instanceof Minus ||
                    this.value[index + 1] instanceof Times ||
                    this.value[index + 1] instanceof Over
                ) {
                    stack.push(true);
                }
                else {
                    stack.push(false);
                    newValue.push(token);
                }
            }
            else if (token instanceof RightChevron) {
                if (stack.pop()) {
                }
                else {
                    newValue.push(token);
                }
            }
            else if (token instanceof Semicolon) {
                if (
                    this.value[index - 1] instanceof Colon ||
                    this.value[index - 1] instanceof Dot ||
                    this.value[index - 1] instanceof Plus ||
                    this.value[index - 1] instanceof Minus ||
                    this.value[index - 1] instanceof Times ||
                    this.value[index - 1] instanceof Over ||
                    this.value[index + 1] instanceof Dot ||
                    this.value[index + 1] instanceof Plus ||
                    this.value[index + 1] instanceof Minus ||
                    this.value[index + 1] instanceof Times ||
                    this.value[index + 1] instanceof Over
                ) {
                }
                else {
                    newValue.push(token);
                }
            }
            else {
                newValue.push(token);
            }
        });
        this.value = newValue;
    }

    at(index) {
        return this.value[index];
    }

    count() {
        return this.value.length;
    }

    search(tokenType, startIndex, leftToRight, endIndex) {
        if (leftToRight) {
            for (let i = startIndex; i <= endIndex; i++) {
                if (this.value[i] instanceof tokenType) {
                    return i;
                }
            }
        }
        else {
            for (let i = endIndex; i >= startIndex; i--) {
                if (this.value[i] instanceof tokenType) {
                    return i;
                }
            }
        }
        return null;
    }

    toString() {
        return this.value.map(token => {
            let part1 = token.constructor.name;
            let part2 = "";
            if (token.value !== undefined) {
                part2 = " " + JSON.stringify(token.value);
            }
            return part1 + part2;
        }).join(", ");
    }
}

export class Token {
    constructor(value) {
        if (value !== undefined) {
            this.value = value;
        }
    }
}

export class NormalToken extends Token {}
export class VersionDirective extends Token {}
export class Indent extends Token {}
export class BlockStart extends Token {}
export class BlockEnd extends Token {}
export class ClassStart extends Token {}
export class ClassEnd extends Token {}
export class Semicolon extends Token {}
export class LeftChevron extends Token {}
export class RightChevron extends Token {}
export class NormalLeftParenthesis extends Token {}
export class CallLeftParenthesis extends Token {}
export class RightParenthesis extends Token {}
export class LeftBracket extends Token {}
export class RightBracket extends Token {}
export class LeftBrace extends Token {}
export class RightBrace extends Token {}
export class Comma extends Token {}
export class Dot extends Token {}
export class Colon extends Token {}
export class Equal extends Token {}
export class NotEqual extends Token {}
export class LessThan extends Token {}
export class GreaterThan extends Token {}
export class LessThanOrEqual extends Token {}
export class GreaterThanOrEqual extends Token {}
export class Plus extends Token {}
export class Minus extends Token {}
export class Times extends Token {}
export class Over extends Token {}
export class Positive extends Token {}
export class Negative extends Token {}
export class Num extends Token {}
export class Str extends Token {}
export class NormalStringStart extends Token {}
export class NormalStringEnd extends Token {}
export class NormalComment extends Token {}
export class DashFunction extends Token {}
export class ArrowFunction extends Token {}
export class DiamondFunction extends Token {}
export class Arg extends Token {} Arg.isExpression = true;
export class NormalVariant extends Token {}
export class FunctionVariant extends Token {}

export class As extends Token {}
export class Class extends Token {}
export class Delete extends Token {}
export class Else extends Token {}
export class Export extends Token {}
export class False extends Token {} False.isExpression = true;
export class If extends Token {}
export class Match extends Token {}
export class Null extends Token {} Null.isExpression = true;
export class Then extends Token {}
export class Throw extends Token {}
export class True extends Token {} True.isExpression = true;
export class Void extends Token {} Void.isExpression = true;

export class ExportAs extends Token {}

let repeat = function() {
};

let indent0 = Symbol();
let indent1 = Symbol();
let indent2 = Symbol();

let blockContainers = [
    Then,
    Else,
    DashFunction,
    ArrowFunction,
    DiamondFunction
];

let nonHeadTokens = [Then, Else, As, ExportAs];

let isBlockContainer = function(token) {
    for (let i = 0; i < blockContainers.length; i++) {
        if (token instanceof blockContainers[i]) {
            return true;
        }
    }
    return false;
};

let isNonHeadToken = function(token) {
    for (let i = 0; i < nonHeadTokens.length; i++) {
        if (token instanceof nonHeadTokens[i]) {
            return true;
        }
    }
    return false;
};

// Between each adjacent `Expression` and `Block` there must be a separator defined,
// though it can be omitted in some cases in Lemo code.
let autoInsertedSeparators = [
    //{separator: Then, match: [Expression, CommandStatement]}
];

let isExpressionEnd = function(token) {
    if (
        token.constructor.isExpression ||
        token instanceof NormalToken ||
        token instanceof Num ||
        token instanceof NormalStringEnd ||
        token instanceof RightParenthesis ||
        token instanceof RightBracket ||
        token instanceof RightBrace
    ) {
        return true;
    }
    else {
        return false;
    }
}
