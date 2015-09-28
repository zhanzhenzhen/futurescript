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
        this._round10();
        this._round11();
        this._round12();
        this._round13();
        this._round14();
    }

    _round1(raw) {
        let result = [];

        let pendingToken = null;

        let stringType = null;
        let stringInterpolationParenthesisLevel = null;
        let indentValue = null;
        let stringIndentValue = null;
        let stringIndentValueRemaining = null;
        let stringIndentFinished = false;
        let stringLine = {content: ""};

        let i = 0;
        while (i < raw.length) {
            let char = raw[i];

            // process length-unfixed tokens
            if (pendingToken instanceof VersionDirective) {
                if (char !== "\r" && char !== "\n") {
                    pendingToken.value += char;
                    i++;
                }
                else {
                    result.push(pendingToken);
                    pendingToken = null;
                }
            }
            else if (pendingToken instanceof Indent) {
                if (char === " " || char === "\t") {
                    pendingToken.value++;
                    i++;
                }
                else {
                    indentValue = pendingToken.value;
                    result.push(pendingToken);
                    pendingToken = null;
                }
            }
            else if (pendingToken instanceof Num) {
                if (char === "e" && (raw[i + 1] === "+" || raw[i + 1] === "-")) {
                    pendingToken.value += "e" + raw[i + 1];
                    i += 2;
                }
                else if (char.search(/[0-9A-Fa-fx.]/) !== -1) {
                    pendingToken.value += char;
                    i++;
                }
                else {
                    result.push(pendingToken);
                    pendingToken = null;
                }
            }
            else if (pendingToken instanceof Str) {
                let indentOffset = stringIndentValue - indentValue;
                if (!(char === "\"" && (
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
                        result.push(pendingToken);
                        result.push(new Plus());
                        result.push(new NormalLeftParenthesis());
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
                    result.push(pendingToken);
                    result.push(new RightParenthesis());
                    pendingToken = null;
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
                    result.push(pendingToken);
                    pendingToken = null;
                }
            }
            else if (pendingToken instanceof FormattedComment) {
                if (!(char === "#" && raw[i + 1] === "#" && raw[i + 2] === "#")) {
                    pendingToken.value += char;
                    i++;
                }
                else {
                    result.push(pendingToken);
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
                    result.push(pendingToken);
                    pendingToken = null;
                }
            }

            // recognize length-unfixed tokens: version directive
            else if (i === 0) {
                pendingToken = new VersionDirective(char);
                i++;
            }

            // recognize length-unfixed tokens: three characters
            else if (char === "j" && raw[i + 1] === "s" && raw[i + 2] === "\"") {
                if (raw[i + 3] === "\r" || raw[i + 3] === "\n") {
                    stringType = FormattedJs;
                    result.push(new FormattedJs());
                }
                else {
                    stringType = InlineJs;
                    result.push(new InlineJs());
                }
                result.push(new CallLeftParenthesis());
                pendingToken = new Str([]);
                pendingToken.type = stringType;
                pendingToken.isFirst = true;
                stringIndentValue = indentValue;
                i += 3;
            }
            else if (char === "#" && raw[i + 1] === "#" && raw[i + 2] === "#") {
                pendingToken = new FormattedComment("");
                i += 3;
            }

            // recognize length-unfixed tokens: double character
            else if (char === "v" && raw[i + 1] === "\"") {
                if (raw[i + 2] === "\r" || raw[i + 2] === "\n") {
                    stringType = FormattedVerbatimString;
                    result.push(new FormattedVerbatimString());
                }
                else {
                    stringType = InlineVerbatimString;
                    result.push(new InlineVerbatimString());
                }
                result.push(new CallLeftParenthesis());
                pendingToken = new Str([]);
                pendingToken.type = stringType;
                pendingToken.isFirst = true;
                stringIndentValue = indentValue;
                i += 2;
            }
            else if (char === "r" && raw[i + 1] === "\"") {
                if (raw[i + 2] === "\r" || raw[i + 2] === "\n") {
                    stringType = FormattedRegex;
                    result.push(new FormattedRegex());
                }
                else {
                    stringType = InlineRegex;
                    result.push(new InlineRegex());
                }
                result.push(new CallLeftParenthesis());
                pendingToken = new Str([]);
                pendingToken.type = stringType;
                pendingToken.isFirst = true;
                stringIndentValue = indentValue;
                i += 2;
            }

            // recognize length-fixed tokens: double character
            else if (char === "<" && raw[i + 1] === "<") {
                result.push(new LeftChevron());
                i += 2;
            }
            else if (char === ">" && raw[i + 1] === ">") {
                result.push(new RightChevron());
                i += 2;
            }
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
            else if (char === "|" && raw[i + 1] === ">") {
                result.push(new Pipe());
                i += 2;
            }
            else if (char === ":" && raw[i + 1] === ":") {
                result.push(new FatDot());
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
            else if (char === "*" && raw[i + 1] === "*") {
                result.push(new Power());
                i += 2;
            }

            // recognize length-unfixed tokens: single character
            else if (char === "\n") {
                pendingToken = new Indent(0);
                i++;
            }
            else if (char.search(/[0-9]/) !== -1) {
                pendingToken = new Num(char);
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
                result.push(new CallLeftParenthesis());
                pendingToken = new Str([]);
                pendingToken.type = stringType;
                pendingToken.isFirst = true;
                stringIndentValue = indentValue;
                i++;
            }
            else if (char === "#") {
                pendingToken = new InlineComment("");
                i++;
            }
            else if (char.search(/[A-Za-z_$]/) !== -1) {
                pendingToken = new NormalToken(char);
                i++;
            }

            // recognize length-fixed tokens: single character
            else if (char === ";") {
                result.push(new Semicolon());
                i++;
            }
            else if (char === ":") {
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
                if (stringType !== null) {
                    stringInterpolationParenthesisLevel++;
                }
                if (raw[i - 1].search(/[")@A-Za-z0-9_$]/) !== -1) {
                    result.push(new CallLeftParenthesis());
                }
                else {
                    result.push(new NormalLeftParenthesis());
                }
                i++;
            }
            else if (char === ")") {
                if (stringType !== null) {
                    stringInterpolationParenthesisLevel--;
                }
                if (stringType !== null && stringInterpolationParenthesisLevel === 0) {
                    result.push(new RightParenthesis());
                    result.push(new Plus());
                    stringInterpolationParenthesisLevel = null;
                    pendingToken = new Str([]);
                    pendingToken.type = stringType;
                }
                else {
                    result.push(new RightParenthesis());
                }
                i++;
            }
            else if (char === "[") {
                if (raw[i - 1].search(/[")@A-Za-z0-9_$]/) !== -1) {
                    result.push(new CallLeftBracket());
                }
                else {
                    result.push(new NormalLeftBracket());
                }
                i++;
            }
            else if (char === "]") {
                result.push(new RightBracket());
                i++;
            }
            else if (char === "{") {
                if (raw[i - 1].search(/[")@A-Za-z0-9_$]/) !== -1) {
                    result.push(new CallLeftBrace());
                }
                else {
                    result.push(new NormalLeftBrace());
                }
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
                if (
                    raw[i - 1].search(/[")\]}@A-Za-z0-9_$]/) === -1 &&
                    raw[i + 1] !== " " && raw[i + 1] !== "\t" &&
                    raw[i + 1] !== "\r" && raw[i + 1] !== "\n"
                ) {
                    result.push(new Positive());
                }
                else {
                    result.push(new Plus());
                }
                i++;
            }
            else if (char === "-") {
                if (
                    raw[i - 1].search(/[")\]}@A-Za-z0-9_$]/) === -1 &&
                    raw[i + 1] !== " " && raw[i + 1] !== "\t" &&
                    raw[i + 1] !== "\r" && raw[i + 1] !== "\n"
                ) {
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
            else if (char === "\\" && (raw[i + 1] === "\r" || raw[i + 1] === "\n")) {
                result.push(new Join());
                i++;
            }

            else {
                i++;
            }
        }
        this.value = result;
    }

    /*_round2() {
        let indentValue = null;
        this.value.forEach(token => {
            if (token instanceof Indent) {
                indentValue = token.value;
            }
            token.indentValue = indentValue;
        });
    }*/

    _round2() {
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

    _round3() {
        let newValue = [];
        this.value.forEach((token, index) => {
            if (token instanceof Str) {
                if (token.type.isInline) {
                    let s = "";
                    for (let i = 0; i < token.value.length; i++) {
                        s += " ".repeat(token.value[i].indentOffset) + token.value[i].content;
                    }
                    newValue.push(new Str(s));
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
                    newValue.push(new Str(arr.join("\\n")));
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

    _round5() {
        this._removeEmptyLines();
    }

    _round6() {
        let newValue = [];
        this.value.forEach((token, index) => {
            if (token instanceof InlineComment) {
            }
            else if (token instanceof VersionDirective) {
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
            else {
                newValue.push(token);
            }
        });
        this.value = newValue;
    }

    _round7() {
        this._removeEmptyLines();
    }

    // Each indent uses only 1 whitespace.
    _round8() {
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
    _round9() {
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
    _round10() {
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
    _round11() {
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
    _round12() {
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
    _round13() {
        let newValue = [];
        let stack = [];
        this.value.forEach((token, index) => {
            if (token instanceof LeftChevron) {
                if (newValue[newValue.length - 1] instanceof Join) {
                    newValue.pop();
                    stack.push(true);
                }
                else if (
                    this.value[index - 1] instanceof Colon ||
                    this.value[index - 1] instanceof NormalLeftParenthesis ||
                    this.value[index - 1] instanceof CallLeftParenthesis ||
                    this.value[index - 1] instanceof NormalLeftBracket ||
                    this.value[index - 1] instanceof CallLeftBracket ||
                    this.value[index - 1] instanceof NormalLeftBrace ||
                    this.value[index - 1] instanceof CallLeftBrace ||
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
                if (newValue[newValue.length - 1] instanceof Join) {
                    newValue.pop();
                }
                else if (
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

    // Remove incorrect ";" before "else" that's not in "match".
    _round14() {
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
export class LeftParenthesis extends Token {}
export class NormalLeftParenthesis extends LeftParenthesis {}
export class CallLeftParenthesis extends LeftParenthesis {}
export class RightParenthesis extends Token {}
export class LeftBracket extends Token {}
export class NormalLeftBracket extends LeftBracket {}
export class CallLeftBracket extends LeftBracket {}
export class RightBracket extends Token {}
export class LeftBrace extends Token {}
export class NormalLeftBrace extends LeftBrace {}
export class CallLeftBrace extends LeftBrace {}
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
export class Power extends Token {}
export class Positive extends Token {}
export class Negative extends Token {}
export class Num extends Token {}
export class Str extends Token {}
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
export class ArrowFunction extends Token {}
export class DiamondFunction extends Token {}
export class Arg extends Token {} Arg.canBeExpressionEnd = true;
export class NormalVariant extends Token {}
export class FunctionVariant extends Token {}
export class Join extends Token {}
export class Pipe extends Token {}
export class FatDot extends Token {}

export class Above extends Token {} Above.canBeExpressionEnd = true;
export class And extends Token {}
export class As extends Token {}
export class Catch extends Token {} Catch.canBeExpressionEnd = true;
export class Class extends Token {} Class.canBeExpressionEnd = true;
export class Delete extends Token {}
export class Do extends Token {}
export class Else extends Token {}
export class Export extends Token {}
export class False extends Token {} False.canBeExpressionEnd = true;
export class Finally extends Token {}
export class Fun extends Token {} Fun.canBeExpressionEnd = true;
export class If extends Token {}
export class Ifnull extends Token {}
export class Ifvoid extends Token {}
export class Import extends Token {}
export class In extends Token {}
export class Is extends Token {}
export class Isnt extends Token {}
export class Match extends Token {}
export class Me extends Token {} Me.canBeExpressionEnd = true;
export class ClassMe extends Token {} ClassMe.canBeExpressionEnd = true;
export class Mod extends Token {}
export class New extends Token {}
export class Nonew extends Token {}
export class Not extends Token {}
export class Null extends Token {} Null.canBeExpressionEnd = true;
export class Or extends Token {}
export class Rem extends Token {}
export class Self extends Token {} Self.canBeExpressionEnd = true;
export class Super extends Token {}
export class Then extends Token {}
export class Throw extends Token {}
export class True extends Token {} True.canBeExpressionEnd = true;
export class Try extends Token {} Try.canBeExpressionEnd = true;
export class Void extends Token {} Void.canBeExpressionEnd = true;

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

let canBeExpressionEnd = function(token) {
    if (
        token.constructor.canBeExpressionEnd ||
        token instanceof NormalToken ||
        token instanceof Num ||
        token instanceof Str ||
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
