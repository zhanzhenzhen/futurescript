// `isJoint=true` means the token can't be the start or end of something.
// That is, it must act as a "joint".

import * as $tools from "./tools.mjs";
import * as $lockedApi from "../locked-api.mjs";

export class Lex {
    // Both `raw` and `path` are optional, but at least one should exist.
    // If `raw` is absent, it will return a promise rather than an instance.
    constructor(raw, path) {
        let internalConstructor = () => {
            this.path = path;
            this.raw = raw;

            // In fact this is "round 0". Source map and error message need line and column.
            // Note: "\n" may be in strings. We must add all "\n".
            let rawLinePositions = [0];
            for (let i = 0; i < raw.length; i++) {
                if (raw[i] === "\n") {
                    rawLinePositions.push(i + 1);
                }
            }
            this._rawLinePositions = rawLinePositions;

            this._round1();
            this._round2();
            this._round3();
            this._round4();
            this._round5();
            this._round6();
            this._round7();
            this._round8();
            this._round9();
            this._round10();
            this._round11();
            this._round12();
            this._round13();
            this._round14();
            this._round15();
            this._round16();
            this._round17();
            this._round18();
            this._round19();
            this._round20();
            this._round21();
            this._round22();
            this._round23();
            this._round24();
            this._round25();
            this._round26();
            this._round27();
            this._round28();
            this._round29();
            this._round30();
            this._round31();
        };
        if (raw === undefined) {
            return new Promise((resolve, reject) => {(async () => {
                raw = await $lockedApi.readTextFile(path);
                internalConstructor();
                resolve(this);
            })();});
        }
        else {
            internalConstructor();
        }
    }

    _round1() {
        let raw = this.raw;

        // Note: we can only append things to the raw end. If we modify raw's middle,
        // raw positions are lost.
        if (!raw.endsWith("\n")) {
            raw += "\n";
        }

        let result = [];

        let pendingToken = null;

        let versionDirectiveInBraces = false;
        let numberForcesInt = false;
        let numberIsHex = false;
        let stringType = null;
        let stringInterpolationParenthesisLevel = null;
        let indentValue = null;
        let stringIndentValue = null;
        let stringIndentValueRemaining = null;
        let stringIndentFinished = false;
        let stringLine = {content: ""};
        let postQuote = null;

        let i = 0;
        while (i < raw.length) {
            let char = raw[i];

            // process length-unfixed tokens
            if (pendingToken instanceof VersionDirective) {
                if (char === "{") {
                    versionDirectiveInBraces = true;
                    pendingToken.value += char;
                    i++;
                }
                else if (char === "}") {
                    versionDirectiveInBraces = false;
                    pendingToken.value += char;
                    i++;
                }
                else if (!versionDirectiveInBraces && (char === "\r" || char === "\n")) {
                    result.push(pendingToken.end(i - 1));
                    pendingToken = null;
                }
                else {
                    pendingToken.value += char;
                    i++;
                }
            }
            else if (pendingToken instanceof Indent) {
                if (char === " " || char === "\t") {
                    pendingToken.value++;
                    i++;
                }
                else {
                    indentValue = pendingToken.value;
                    result.push(pendingToken.end(i - 1));
                    pendingToken = null;
                }
            }
            else if (pendingToken instanceof Num) {
                if (!numberIsHex && char === "e" && (raw[i + 1] === "+" || raw[i + 1] === "-")) {
                    pendingToken.value += "e" + raw[i + 1];
                    i += 2;
                }
                else if ((
                    numberForcesInt ?
                    char.search(/[0-9A-Fa-fx]/) :
                    char.search(/[0-9A-Fa-fx.]/)
                ) !== -1) {
                    pendingToken.value += char;
                    i++;
                }
                else {
                    result.push(pendingToken.end(i - 1));
                    pendingToken = null;
                    numberForcesInt = false;
                    numberIsHex = false;
                }
            }
            else if (pendingToken instanceof Str) {
                let indentOffset = stringIndentValue - indentValue;
                if (postQuote !== null) {
                    if (char.search(/[a-z]/) !== -1) {
                        postQuote.value += char;
                        i++;
                    }
                    else {
                        result.push(postQuote.end(i - 1));
                        result.push(new PseudoCallRightParenthesis());
                        postQuote = null;
                        pendingToken = null;
                    }
                }
                else if (!(char === "\"" && (
                    stringType.isInline || (!stringType.isInline && indentOffset === 0)
                ))) {
                    let interpolationChar = null;
                    if (stringType === InlineNormalString || stringType === FormattedNormalString) {
                        interpolationChar = "\\";
                    }
                    else if (stringType === InlineRegex || stringType === FormattedRegex) {
                        interpolationChar = "#";
                    }
                    let quoteEscapeEnabled =
                        stringType === InlineNormalString ||
                        stringType === FormattedNormalString ||
                        stringType === InlineRegex;
                    let joinEscapeEnabled =
                        stringType === InlineNormalString ||
                        stringType === FormattedNormalString ||
                        stringType === InlineRegex ||
                        stringType === FormattedRegex;
                    if (char === interpolationChar && raw[i + 1] === "(") {
                        stringLine.indentOffset = indentOffset;
                        stringLine.isJoin = false;
                        pendingToken.value.push(stringLine);
                        result.push(pendingToken.end(i - 1));
                        result.push(new Plus());
                        result.push(new NormalLeftParenthesis().start(i).end(i + 1));
                        pendingToken = null;
                        stringLine = {content: ""};
                        stringInterpolationParenthesisLevel = 1;
                        stringIndentFinished = true;
                        i += 2;
                    }
                    else if (
                        quoteEscapeEnabled &&
                        char === "\\" && raw[i + 1] === "\""
                    ) {
                        stringLine.content += "\\\"";
                        stringIndentFinished = true;
                        i += 2;
                    }
                    else if (
                        joinEscapeEnabled &&
                        char === "\\" && (raw[i + 1] === "\r" || raw[i + 1] === "\n")
                    ) {
                        stringLine.indentOffset = indentOffset;
                        stringLine.isJoin = true;
                        pendingToken.value.push(stringLine);
                        stringLine = {content: ""};
                        stringIndentValue = 0;
                        stringIndentFinished = false;
                        i += 2;
                    }
                    else if (
                        stringIndentValue !== null &&
                        (char === " " || char === "\t") &&
                        !stringIndentFinished
                    ) {
                        stringIndentValue++;
                        i++;
                    }
                    else if (char === "\r" || char === "\n") {
                        stringLine.indentOffset = indentOffset;
                        stringLine.isJoin = false;
                        pendingToken.value.push(stringLine);
                        stringLine = {content: ""};
                        stringIndentValue = 0;
                        stringIndentFinished = false;
                        i++;
                    }
                    else {
                        stringLine.content += char;
                        stringIndentFinished = true;
                        i++;
                    }
                }
                else {
                    stringLine.indentOffset = indentOffset;
                    stringLine.isJoin = false;
                    pendingToken.value.push(stringLine);
                    pendingToken.isLast = true;
                    result.push(pendingToken.end(i - 1));
                    if (raw[i + 1].search(/[a-z]/) !== -1) {
                        result.push(new Comma());
                        postQuote = new PostQuote("").start(i + 1);
                    }
                    else {
                        result.push(new PseudoCallRightParenthesis());
                        pendingToken = null;
                    }
                    stringType = null;
                    stringIndentValue = null;
                    stringLine = {content: ""};
                    stringIndentFinished = false;
                    i++;
                }
            }
            else if (pendingToken instanceof InlineComment) {
                if (char !== "\r" && char !== "\n") {
                    pendingToken.value += char;
                    i++;
                }
                else {
                    result.push(pendingToken.end(i - 1));
                    pendingToken = null;
                }
            }
            else if (pendingToken instanceof FormattedComment) {
                if (!(char === "#" && raw[i + 1] === "#" && raw[i + 2] === "#")) {
                    pendingToken.value += char;
                    i++;
                }
                else {
                    result.push(pendingToken.end(i + 2));
                    pendingToken = null;
                    i += 3;
                }
            }
            else if (pendingToken instanceof NormalToken) {
                if (char.search(/[A-Za-z0-9_$]/) !== -1) {
                    pendingToken.value += char;
                    i++;
                }
                else {
                    result.push(pendingToken.end(i - 1));
                    pendingToken = null;
                }
            }

            // characters that won't be processed
            else if (char === " ") {
                i++;
            }
            else if (char === "\r" && raw[i + 1] === "\n") {
                i++;
            }

            // recognize length-unfixed tokens: version directive
            else if (i === 0) {
                pendingToken = new VersionDirective(char).start(i);
                i++;
            }

            // recognize length-unfixed tokens: three characters
            else if (char === "j" && raw[i + 1] === "s" && raw[i + 2] === "\"") {
                if (raw[i + 3] === "\r" || raw[i + 3] === "\n") {
                    stringType = FormattedJs;
                    result.push(new FormattedJs().start(i).end(i + 1));
                }
                else {
                    stringType = InlineJs;
                    result.push(new InlineJs().start(i).end(i + 1));
                }
                result.push(new PseudoCallLeftParenthesis());
                pendingToken = new Str([]).start(i + 3);
                pendingToken.type = stringType;
                pendingToken.isFirst = true;
                stringIndentValue = indentValue;
                i += 3;
            }
            else if (char === "#" && raw[i + 1] === "#" && raw[i + 2] === "#") {
                pendingToken = new FormattedComment("").start(i);
                i += 3;
            }

            // recognize length-unfixed tokens: double character
            else if (char === "v" && raw[i + 1] === "\"") {
                if (raw[i + 2] === "\r" || raw[i + 2] === "\n") {
                    stringType = FormattedVerbatimString;
                    result.push(new FormattedVerbatimString().start(i).end(i));
                }
                else {
                    stringType = InlineVerbatimString;
                    result.push(new InlineVerbatimString().start(i).end(i));
                }
                result.push(new PseudoCallLeftParenthesis());
                pendingToken = new Str([]).start(i + 2);
                pendingToken.type = stringType;
                pendingToken.isFirst = true;
                stringIndentValue = indentValue;
                i += 2;
            }
            else if (char === "r" && raw[i + 1] === "\"") {
                if (raw[i + 2] === "\r" || raw[i + 2] === "\n") {
                    stringType = FormattedRegex;
                    result.push(new FormattedRegex().start(i).end(i));
                }
                else {
                    stringType = InlineRegex;
                    result.push(new InlineRegex().start(i).end(i));
                }
                result.push(new PseudoCallLeftParenthesis());
                pendingToken = new Str([]).start(i + 2);
                pendingToken.type = stringType;
                pendingToken.isFirst = true;
                stringIndentValue = indentValue;
                i += 2;
            }

            // recognize length-fixed tokens: double character
            else if (char === "<" && raw[i + 1] === "<") {
                result.push(new LeftChevron().start(i).end(i + 1));
                i += 2;
            }
            else if (char === ">" && raw[i + 1] === ">") {
                result.push(new RightChevron().start(i).end(i + 1));
                i += 2;
            }
            else if (char === "-" && raw[i + 1] === "-") {
                result.push(new DashFunction().start(i).end(i + 1));
                i += 2;
            }
            else if (char === "-" && raw[i + 1] === ">") {
                result.push(new ArrowFunction().start(i).end(i + 1));
                i += 2;
            }
            else if (char === "<" && raw[i + 1] === ">") {
                result.push(new DiamondFunction().start(i).end(i + 1));
                i += 2;
            }
            else if (char === "|" && raw[i + 1] === ">") {
                result.push(new Pipe().start(i).end(i + 1));
                i += 2;
            }
            else if (char === ":" && raw[i + 1] === ":") {
                result.push(new FatDot().start(i).end(i + 1));
                i += 2;
            }
            else if (char === "/" && raw[i + 1] === "=") {
                result.push(new NotEqual().start(i).end(i + 1));
                i += 2;
            }
            else if (char === "<" && raw[i + 1] === "=") {
                result.push(new LessThanOrEqual().start(i).end(i + 1));
                i += 2;
            }
            else if (char === ">" && raw[i + 1] === "=") {
                result.push(new GreaterThanOrEqual().start(i).end(i + 1));
                i += 2;
            }
            else if (char === "*" && raw[i + 1] === "*") {
                result.push(new Power().start(i).end(i + 1));
                i += 2;
            }

            // recognize length-unfixed tokens: single character
            else if (char === "\n") {
                pendingToken = new Indent(0).start(i + 1);
                i++;
            }
            else if (char.search(/[0-9]/) !== -1) {
                pendingToken = new Num(char).start(i);
                if (raw[i - 1] === "." || raw[i - 1] === "@") {
                    numberForcesInt = true;
                }
                if (char === "0" && raw[i + 1] === "x") {
                    numberIsHex = true;
                }
                i++;
            }
            else if (char === "\"") {
                if (raw[i + 1] === "\r" || raw[i + 1] === "\n") {
                    stringType = FormattedNormalString;
                    result.push(new FormattedNormalString());
                }
                else {
                    stringType = InlineNormalString;
                    result.push(new InlineNormalString());
                }
                result.push(new PseudoCallLeftParenthesis());
                pendingToken = new Str([]).start(i + 1);
                pendingToken.type = stringType;
                pendingToken.isFirst = true;
                stringIndentValue = indentValue;
                i++;
            }
            else if (char === "#") {
                pendingToken = new InlineComment("").start(i);
                i++;
            }
            else if (char.search(/[A-Za-z_$]/) !== -1) {
                pendingToken = new NormalToken(char).start(i);
                i++;
            }

            // recognize length-fixed tokens: single character
            else if (char === ";") {
                result.push(new Semicolon().start(i).end(i));
                i++;
            }
            else if (char === ":") {
                result.push(new Colon().start(i).end(i));
                i++;
            }
            else if (char === ",") {
                result.push(new Comma().start(i).end(i));
                i++;
            }
            else if (char === ".") {
                result.push(new Dot().start(i).end(i));
                i++;
            }
            else if (char === "(") {
                if (stringType !== null) {
                    stringInterpolationParenthesisLevel++;
                }
                if (raw[i - 1].search(/["')@A-Za-z0-9_$]/) !== -1) {
                    result.push(new CallLeftParenthesis().start(i).end(i));
                }
                else {
                    result.push(new NormalLeftParenthesis().start(i).end(i));
                }
                i++;
            }
            else if (char === ")") {
                if (stringType !== null) {
                    stringInterpolationParenthesisLevel--;
                }
                if (stringType !== null && stringInterpolationParenthesisLevel === 0) {
                    result.push(new RightParenthesis().start(i).end(i));
                    result.push(new Plus());
                    stringInterpolationParenthesisLevel = null;
                    pendingToken = new Str([]).start(i + 1);
                    pendingToken.type = stringType;
                }
                else {
                    result.push(new RightParenthesis().start(i).end(i));
                }
                i++;
            }
            else if (char === "[") {
                if (raw[i - 1].search(/["')@A-Za-z0-9_$]/) !== -1) {
                    result.push(new CallLeftBracket().start(i).end(i));
                }
                else {
                    result.push(new NormalLeftBracket().start(i).end(i));
                }
                i++;
            }
            else if (char === "]") {
                result.push(new RightBracket().start(i).end(i));
                i++;
            }
            else if (char === "{") {
                if (raw[i - 1].search(/["')@A-Za-z0-9_$]/) !== -1) {
                    result.push(new CallLeftBrace().start(i).end(i));
                }
                else {
                    result.push(new NormalLeftBrace().start(i).end(i));
                }
                i++;
            }
            else if (char === "}") {
                result.push(new RightBrace().start(i).end(i));
                i++;
            }
            else if (char === "=") {
                result.push(new Equal().start(i).end(i));
                i++;
            }
            else if (char === "≠") {
                result.push(new NotEqual().start(i).end(i));
                i++;
            }
            else if (char === "<") {
                result.push(new LessThan().start(i).end(i));
                i++;
            }
            else if (char === ">") {
                result.push(new GreaterThan().start(i).end(i));
                i++;
            }
            else if (char === "≤") {
                result.push(new LessThanOrEqual().start(i).end(i));
                i++;
            }
            else if (char === "≥") {
                result.push(new GreaterThanOrEqual().start(i).end(i));
                i++;
            }
            else if (char === "+") {
                if (
                    raw[i - 1].search(/[")\]}@A-Za-z0-9_$]/) === -1 &&
                    raw[i + 1] !== " " && raw[i + 1] !== "\t" &&
                    raw[i + 1] !== "\r" && raw[i + 1] !== "\n"
                ) {
                    result.push(new Positive().start(i).end(i));
                }
                else {
                    result.push(new Plus().start(i).end(i));
                }
                i++;
            }
            else if (char === "-") {
                if (
                    raw[i - 1].search(/[")\]}@A-Za-z0-9_$]/) === -1 &&
                    raw[i + 1] !== " " && raw[i + 1] !== "\t" &&
                    raw[i + 1] !== "\r" && raw[i + 1] !== "\n"
                ) {
                    result.push(new Negative().start(i).end(i));
                }
                else {
                    result.push(new Minus().start(i).end(i));
                }
                i++;
            }
            else if (char === "*") {
                result.push(new Times().start(i).end(i));
                i++;
            }
            else if (char === "/") {
                result.push(new Over().start(i).end(i));
                i++;
            }
            else if (char === "?") {
                result.push(new Question().start(i).end(i));
                i++;
            }
            else if (char === "|") {
                result.push(new Stick().start(i).end(i));
                i++;
            }
            else if (char === "@") {
                result.push(new Arg().start(i).end(i));
                if (raw[i + 1].search(/[A-Za-z0-9_$]/) !== -1) {
                    result.push(new Dot());
                }
                i++;
            }
            else if (char === "'") {
                if (raw[i + 1].search(/[A-Za-z0-9]/) !== -1) {
                    result.push(new NormalVariant().start(i).end(i));
                }
                else {
                    result.push(new FunctionVariant().start(i).end(i));
                }
                i++;
            }
            else if (char === "\\" && (raw[i + 1] === "\r" || raw[i + 1] === "\n")) {
                result.push(new Join().start(i).end(i));
                i++;
            }

            else {
                throw new CharacterError([i, i], this.raw);
            }
        }
        this.value = result;
    }

    // Check syntax error and let right-hand pair parts be more accurate.
    // For example "CallLeftParenthesis, ... , RightParenthesis" will be normalized to
    // "CallLeftParenthesis, ... , CallRightParenthesis".
    _round2() {
        let newValue = [];
        let stack = [];
        let opposite = left => {
            if (left === LeftParenthesis) {
                return RightParenthesis;
            }
            else if (left === NormalLeftParenthesis) {
                return NormalRightParenthesis;
            }
            else if (left === CallLeftParenthesis) {
                return CallRightParenthesis;
            }
            else if (left === PseudoCallLeftParenthesis) {
                return PseudoCallRightParenthesis;
            }
            else if (left === LeftBracket) {
                return RightBracket;
            }
            else if (left === NormalLeftBracket) {
                return NormalRightBracket;
            }
            else if (left === CallLeftBracket) {
                return CallRightBracket;
            }
            else if (left === LeftBrace) {
                return RightBrace;
            }
            else if (left === NormalLeftBrace) {
                return NormalRightBrace;
            }
            else if (left === CallLeftBrace) {
                return CallRightBrace;
            }
            else if (left === LeftChevron) {
                return RightChevron;
            }
            else {
                throw new Error("No opposite.");
            }
        };
        this.value.forEach((token, index) => {
            if (
                token instanceof LeftParenthesis ||
                token instanceof LeftBracket ||
                token instanceof LeftBrace ||
                token instanceof LeftChevron
            ) {
                stack.push(opposite(token.constructor));
                newValue.push(token);
            }
            else if (
                token instanceof RightParenthesis ||
                token instanceof RightBracket ||
                token instanceof RightBrace ||
                token instanceof RightChevron
            ) {
                if (token.constructor === stack[stack.length - 1]) {
                    newValue.push(token);
                    stack.pop();
                }
                else if ($tools.classIsClass(stack[stack.length - 1], token.constructor)) {
                    newValue.push(new stack[stack.length - 1]().copyPositionFrom(token));
                    stack.pop();
                }
                else {
                    throw new PunctuationPairError(this.part(index, index));
                }
            }
            else {
                newValue.push(token);
            }
        });
        if (stack.length > 0) {
            throw new PunctuationPairError(this.part(this.count() - 1, this.count() - 1));
        }
        this.value = newValue;
    }

    _round3() {
        let min = null;
        let arr = null;
        this.value.forEach((token, index) => {
            if (token instanceof Str && !token.type.isInline) {
                if (token.isFirst) {
                    min = 9999;
                    arr = [];
                }
                let start = token.isFirst ? 1 : 0;
                let end = token.isLast ? token.value.length - 1 : token.value.length;
                for (let i = start; i < end; i++) {
                    if (token.value[i].content.trim() !== "" && token.value[i].indentOffset < min) {
                        min = token.value[i].indentOffset;
                    }
                }
                arr.push(token);
                if (token.isLast) {
                    for (let i = 0; i < arr.length; i++) {
                        arr[i].minIndentOffset = min;
                    }
                }
            }
        });
    }

    _round4() {
        let newValue = [];
        this.value.forEach((token, index) => {
            if (token instanceof Str) {
                if (token.type.isInline) {
                    let s = "";
                    for (let i = 0; i < token.value.length; i++) {
                        s += " ".repeat(token.value[i].indentOffset) + token.value[i].content;
                    }
                    newValue.push(token.replaceWith(s));
                }
                else {
                    let arr = [];
                    let start = token.isFirst ? 1 : 0;
                    let end = token.isLast ? token.value.length - 1 : token.value.length;
                    for (let i = start; i < end; i++) {
                        let spaceCount = token.value[i].indentOffset - token.minIndentOffset;
                        if (spaceCount < 0) { // empty line may make it negative
                            spaceCount = 0;
                        }
                        let s = " ".repeat(spaceCount) + token.value[i].content;
                        if (i > 0 && token.value[i - 1].isJoin && arr.length > 0) {
                            arr[arr.length - 1] += s;
                        }
                        else {
                            arr.push(s);
                        }
                    }
                    newValue.push(token.replaceWith(arr.join("\n")));
                }
            }
            else {
                newValue.push(token);
            }
        });
        this.value = newValue;
    }

    // This will add a parenthesis wrapper to make it easier to parse later.
    _round5() {
        let newValue = [];
        let level = null;
        this.value.forEach((token, index) => {
            if (this.value[index - 1] instanceof Dot && token instanceof InlineNormalString) {
                newValue.push(new NormalLeftParenthesis());
                newValue.push(token);
                level = 0;
            }
            else if (level !== null && token instanceof LeftParenthesis) {
                newValue.push(token);
                level++;
            }
            else if (level !== null && token instanceof RightParenthesis) {
                newValue.push(token);
                level--;
                if (level === 0) {
                    newValue.push(new NormalRightParenthesis());
                    level = null;
                }
            }
            else {
                newValue.push(token);
            }
        });
        this.value = newValue;
    }

    // This will add a parenthesis wrapper to make things like `a.0` easier to parse later.
    _round6() {
        let newValue = [];
        this.value.forEach((token, index) => {
            if (this.value[index - 1] instanceof Dot && token instanceof Num) {
                newValue.push(new NormalLeftParenthesis());
                newValue.push(token);
                newValue.push(new NormalRightParenthesis());
            }
            else {
                newValue.push(token);
            }
        });
        this.value = newValue;
    }

    _detectKeyword(normalToken) {
        let t = null;
        switch (normalToken.value) {
            case "above":
                t = Above; break;
            case "and":
                t = And; break;
            case "as":
                t = As; break;
            case "catch":
                t = Catch; break;
            case "class":
                t = Class; break;
            case "delete":
                t = Delete; break;
            case "do":
                t = Do; break;
            case "else":
                t = Else; break;
            case "export":
                t = Export; break;
            case "false":
                t = False; break;
            case "finally":
                t = Finally; break;
            case "fun":
                t = Fun; break;
            case "if":
                t = If; break;
            case "ifnull":
                t = Ifnull; break;
            case "ifvoid":
                t = Ifvoid; break;
            case "import":
                t = Import; break;
            case "in":
                t = In; break;
            case "is":
                t = Is; break;
            case "isnt":
                t = Isnt; break;
            case "match":
                t = Match; break;
            case "me":
                t = Me; break;
            case "Me":
                t = ClassMe; break;
            case "mod":
                t = Mod; break;
            case "new":
                t = New; break;
            case "nonew":
                t = Nonew; break;
            case "not":
                t = Not; break;
            case "null":
                t = Null; break;
            case "or":
                t = Or; break;
            case "pause":
                t = Pause; break;
            case "rem":
                t = Rem; break;
            case "self":
                t = Self; break;
            case "super":
                t = Super; break;
            case "then":
                t = Then; break;
            case "throw":
                t = Throw; break;
            case "true":
                t = True; break;
            case "try":
                t = Try; break;
            case "void":
                t = Void; break;
        }
        return t;
    }

    _round7() {
        let newValue = [];
        this.value.forEach((token, index) => {
            if (token instanceof NormalToken) {
                let t = this._detectKeyword(token);
                if (
                    t !== null &&
                    !(this.value[index - 1] instanceof Dot) &&
                    !(this.value[index - 1] instanceof NormalVariant) &&
                    !(
                        this.value[index + 1] instanceof Colon || (
                            this.value[index + 1] instanceof NormalVariant &&
                            this.value[index + 3] instanceof Colon
                        ) || (
                            this.value[index + 1] instanceof NormalVariant &&
                            this.value[index + 3] instanceof NormalVariant &&
                            this.value[index + 5] instanceof Colon
                        )
                    ) &&
                    !(newValue[newValue.length - 1] instanceof As)
                ) {
                    newValue.push(new t().copyPositionFrom(token).setOriginalTokens([token]));
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

    _round8() {
        let newValue = [];
        this.value.forEach((token, index) => {
            if (
                (
                    this.value[index - 1] instanceof NormalToken ||
                    this.value[index - 1] instanceof RightBracket
                ) &&
                token instanceof NormalToken &&
                this.value[index + 1] instanceof Colon
            ) {
                if (token.value === "ifvoid") {
                    newValue.push(new Ifvoid().copyPositionFrom(token));
                }
                else if (token.value === "ifnull") {
                    newValue.push(new Ifnull().copyPositionFrom(token));
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

    _round9() {
        let newValue = [];
        let i = 0;
        while (i < this.value.length) {
            let token = this.value[i];
            let next = this.value[i + 1];
            if (token instanceof Export && next instanceof As) {
                newValue.push(new ExportAs().start(i).end(i + 1).setOriginalTokens([token, next]));
                i += 2;
            }
            else if (token instanceof Not && next instanceof Equal) {
                newValue.push(new NotEqual().start(i).end(i + 1).setOriginalTokens([token, next]));
                i += 2;
            }
            else if (token instanceof Not && next instanceof In) {
                newValue.push(new NotIn().start(i).end(i + 1).setOriginalTokens([token, next]));
                i += 2;
            }
            else if (token instanceof Not && next instanceof Is) {
                newValue.push(new Isnt().start(i).end(i + 1).setOriginalTokens([token, next]));
                i += 2;
            }
            else if (token instanceof Is && next instanceof Not) {
                newValue.push(new Isnt().start(i).end(i + 1).setOriginalTokens([token, next]));
                i += 2;
            }
            else if (token instanceof Question) {
                newValue.push(new Then().copyPositionFrom(token).setOriginalTokens([token]));
                i++;
            }
            else if (token instanceof Stick) {
                newValue.push(new Else().copyPositionFrom(token).setOriginalTokens([token]));
                i++;
            }
            else {
                newValue.push(token);
                i++;
            }
        }
        this.value = newValue;
    }

    _removeEmptyLines() {
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

    _round10() {
        this._removeEmptyLines();
    }

    _round11() {
        let newValue = [];
        let ignoredTokens = [];
        this.value.forEach((token, index) => {
            if (token instanceof InlineComment) {
                ignoredTokens.push(token);
            }

            // Removing version directive is temporary, and just for simplification.
            // In the final round we will recover version directive.
            else if (token instanceof VersionDirective) {
                this._versionDirective = token;
            }

            else if (
                token instanceof FormattedComment &&
                !(
                    this.value[index - 2] instanceof VersionDirective &&
                    this.value[index - 1] instanceof Indent &&
                    (index === this.value.length - 1 || this.value[index + 1] instanceof Indent)
                )
            ) {
                ignoredTokens.push(token);
            }
            else if (token instanceof Above) {
                ignoredTokens.push(token);
            }
            else {
                newValue.push(token);
            }
        });
        this.value = newValue;
        this.ignoredTokens = ignoredTokens;
    }

    _round12() {
        this._removeEmptyLines();
    }

    // Each indent uses only 1 whitespace.
    _round13() {
        let newValue = [];
        let stack = [];
        this.value.forEach((token, index) => {
            if (token instanceof Indent) {
                if (stack.length === 0 || token.value > stack[stack.length - 1]) {
                    let newIndentValue = stack.length;
                    stack.push(token.value);
                    newValue.push(token.replaceWith(newIndentValue));
                }
                else if (token.value === stack[stack.length - 1]) {
                    newValue.push(token.replaceWith(stack.length - 1));
                }
                else {
                    let found = stack.indexOf(token.value);
                    if (found !== -1) {
                        newValue.push(token.replaceWith(found));
                        stack.splice(found + 1, stack.length - found - 1);
                    }
                    else {
                        throw new IndentError(this.part(index, index));
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
    _round14() {
        let newValue = [];
        let oldIndentValue = 0;
        this.value.forEach((token, index) => {
            if (token instanceof Indent) {
                if (token.value > oldIndentValue) {
                    newValue.push(new LeftChevron().copyPositionFrom(token));
                    oldIndentValue = token.value;
                }
                else if (token.value < oldIndentValue) {
                    for (let i = 0; i < oldIndentValue - token.value; i++) {
                        newValue.push(new RightChevron().copyPositionFrom(token));
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

    // Add necessary ";".
    _round15() {
        let newValue = [];
        this.value.forEach((token, index) => {
            newValue.push(token);
            if (
                token instanceof RightChevron &&
                !(this.value[index + 1] instanceof RightChevron) &&
                !(this.value[index + 1] instanceof Semicolon) &&
                !(this.value[index + 1] instanceof RightParenthesis) &&
                !(this.value[index + 1] instanceof RightBracket) &&
                !(this.value[index + 1] instanceof RightBrace) &&
                index !== this.value.length - 1
            ) {
                newValue.push(new Semicolon());
            }
        });
        this.value = newValue;
    }

    // Remove redundant ";".
    _round16() {
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

    // Remove redundant ";".
    _round17() {
        let newValue = [];
        this.value.forEach((token, index) => {
            if (token instanceof Semicolon) {
                if (index === 0) {
                }
                else if (index === this.value.length - 1) {
                }
                else if (this.value[index - 1] instanceof LeftChevron) {
                }
                else if (this.value[index + 1] instanceof RightChevron) {
                }
                else if (this.value[index - 1] instanceof LeftBrace) {
                }
                else if (this.value[index + 1] instanceof RightBrace) {
                }
                else if (this.value[index - 1] instanceof LeftBracket) {
                }
                else if (this.value[index + 1] instanceof RightBracket) {
                }
                else if (this.value[index - 1] instanceof LeftParenthesis) {
                }
                else if (this.value[index + 1] instanceof RightParenthesis) {
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

    /*
    Remove useless or incorrect indents and semicolons to combine multiple lines. Example:

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

    3 +
    5

    Normalized to:

    3 + 5

    Objects and arrays like:

    {
        a: 2
        b: 3
    }

    Normalized to:

    {a: 2, b: 3}

    Note that we don't remove empty chevron pair, because empty chevron pair can be nested,
    like "<< << >> << >> >>", removing it will be too complicated. Also, "(())"
    isn't stripped, so there's no reason to strip empty chevrons.
    */
    _round18() {
        let newValue = [];
        let stack = [];
        this.value.forEach((token, index) => {
            let prev = this.value[index - 1];
            let next = this.value[index + 1];
            if (token instanceof LeftChevron) {
                if (newValue[newValue.length - 1] instanceof Join) {
                    newValue.pop();
                    stack.push(true);
                }
                else if (
                    prev instanceof LeftParenthesis ||
                    prev instanceof LeftBracket ||
                    prev instanceof LeftBrace ||
                    (prev !== undefined && prev.constructor.isJoint) ||
                    (next !== undefined && next.constructor.isJoint)
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
                if (newValue[newValue.length - 1] instanceof Join) {
                    newValue.pop();
                }
                else if (
                    (prev !== undefined && prev.constructor.isJoint) ||
                    (next !== undefined && next.constructor.isJoint)
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

    // Remove ";" if "," is before ";".
    _round19() {
        let newValue = [];
        this.value.forEach((token, index) => {
            if (
                this.value[index - 1] instanceof Comma &&
                token instanceof Semicolon
            ) {
            }
            else {
                newValue.push(token);
            }
        });
        this.value = newValue;
    }

    // Remove incorrect ";" before token that can't be statement start. But this doesn't
    // include "else" because "else" may appear in "match", where "else" can be after ";".
    _round20() {
        let newValue = [];
        this.value.forEach((token, index) => {
            if (
                token instanceof Semicolon &&
                this.value[index + 1].constructor.expressionStartForbidden &&
                !this.value[index + 1].constructor.isCommand &&
                !(this.value[index + 1] instanceof Else)
            ) {
            }
            else {
                newValue.push(token);
            }
        });
        this.value = newValue;
    }

    // Remove incorrect ";" before "else" that's not in "match".
    _round21() {
        let newValue = [];
        let stack = [];
        this.value.forEach((token, index) => {
            if (token instanceof Match) {
                stack.push({position: index, kind: Match});
                newValue.push(token);
            }
            else if (token instanceof LeftChevron) {
                stack.push({position: index, kind: LeftChevron});
                newValue.push(token);
            }
            else if (token instanceof LeftParenthesis) {
                stack.push({position: index, kind: LeftParenthesis});
                newValue.push(token);
            }
            else if (token instanceof LeftBracket) {
                stack.push({position: index, kind: LeftBracket});
                newValue.push(token);
            }
            else if (token instanceof LeftBrace) {
                stack.push({position: index, kind: LeftBrace});
                newValue.push(token);
            }
            else if (
                token instanceof RightChevron ||
                token instanceof RightParenthesis ||
                token instanceof RightBracket ||
                token instanceof RightBrace
            ) {
                if (stack[stack.length - 1].kind === Match) {
                    stack.pop();
                }
                stack.pop();
                newValue.push(token);
            }
            else if (token instanceof Semicolon && this.value[index + 1] instanceof Else) {
                if (
                    stack.length >= 2 &&
                    stack[stack.length - 2].kind === Match &&
                    stack[stack.length - 1].kind === LeftChevron
                ) {
                    newValue.push(token);
                }
            }
            else {
                newValue.push(token);
            }
        });
        this.value = newValue;
    }

    // Two features: Mark levels and containers, and correct the default export token.
    // This is also the beginning period of processing flexible objects.
    // Note: We set many properties of tokens in this method, but these properties are
    // just for temporary use. Other modules should not use them.
    _round22() {
        let newValue = [];
        let level = 0;
        let stack = [null];

        // Brace container doesn't mean brace's container, but the container is brace type.
        this._braceContainers = [];

        this.value.forEach((token, index) => {
            if (
                token instanceof LeftChevron ||
                token instanceof LeftParenthesis ||
                token instanceof LeftBracket ||
                token instanceof LeftBrace
            ) {
                token.level = level;
                token.container = stack[stack.length - 1];
                level++;
                if (token instanceof LeftChevron) {
                    stack.push({type: Chevron});
                }
                else if (token instanceof LeftParenthesis) {
                    stack.push({type: Parenthesis});
                }
                else if (token instanceof LeftBracket) {
                    stack.push({type: Bracket});
                }
                else if (token instanceof LeftBrace) {
                    let container = {type: Brace};
                    stack.push(container);
                    this._braceContainers.push(container);
                }
                stack[stack.length - 1].leftIndex = index; // the left wrapper, like `{`
                stack[stack.length - 1].leftToken = token;
                token.selfContainer = stack[stack.length - 1]; // only wrapper tokens have `selfContainer`
                newValue.push(token);
            }
            else if (
                token instanceof RightChevron ||
                token instanceof RightParenthesis ||
                token instanceof RightBracket ||
                token instanceof RightBrace
            ) {
                stack[stack.length - 1].rightIndex = index; // the right wrapper, like `}`
                stack[stack.length - 1].rightToken = token;
                token.selfContainer = stack[stack.length - 1];
                level--;
                stack.pop();
                token.level = level;
                token.container = stack[stack.length - 1];
                newValue.push(token);
            }
            else if (
                level === 0 &&
                (index === 0 || this.value[index - 1] instanceof Semicolon) &&
                token instanceof NormalToken && token.value === "export" &&
                this.value[index + 1] instanceof Colon
            ) {
                let newToken = new Export().copyPositionFrom(token);
                newToken.level = level;
                newToken.container = stack[stack.length - 1];
                newValue.push(newToken);
            }
            else {
                token.level = level;
                token.container = stack[stack.length - 1];
                newValue.push(token);
            }
        });
        this.value = newValue;
    }

    // We will call this method not only once. Because some operations will change the tokens,
    // we need to call it to update the container.
    _fillBraceContainers() {
        this._braceContainers.forEach(container => {
            container.tokens = [];
        });
        this.value.forEach((token, index) => {
            token.index = index;
            if (token.container !== null && token.container.type === Brace) {
                token.container.tokens.push(token);
            }
            if (token.selfContainer !== undefined) {
                if (token instanceof LeftBrace) {
                    token.selfContainer.leftIndex = index;
                    token.selfContainer.leftToken = token;
                }
                else if (token instanceof RightBrace) {
                    token.selfContainer.rightIndex = index;
                    token.selfContainer.rightToken = token;
                }
            }
        });
        this._braceContainers.forEach(container => {
            if (container.exotic) {
                let functionPos = container.tokens.findIndex(m =>
                    m instanceof ArrowFunction ||
                    m instanceof DashFunction ||
                    m instanceof DiamondFunction
                );
                container.exoticEndInternalIndex =
                    functionPos === -1 ? container.tokens.length - 1 : functionPos;
            }
        });
    }

    _round23() {
        this._fillBraceContainers();
    }

    // Check every brace container to find if it's exotic or not.
    _round24() {
        this._braceContainers.forEach(container => {
            if (
                container !== null && container.type === Brace &&
                !(this.value[container.leftIndex - 1] instanceof As) &&
                !(this.value[container.rightIndex + 1] instanceof Colon)
            ) {
                container.isExpression = true;
                if (container.tokens.some(m => m instanceof Colon)) {
                    container.exotic = false;
                }
                else {
                    let splitterPos = -1;
                    for (let i = 0; i < container.tokens.length; i++) {
                        let token = container.tokens[i];
                        if (
                            i === container.tokens.length - 1 ||
                            token instanceof Comma ||
                            token instanceof Semicolon
                        ) {
                            // If it's at the end, there will be no comma or semicolon so the limit
                            // should be subtracted by 1.
                            let limit = i === container.tokens.length - 1 ? 1 : 2;

                            if (i - splitterPos > limit) {
                                container.exotic = true;
                                let functionPos = container.tokens.findIndex(m =>
                                    m instanceof ArrowFunction ||
                                    m instanceof DashFunction ||
                                    m instanceof DiamondFunction
                                );
                                container.exoticEndInternalIndex =
                                    functionPos === -1 ? container.tokens.length - 1 : functionPos;
                                break;
                            }
                            splitterPos = i;
                        }
                    }
                    if (container.exotic === undefined) {
                        container.exotic = false;
                    }
                }
            }
            else {
                container.isExpression = false;
            }
        });
    }

    // For exotic brace, remove commas and semicolons and convert keyword to its original `NormalToken`
    // form.
    _round25() {
        let newValue = [];
        this.value.forEach((token, index) => {
            if (
                token.container !== null && token.container.type === Brace &&
                token.container.isExpression && token.container.exotic
            ) {
                if (token instanceof Comma || token instanceof Semicolon) {
                }
                else if (
                    index <= token.container.tokens[token.container.exoticEndInternalIndex].index &&
                    token.getOriginalTokens() !== null &&
                    token.getOriginalTokens().some(m => m instanceof NormalToken)
                ) {
                    token.getOriginalTokens().forEach(originalToken => {
                        originalToken.container = token.container;
                        originalToken.isProbablyKeyword = true;
                        newValue.push(originalToken);
                    });
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

    _round26() {
        this._fillBraceContainers();
    }

    // This will enable all tokens to act like a linked list. Useful in next round,
    // because in next round tokens will be traversed, modified or inserted not in order.
    _round27() {
        this.value.forEach((token, index) => {
            if (index === this.value.length - 1) {
                token.next = null;
            }
            else {
                token.next = this.value[index + 1];
            }
        });
    }

    // This is the core round of processing flexible objects.
    _round28() {
        this._braceContainers.forEach(container => {
            if (container.isExpression) {
                if (container.exotic) {
                    let isKey = false;
                    for (let i = container.exoticEndInternalIndex; i >= 1; i--) {
                        if (
                            (isKey && container.tokens[i] instanceof NormalToken) ||
                            (
                                !isKey &&
                                container.tokens[i - 1] instanceof NormalToken &&
                                !container.tokens[i].constructor.isJoint &&
                                !(
                                    container.tokens[i] instanceof CallLeftParenthesis ||
                                    container.tokens[i] instanceof CallLeftBracket ||
                                    container.tokens[i] instanceof CallLeftBrace ||
                                    container.tokens[i] instanceof LeftChevron
                                ) &&
                                !container.tokens[i].constructor.expressionStartForbidden
                            )
                        ) {
                            if (isKey) {
                                let newToken = new Comma();
                                newToken.next = container.tokens[i];
                                container.tokens[i - 1].next = newToken;
                            }
                            else {
                                let newToken = new Colon();
                                newToken.next = container.tokens[i];
                                container.tokens[i - 1].next = newToken;
                                container.tokens[i - 1].isProbablyKeyword = false;
                            }
                            isKey = !isKey; // switch between key and value
                        }
                    }
                    if (!isKey) { // if the total number of keys and values is odd
                        let inlineNormalString = new InlineNormalString();
                        let pseudoCallLeftParenthesis = new PseudoCallLeftParenthesis();
                        let str = new Str("");
                        let pseudoCallRightParenthesis = new PseudoCallRightParenthesis();
                        let colon = new Colon();
                        inlineNormalString.next = pseudoCallLeftParenthesis;
                        pseudoCallLeftParenthesis.next = str;
                        str.next = pseudoCallRightParenthesis;
                        pseudoCallRightParenthesis.next = colon;

                        colon.next = container.tokens[0];
                        this.value[container.leftIndex].next = inlineNormalString;
                    }
                }
                else if (container.tokens.length >= 1) {
                    let hasColon = false;
                    container.tokens.concat([this.value[container.rightIndex]]).forEach((token, index) => {
                        if (
                            token instanceof Comma ||
                            token instanceof Semicolon ||
                            token === this.value[container.rightIndex]
                        ) {
                            if (!hasColon) {
                                let newColon = new Colon();
                                let newTrue = new True();
                                newColon.next = newTrue;
                                newTrue.next = token;
                                if (container.tokens[index - 1] instanceof Keyword) {
                                    let normalToken = container.tokens[index - 1].getOriginalTokens()[0];
                                    normalToken.next = newColon;
                                    if (index >= 2) {
                                        container.tokens[index - 2].next = normalToken;
                                    }
                                    else {
                                        this.value[container.leftIndex].next = normalToken;
                                    }
                                }
                                else {
                                    container.tokens[index - 1].next = newColon;
                                }
                            }
                            hasColon = false;
                        }
                        else if (token instanceof Colon) {
                            hasColon = true;
                        }
                    });
                }
            }
        });
    }

    _round29() {
        if (this.value.length === 0) return;
        let newValue = [];
        let token = this.value[0];
        while (token !== null) {
            newValue.push(token);
            token = token.next;
        }
        this.value = newValue;
    }

    // Recover all keyword-like tokens that's not keys to be keywords again in exotic brace.
    // This is the end of processing flexible objects.
    _round30() {
        let newValue = [];
        this.value.forEach((token, index) => {
            if (token instanceof NormalToken && token.isProbablyKeyword) {
                let t = this._detectKeyword(token);
                if (t !== null) {
                    newValue.push(new t().copyPositionFrom(token).setOriginalTokens([token]));
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

    _round31() {
        let newValue = [this._versionDirective];
        this.value.forEach(token => {
            newValue.push(token);
        });
        this.value = newValue;
    }

    at(index) {
        return this.value[index];
    }

    count() {
        return this.value.length;
    }

    part() {
        if (arguments[0] === null) {
            return null;
        }
        else if (arguments[0] instanceof Object) {
            return new LexPart(this, arguments[0].startIndex, arguments[0].endIndex);
        }
        else {
            return new LexPart(this, arguments[0], arguments[1]);
        }
    }

    rawLineColumn(rawPosition) {
        let line = $tools.findSortedNumber(this._rawLinePositions, rawPosition, false);
        let column = rawPosition - this._rawLinePositions[line];
        return [line, column];
    }

    toString(part) {
        if (part === undefined) {
            part = this.part();
        }
        let arr = [];
        for (let i = part.startIndex; i <= part.endIndex; i++) {
            let token = this.value[i];
            let part1 = token.constructor.name;
            let part2 = "";
            if (token.value !== undefined) {
                part2 = " " + JSON.stringify(token.value);
            }
            arr.push(part1 + part2);
        }
        return arr.join(", ");
    }
}

export class LexPart {
    constructor(lex, startIndex, endIndex) {
        this.lex = lex;
        this.startIndex = startIndex === undefined ? 0 : startIndex;
        this.endIndex = endIndex === undefined ? lex.count() - 1 : endIndex;
    }

    shrink() {
        return new LexPart(this.lex, this.startIndex + 1, this.endIndex - 1);
    }

    changeTo() {
        return this.lex.part(...arguments);
    }

    // Returns the first token in the lex part.
    token() {
        return this.lex.at(this.startIndex);
    }

    addStyle(style) {
        for (let i = this.startIndex; i <= this.endIndex; i++) {
            this.lex.at(i).addStyle(style);
        }
    }

    toString() {
        return this.lex.toString(this);
    }
}

export class RawError extends $lockedApi.SyntaxError {
    // `rawPart` is a 2-element array: [start, end]
    constructor(rawPart, raw, message) {
        if (rawPart === undefined) {
            super(message);
            return;
        }

        let start = null;
        let end = null;
        let line = 0;
        let column = 0;
        for (let i = 0; i < raw.length; i++) {
            if (i === rawPart[0]) {
                start = [line, column];
            }

            if (i === rawPart[1]) {
                end = [line, column];
                break;
            }

            if (raw[i] === "\n") {
                line++;
                column = 0;
            }
            else {
                column++;
            }
        }
        let positionStr =
            "From line " + (start[0] + 1) + " column " + (start[1] + 1) +
            " to line " + (end[0] + 1) + " column " + (end[1] + 1) + "\n";
        super(positionStr + message);
        this.rawPart = rawPart;
        this.rawStart = start;
        this.rawEnd = end;
    }
}

export class CharacterError extends RawError {
    constructor(rawPart, raw) {
        super(rawPart, raw, "Illegal character.");
    }
}

export class SyntaxError extends $lockedApi.SyntaxError {
    constructor(lexPart, message) {
        if (lexPart === undefined) {
            super(message);
            return;
        }

        let lex = lexPart.lex;
        let startIndex = 0;
        let endIndex = lexPart.lex.raw.length - 1;

        let t = lex.at(lexPart.startIndex).rawStartIndex;
        if (t === undefined) {
            for (let i = lexPart.startIndex - 1; i >= 0; i--) {
                if (lex.at(i).rawEndIndex !== undefined) {
                    startIndex = lex.at(i).rawEndIndex + 1;
                    break;
                }
            }
        }
        else {
            startIndex = t;
        }

        t = lex.at(lexPart.endIndex).rawEndIndex;
        if (t === undefined) {
            for (let i = lexPart.endIndex + 1; i < lex.count(); i++) {
                if (lex.at(i).rawStartIndex !== undefined) {
                    endIndex = lex.at(i).rawStartIndex - 1;
                    break;
                }
            }
        }
        else {
            endIndex = t;
        }

        let start = lex.rawLineColumn(startIndex);
        let end = lex.rawLineColumn(endIndex);
        let positionStr =
            "From line " + (start[0] + 1) + " column " + (start[1] + 1) +
            " to line " + (end[0] + 1) + " column " + (end[1] + 1) + "\n";
        super(positionStr + message);

        // We have `lexPart`, Why still exists `rawPart`: because this error may happen
        // in middle rounds of lex initialization, at which time the lex is not the final
        // well-formed lex. So in that case we better use `rawPart` in test code. Test
        // shouldn't check middle round lex, otherwise the test code is confusing.
        this.rawPart = [startIndex, endIndex];
        this.rawStart = start;
        this.rawEnd = end;

        this.lexPart = lexPart;
    }
}

export class PunctuationPairError extends SyntaxError {
    constructor(lexPart) {
        super(lexPart, "(...), [...], {...}, <<...>> or \"...\" pair mismatch.");
    }
}

export class IndentError extends SyntaxError {
    constructor(lexPart) {
        super(lexPart, "Indent error.");
    }
}

// If a token doesn't occupy any length of the raw input, then `rawStartIndex` and `rawEndIndex`
// should be undefined.
export class Token {
    constructor(value) {
        if (value !== undefined) {
            this.value = value;
        }
        this.style = 0;
        this._originalTokens = null;
    }

    start(index) {
        this.rawStartIndex = index;
        return this;
    }

    end(index) {
        this.rawEndIndex = index;
        return this;
    }

    copyPositionFrom(token) {
        return this.start(token.rawStartIndex).end(token.rawEndIndex);
    }

    // Create a new instance with the same type, position, style and original tokens,
    // but different value, returning the new instance.
    replaceWith(value) {
        return new this.constructor(value)
        .copyPositionFrom(this)
        .addStyle(this.style)
        .setOriginalTokens(this._originalTokens);
    }

    addStyle(style) {
        this.style |= style;
        return this;
    }

    setOriginalTokens(tokens) {
        if (tokens === null) {
            this._originalTokens = null;
        }
        else {
            let r = [];
            let traverse = tokens => {
                tokens.forEach(token => {
                    if (token._originalTokens !== null) {
                        traverse(token._originalTokens);
                    }
                    else {
                        r.push(token);
                    }
                });
            };
            traverse(tokens);
            this._originalTokens = r;
        }
        return this;
    }

    getOriginalTokens() {
        return this._originalTokens;
    }
}

export class NormalToken extends Token {} NormalToken.canBeCalleeEnd = true;
export class VersionDirective extends Token {}
export class Indent extends Token {}
export class BlockStart extends Token {}
export class BlockEnd extends Token {}
export class ClassStart extends Token {}
export class ClassEnd extends Token {}
export class Semicolon extends Token {}
export class Chevron extends Token {}
export class LeftChevron extends Chevron {}
export class RightChevron extends Chevron {}
export class Parenthesis extends Token {}
export class LeftParenthesis extends Parenthesis {}
export class NormalLeftParenthesis extends LeftParenthesis {}
export class CallLeftParenthesis extends LeftParenthesis {}
export class PseudoCallLeftParenthesis extends LeftParenthesis {}
export class RightParenthesis extends Parenthesis {}
export class NormalRightParenthesis extends RightParenthesis {}
export class CallRightParenthesis extends RightParenthesis {}
export class PseudoCallRightParenthesis extends RightParenthesis {}
export class Bracket extends Token {}
export class LeftBracket extends Bracket {}
export class NormalLeftBracket extends LeftBracket {}
export class CallLeftBracket extends LeftBracket {}
export class RightBracket extends Bracket {}
export class NormalRightBracket extends RightBracket {}
export class CallRightBracket extends RightBracket {}
export class Brace extends Token {}
export class LeftBrace extends Brace {}
export class NormalLeftBrace extends LeftBrace {}
export class CallLeftBrace extends LeftBrace {}
export class RightBrace extends Brace {}
export class NormalRightBrace extends RightBrace {}
export class CallRightBrace extends RightBrace {}
export class SpaceCall extends Token {}
export class Comma extends Token {} Comma.isJoint = true;
export class Dot extends Token {} Dot.isJoint = true;
export class Colon extends Token {} Colon.isJoint = true;
export class Equal extends Token {} Equal.isJoint = true;
export class NotEqual extends Token {} NotEqual.isJoint = true;
export class LessThan extends Token {} LessThan.isJoint = true;
export class GreaterThan extends Token {} GreaterThan.isJoint = true;
export class LessThanOrEqual extends Token {} LessThanOrEqual.isJoint = true;
export class GreaterThanOrEqual extends Token {} GreaterThanOrEqual.isJoint = true;
export class Plus extends Token {} Plus.isJoint = true;
export class Minus extends Token {} Minus.isJoint = true;
export class Times extends Token {} Times.isJoint = true;
export class Over extends Token {} Over.isJoint = true;
export class Power extends Token {} Power.isJoint = true;
export class Positive extends Token {}
export class Negative extends Token {}
export class Num extends Token {} Num.canBeCalleeEnd = true;
export class Str extends Token {} Str.canBeCalleeEnd = true;
export class InlineNormalString extends Token {} InlineNormalString.isInline = true;
export class FormattedNormalString extends Token {} FormattedNormalString.isInline = false;
export class InlineVerbatimString extends Token {} InlineVerbatimString.isInline = true;
export class FormattedVerbatimString extends Token {} FormattedVerbatimString.isInline = false;
export class InlineRegex extends Token {} InlineRegex.isInline = true;
export class FormattedRegex extends Token {} FormattedRegex.isInline = false;
export class InlineJs extends Token {} InlineJs.isInline = true;
export class FormattedJs extends Token {} FormattedJs.isInline = false;
export class InlineComment extends Token {}
export class FormattedComment extends Token {}
export class DashFunction extends Token {}
export class ArrowFunction extends Token {} ArrowFunction.expressionStartForbidden = true;
export class DiamondFunction extends Token {}
export class Arg extends Token {} Arg.canBeCalleeEnd = true;
export class NormalVariant extends Token {} NormalVariant.isJoint = true;
export class FunctionVariant extends Token {}
    FunctionVariant.canBeCalleeEnd = true;
    FunctionVariant.expressionStartForbidden = true;
export class Join extends Token {}
export class Pipe extends Token {} Pipe.isJoint = true;
export class FatDot extends Token {} FatDot.isJoint = true;
export class PostQuote extends Token {}
export class Stick extends Token {}
export class Question extends Token {}

export class Keyword extends Token {}
export class Above extends Keyword {}
export class And extends Keyword {} And.isJoint = true;
export class As extends Keyword {} As.isJoint = true;
export class Catch extends Keyword {} Catch.expressionStartForbidden = true;
export class Class extends Keyword {}
export class Delete extends Keyword {}
    Delete.isCommand = true;
    Delete.expressionStartForbidden = true;
export class Do extends Keyword {}
export class Else extends Keyword {} Else.expressionStartForbidden = true;
export class Export extends Keyword {}
    Export.isCommand = true;
    Export.expressionStartForbidden = true;
export class False extends Keyword {}
export class Finally extends Keyword {} Finally.expressionStartForbidden = true;
export class Fun extends Keyword {} Fun.canBeCalleeEnd = true;
export class If extends Keyword {}
export class Ifnull extends Keyword {} Ifnull.isJoint = true;
export class Ifvoid extends Keyword {} Ifvoid.isJoint = true;
export class Import extends Keyword {}
export class In extends Keyword {} In.isJoint = true;
export class Is extends Keyword {} Is.isJoint = true;
export class Isnt extends Keyword {} Isnt.isJoint = true;
export class Match extends Keyword {}
export class Me extends Keyword {}
export class ClassMe extends Keyword {} ClassMe.canBeCalleeEnd = true;
export class Mod extends Keyword {} Mod.isJoint = true;
export class New extends Keyword {}
export class Nonew extends Keyword {}
export class Not extends Keyword {}
export class Null extends Keyword {}
export class Or extends Keyword {} Or.isJoint = true;
export class Pause extends Keyword {}
    Pause.isCommand = true;
    Pause.expressionStartForbidden = true;
export class Rem extends Keyword {} Rem.isJoint = true;
export class Self extends Keyword {} Self.canBeCalleeEnd = true;
export class Super extends Keyword {} Super.canBeCalleeEnd = true;
export class Then extends Keyword {} Then.expressionStartForbidden = true;
export class Throw extends Keyword {}
    Throw.isCommand = true;
    Throw.expressionStartForbidden = true;
export class True extends Keyword {}
export class Try extends Keyword {}
export class Void extends Keyword {}

export class ExportAs extends Token {} ExportAs.isJoint = true;
export class NotIn extends Token {} NotIn.isJoint = true;
