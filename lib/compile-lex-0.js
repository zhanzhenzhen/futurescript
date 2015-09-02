import {Block} from "./compile-block-0";
import {Expression} from "./compile-expression-0";
import {Statement} from "./compile-statement-0";

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
    }

    _round1(raw) {
        let result = [];

        let pendingToken = null;

        for (let i = 0; i < raw.length; i++) {
            let char = raw[i];

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
                }
                else if (char === "\n") {
                    pendingToken = new Indent(0);
                }
                else if (char.search(/[0-9]/) !== -1) {
                    pendingToken = new Num(char);
                }
                else if (result[result.length - 1] instanceof NormalStringStart) {
                    pendingToken = new Str(char);
                }
                else if (char === "#") {
                    pendingToken = new NormalComment("");
                }
                else if (char.search(/[A-Za-z]/) !== -1) {
                    pendingToken = new NormalToken(char);
                }

                else if (raw[i - 2] !== ":" && raw[i - 1] === ":" && char !== ":") {
                    result.push(new Colon());
                }
                else if (char === ",") {
                    result.push(new Comma());
                }
                else if (char === ".") {
                    result.push(new Dot());
                }
                else if (char === "(") {
                    if (raw[i - 1].search(/[")\]}A-Za-z0-9_$]/) !== -1) {
                        result.push(new CallLeftParenthesis());
                    }
                    else {
                        result.push(new NormalLeftParenthesis());
                    }
                }
                else if (char === ")") {
                    result.push(new RightParenthesis());
                }
                else if (char === "[") {
                    result.push(new LeftBracket());
                }
                else if (char === "]") {
                    result.push(new RightBracket());
                }
                else if (char === "{") {
                    result.push(new LeftBrace());
                }
                else if (char === "}") {
                    result.push(new RightBrace());
                }
                else if (raw[i - 1] !== "/" && char === "=") {
                    result.push(new Equal());
                }
                else if (raw[i - 1] === "/" && char === "=") {
                    result.push(new NotEqual());
                }
                else if (raw[i - 1] !== "<" && char === "<") {
                    result.push(new LessThan());
                }
                else if (raw[i - 1] !== "|" && raw[i - 1] !== "-" && raw[i - 1] !== ">" && char === ">") {
                    result.push(new GreaterThan());
                }
                else if (raw[i - 1] === "<" && char === "=") {
                    result.push(new LessThanOrEqual());
                }
                else if (raw[i - 2] !== ">" && raw[i - 1] === ">" && char === "=") {
                    result.push(new GreaterThanOrEqual());
                }
                else if (char === "+") {
                    if ((raw[i - 1] === " " || (
                        !(result[result.length - 1] instanceof Indent) &&
                        !(result[result.length - 1] instanceof NormalToken) &&
                        !(result[result.length - 1] instanceof Num) &&
                        !(result[result.length - 1] instanceof NormalStringEnd) &&
                        !(result[result.length - 1] instanceof RightParenthesis) &&
                        !(result[result.length - 1] instanceof RightBracket) &&
                        !(result[result.length - 1] instanceof RightBrace)
                    )) && raw[i + 1] !== " ") {
                        result.push(new Positive());
                    }
                    else {
                        result.push(new Plus());
                    }
                }
                else if (raw[i - 1] !== "-" && char === "-" && raw[i + 1] !== "-" && raw[i + 1] !== ">") {
                    if ((raw[i - 1] === " " || (
                        !(result[result.length - 1] instanceof Indent) &&
                        !(result[result.length - 1] instanceof NormalToken) &&
                        !(result[result.length - 1] instanceof Num) &&
                        !(result[result.length - 1] instanceof NormalStringEnd) &&
                        !(result[result.length - 1] instanceof RightParenthesis) &&
                        !(result[result.length - 1] instanceof RightBracket) &&
                        !(result[result.length - 1] instanceof RightBrace)
                    )) && raw[i + 1] !== " ") {
                        result.push(new Negative());
                    }
                    else {
                        result.push(new Minus());
                    }
                }
                else if (char === "*") {
                    result.push(new Times());
                }
                else if (char === "/" && raw[i + 1] !== "=") {
                    result.push(new Over());
                }
                else if (
                    raw[i - 1].search(/[A-Za-z0-9]/) === -1 &&
                    !(raw[i - 2] === "\"" && raw[i - 1] === "\"") && char === "\"" &&
                    !(result[result.length - 1] instanceof Str)
                ) {
                    result.push(new NormalStringStart());
                }
                else if (char === "\"" && result[result.length - 1] instanceof Str) {
                    result.push(new NormalStringEnd());
                }
                else if (raw[i - 1] === "-" && char === "-") {
                    result.push(new DashFunction());
                }
                else if (raw[i - 1] === "-" && char === ">") {
                    result.push(new ArrowFunction());
                }
                else if (raw[i - 1] === "<" && char === ">") {
                    result.push(new DiamondFunction());
                }
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
        this.value.forEach(token => {
            if (token instanceof NormalToken) {
                let t = null;
                switch (token.value) {
                    case "else":
                        t = Else; break;
                    case "if":
                        t = If; break;
                    case "match":
                        t = Match; break;
                    case "then":
                        t = Then; break;
                    case "throw":
                        t = Throw; break;
                }
                if (t !== null) {
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
        this.value.forEach(token => {
            if (token instanceof Indent) {
                if (token.value > oldIndentValue) {
                    newValue.push(new LeftChevron());
                    oldIndentValue = token.value;
                }
                else if (token.value < oldIndentValue) {
                    for (let i = 0; i < oldIndentValue - token.value; i++) {
                        newValue.push(new RightChevron());
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
        this.value = newValue;
    }

    // Between each adjacent `Expression` and `Block` we add a `Then` separator.
    _round8() {
        let newValue = [];
        let oldIndentValue = 0;
        this.value.forEach((token, index) => {
            let previous = this.value[index - 1];
            if ((
                previous instanceof NormalToken ||
                previous instanceof Num ||
                previous instanceof NormalStringEnd ||
                previous instanceof RightParenthesis ||
                previous instanceof RightBracket ||
                previous instanceof RightBrace
            ) && (
                token instanceof Throw ||
                token instanceof Delete ||
                token instanceof Export
            )) {
                newValue.push(new Then());
            }
            newValue.push(token);
        });
        this.value = newValue;
    }

    // Normalize block container to use block instead of single statement.
    _round9() {
    }

    /* Remove useless indents. Example:

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
    _round10() {
    }

    // Use more accurate concepts to replace "<<" and ">>".
    _round11() {
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

export class Delete extends Token {}
export class Else extends Token {}
export class Export extends Token {}
export class If extends Token {}
export class Match extends Token {}
export class Then extends Token {}
export class Throw extends Token {}

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

// Between each adjacent `Expression` and `Block` there must be a separator defined,
// though it can be omitted in some cases in Lemo code.
let autoInsertedSeparators = [
    //{separator: Then, match: [Expression, CommandStatement]}
];
