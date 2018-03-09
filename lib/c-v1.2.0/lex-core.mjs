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

            this._massiveRounds();
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

            // recognize length-fixed tokens: three characters
            else if (char === "." && raw[i + 1] === "." && raw[i + 2] === ".") {
                result.push(new Spread().start(i).end(i + 2));
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
export class Spread extends Token {} Spread.expressionStartForbidden = true;

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
