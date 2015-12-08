// `isJoint=true` means the token can't be the start or end of something.
// That is, it must act as a "joint".

import * as $tools from "./c-tools-0.js";
import * as $lockedApi from "./locked-api.js";

export class Lex {
    // Both `raw` and `path` are optional, but at least one should exist.
    constructor(raw, path) {
        this.path = path;
        if (raw === undefined) {
            raw = $lockedApi.readTextFile(path);
        }
        this.raw = raw;

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
    }

    _round1() {
        let raw = this.raw;

        // Note: we can only append things to the raw end. If we modify raw's middle,
        // raw positions are lost.
        if (!raw.endsWith("\n")) {
            raw += "\n";
        }

        let result = [];
        let rawLinePositions = [0];

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

                // Must use `this.raw.length` not `raw.length`, for the last "\n" in
                // `raw` might be appended by program.
                if (i < this.raw.length - 1) {
                    rawLinePositions.push(i + 1);
                }

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
            else if (char === "<") {
                result.push(new LessThan().start(i).end(i));
                i++;
            }
            else if (char === ">") {
                result.push(new GreaterThan().start(i).end(i));
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
                result.push(new Then().start(i).end(i));
                i++;
            }
            else if (char === "|") {
                result.push(new Else().start(i).end(i));
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

        // This is a redundant property, just for source map.
        // Source map v3 uses line and column rather than character index.
        this._rawLinePositions = rawLinePositions;
    }

    // Check syntax error and let right-hand pair parts be more accurate.
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
                    newValue.push(token.replaceWith(arr.join("\\n")));
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

    _round7() {
        let newValue = [];
        this.value.forEach((token, index) => {
            if (token instanceof NormalToken) {
                let t = null;
                switch (token.value) {
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
                if (
                    t !== null &&
                    !(this.value[index - 1] instanceof Dot) &&
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
                    newValue.push(new t().copyPositionFrom(token));
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
                this.value[index - 1] instanceof NormalToken &&
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
            if (token instanceof Export && this.value[i + 1] instanceof As) {
                newValue.push(new ExportAs().start(i).end(i + 1));
                i += 2;
            }
            else if (token instanceof Not && this.value[i + 1] instanceof Equal) {
                newValue.push(new NotEqual().start(i).end(i + 1));
                i += 2;
            }
            else if (token instanceof Not && this.value[i + 1] instanceof In) {
                newValue.push(new NotIn().start(i).end(i + 1));
                i += 2;
            }
            else if (token instanceof Not && this.value[i + 1] instanceof Is) {
                newValue.push(new Isnt().start(i).end(i + 1));
                i += 2;
            }
            else if (token instanceof Is && this.value[i + 1] instanceof Not) {
                newValue.push(new Isnt().start(i).end(i + 1));
                i += 2;
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
        this.value.forEach((token, index) => {
            if (token instanceof InlineComment) {
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
            }
            else if (token instanceof Above) {
            }
            else {
                newValue.push(token);
            }
        });
        this.value = newValue;
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

    // Remove incorrect ";" before token that can't be statement start. But this doesn't
    // include "else" because "else" may appear in "match", where "else" can be after ";".
    _round19() {
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
    _round20() {
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

    _round21() {
        let newValue = [];
        let level = 0;
        this.value.forEach((token, index) => {
            if (
                token instanceof LeftChevron ||
                token instanceof LeftParenthesis ||
                token instanceof LeftBracket ||
                token instanceof LeftBrace
            ) {
                level++;
                newValue.push(token);
            }
            else if (
                token instanceof RightChevron ||
                token instanceof RightParenthesis ||
                token instanceof RightBracket ||
                token instanceof RightBrace
            ) {
                level--;
                newValue.push(token);
            }
            else if (
                level === 0 &&
                (index === 0 || this.value[index - 1] instanceof Semicolon) &&
                token instanceof NormalToken && token.value === "export" &&
                this.value[index + 1] instanceof Colon
            ) {
                newValue.push(new Export().copyPositionFrom(token));
            }
            else {
                newValue.push(token);
            }
        });
        this.value = newValue;
    }

    _round22() {
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

    toString() {
        return this.lex.toString(this);
    }
}

export class RawError extends $lockedApi.SyntaxError {
    // `rawPart` is a 2-element array: [start, end]
    constructor(rawPart, raw, message) {
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
    }
}

export class CharacterError extends RawError {
    constructor(rawPart, raw) {
        super(rawPart, raw, "Illegal character.");
    }
}

export class SyntaxError extends $lockedApi.SyntaxError {
    constructor(lexPart, message) {
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

        // Must use `rawPart` instead of `lexPart`, because this error may happen
        // in middle rounds of lex initialization, at which time lex will change.
        // This property is mostly used in test, where we must compare a "number literal"
        // with it. So this must be "middle round independent". Middle rounds shouldn't
        // affect test code as long as the functionality doesn't change.
        this.rawPart = [startIndex, endIndex];
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

    // Create a new instance with the same type, same position, but different value,
    // returning the new instance.
    replaceWith(value) {
        return new this.constructor(value).copyPositionFrom(this);
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

export class Above extends Token {}
export class And extends Token {} And.isJoint = true;
export class As extends Token {} As.isJoint = true;
export class Catch extends Token {} Catch.expressionStartForbidden = true;
export class Class extends Token {}
export class Delete extends Token {}
    Delete.isCommand = true;
    Delete.expressionStartForbidden = true;
export class Do extends Token {}
export class Else extends Token {} Else.expressionStartForbidden = true;
export class Export extends Token {}
    Export.isCommand = true;
    Export.expressionStartForbidden = true;
export class False extends Token {}
export class Finally extends Token {} Finally.expressionStartForbidden = true;
export class Fun extends Token {} Fun.canBeCalleeEnd = true;
export class If extends Token {}
export class Ifnull extends Token {} Ifnull.isJoint = true;
export class Ifvoid extends Token {} Ifvoid.isJoint = true;
export class Import extends Token {}
export class In extends Token {} In.isJoint = true;
export class Is extends Token {} Is.isJoint = true;
export class Isnt extends Token {} Isnt.isJoint = true;
export class Match extends Token {}
export class Me extends Token {}
export class ClassMe extends Token {} ClassMe.canBeCalleeEnd = true;
export class Mod extends Token {} Mod.isJoint = true;
export class New extends Token {}
export class Nonew extends Token {}
export class Not extends Token {} Not.isJoint = true;
export class Null extends Token {}
export class Or extends Token {} Or.isJoint = true;
export class Pause extends Token {}
    Pause.isCommand = true;
    Pause.expressionStartForbidden = true;
export class Rem extends Token {} Rem.isJoint = true;
export class Self extends Token {} Self.canBeCalleeEnd = true;
export class Super extends Token {} Super.canBeCalleeEnd = true;
export class Then extends Token {} Then.expressionStartForbidden = true;
export class Throw extends Token {}
    Throw.isCommand = true;
    Throw.expressionStartForbidden = true;
export class True extends Token {}
export class Try extends Token {}
export class Void extends Token {}

export class ExportAs extends Token {} ExportAs.isJoint = true;
export class NotIn extends Token {} NotIn.isJoint = true;
