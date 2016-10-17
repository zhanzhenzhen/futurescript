import * as $tools from "./tools.js";
import * as $lex from "./lex-core.js";

let Lex = $lex.Lex;

Lex.prototype._massiveRounds = function() {
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
    this._round32();
};

// Check syntax error and let right-hand pair parts be more accurate.
// For example "CallLeftParenthesis, ... , RightParenthesis" will be normalized to
// "CallLeftParenthesis, ... , CallRightParenthesis".
Lex.prototype._round2 = function() {
    let newValue = [];
    let stack = [];
    let opposite = left => {
        if (left === $lex.LeftParenthesis) {
            return $lex.RightParenthesis;
        }
        else if (left === $lex.NormalLeftParenthesis) {
            return $lex.NormalRightParenthesis;
        }
        else if (left === $lex.CallLeftParenthesis) {
            return $lex.CallRightParenthesis;
        }
        else if (left === $lex.PseudoCallLeftParenthesis) {
            return $lex.PseudoCallRightParenthesis;
        }
        else if (left === $lex.LeftBracket) {
            return $lex.RightBracket;
        }
        else if (left === $lex.NormalLeftBracket) {
            return $lex.NormalRightBracket;
        }
        else if (left === $lex.CallLeftBracket) {
            return $lex.CallRightBracket;
        }
        else if (left === $lex.LeftBrace) {
            return $lex.RightBrace;
        }
        else if (left === $lex.NormalLeftBrace) {
            return $lex.NormalRightBrace;
        }
        else if (left === $lex.CallLeftBrace) {
            return $lex.CallRightBrace;
        }
        else if (left === $lex.LeftChevron) {
            return $lex.RightChevron;
        }
        else {
            throw new Error("No opposite.");
        }
    };
    this.value.forEach((token, index) => {
        if (
            token instanceof $lex.LeftParenthesis ||
            token instanceof $lex.LeftBracket ||
            token instanceof $lex.LeftBrace ||
            token instanceof $lex.LeftChevron
        ) {
            stack.push({index: index, opposite: opposite(token.constructor)});
            newValue.push(token);
        }
        else if (
            token instanceof $lex.RightParenthesis ||
            token instanceof $lex.RightBracket ||
            token instanceof $lex.RightBrace ||
            token instanceof $lex.RightChevron
        ) {
            if (stack.length === 0) {
                throw new $lex.PunctuationPairError(this.part(index, index));
            }
            else if (token.constructor === stack[stack.length - 1].opposite) {
                newValue.push(token);
                stack.pop();
            }
            else if ($tools.classIsClass(stack[stack.length - 1].opposite, token.constructor)) {
                newValue.push(new stack[stack.length - 1].opposite().copyPositionFrom(token));
                stack.pop();
            }
            else {
                throw new $lex.PunctuationPairError(this.part(stack[stack.length - 1].index, index));
            }
        }
        else {
            newValue.push(token);
        }
    });
    if (stack.length > 0) {
        throw new $lex.PunctuationPairError(this.part(stack[stack.length - 1].index, this.count() - 1));
    }
    this.value = newValue;
};

Lex.prototype._round3 = function() {
    let min = null;
    let arr = null;
    this.value.forEach((token, index) => {
        if (token instanceof $lex.Str && !token.type.isInline) {
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
};

Lex.prototype._round4 = function() {
    let newValue = [];
    this.value.forEach((token, index) => {
        if (token instanceof $lex.Str) {
            if (token.type.isInline) {
                let s = "";
                for (let i = 0; i < token.value.length; i++) {
                    if (i === 0 && this.value[index - 1] instanceof $lex.Plus) {
                        s += token.value[i].content;
                    }
                    else {
                        s += " ".repeat(token.value[i].indentOffset) + token.value[i].content;
                    }
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
                    let s = null;
                    if (i === 0 && this.value[index - 1] instanceof $lex.Plus) {
                        s = token.value[i].content;
                    }
                    else {
                        s = " ".repeat(spaceCount) + token.value[i].content;
                    }
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
};

// This will add a parenthesis wrapper to make it easier to parse later.
Lex.prototype._round5 = function() {
    let newValue = [];
    let level = null;
    this.value.forEach((token, index) => {
        if (this.value[index - 1] instanceof $lex.Dot && token instanceof $lex.InlineNormalString) {
            newValue.push(new $lex.NormalLeftParenthesis());
            newValue.push(token);
            level = 0;
        }
        else if (level !== null && token instanceof $lex.LeftParenthesis) {
            newValue.push(token);
            level++;
        }
        else if (level !== null && token instanceof $lex.RightParenthesis) {
            newValue.push(token);
            level--;
            if (level === 0) {
                newValue.push(new $lex.NormalRightParenthesis());
                level = null;
            }
        }
        else {
            newValue.push(token);
        }
    });
    this.value = newValue;
};

// This will add a parenthesis wrapper to make things like `a.0` easier to parse later.
Lex.prototype._round6 = function() {
    let newValue = [];
    this.value.forEach((token, index) => {
        if (this.value[index - 1] instanceof $lex.Dot && token instanceof $lex.Num) {
            newValue.push(new $lex.NormalLeftParenthesis());
            newValue.push(token);
            newValue.push(new $lex.NormalRightParenthesis());
        }
        else {
            newValue.push(token);
        }
    });
    this.value = newValue;
};

Lex.prototype._detectKeyword = function(normalToken) {
    let t = null;
    switch (normalToken.value) {
        case "above":
            t = $lex.Above; break;
        case "and":
            t = $lex.And; break;
        case "as":
            t = $lex.As; break;
        case "catch":
            t = $lex.Catch; break;
        case "class":
            t = $lex.Class; break;
        case "delete":
            t = $lex.Delete; break;
        case "do":
            t = $lex.Do; break;
        case "else":
            t = $lex.Else; break;
        case "export":
            t = $lex.Export; break;
        case "false":
            t = $lex.False; break;
        case "finally":
            t = $lex.Finally; break;
        case "fun":
            t = $lex.Fun; break;
        case "if":
            t = $lex.If; break;
        case "ifnull":
            t = $lex.Ifnull; break;
        case "ifvoid":
            t = $lex.Ifvoid; break;
        case "import":
            t = $lex.Import; break;
        case "in":
            t = $lex.In; break;
        case "is":
            t = $lex.Is; break;
        case "isnt":
            t = $lex.Isnt; break;
        case "match":
            t = $lex.Match; break;
        case "me":
            t = $lex.Me; break;
        case "Me":
            t = $lex.ClassMe; break;
        case "mod":
            t = $lex.Mod; break;
        case "new":
            t = $lex.New; break;
        case "nonew":
            t = $lex.Nonew; break;
        case "not":
            t = $lex.Not; break;
        case "null":
            t = $lex.Null; break;
        case "or":
            t = $lex.Or; break;
        case "pause":
            t = $lex.Pause; break;
        case "rem":
            t = $lex.Rem; break;
        case "self":
            t = $lex.Self; break;
        case "super":
            t = $lex.Super; break;
        case "then":
            t = $lex.Then; break;
        case "throw":
            t = $lex.Throw; break;
        case "true":
            t = $lex.True; break;
        case "try":
            t = $lex.Try; break;
        case "void":
            t = $lex.Void; break;
    }
    return t;
};

Lex.prototype._round7 = function() {
    let newValue = [];
    this.value.forEach((token, index) => {
        if (token instanceof $lex.NormalToken) {
            let t = this._detectKeyword(token);
            if (
                t !== null &&
                !(this.value[index - 1] instanceof $lex.Dot) &&
                !(this.value[index - 1] instanceof $lex.NormalVariant) &&
                !(
                    this.value[index + 1] instanceof $lex.Colon || (
                        this.value[index + 1] instanceof $lex.NormalVariant &&
                        this.value[index + 3] instanceof $lex.Colon
                    ) || (
                        this.value[index + 1] instanceof $lex.NormalVariant &&
                        this.value[index + 3] instanceof $lex.NormalVariant &&
                        this.value[index + 5] instanceof $lex.Colon
                    )
                ) &&
                !(
                    newValue[newValue.length - 1] instanceof $lex.As && (
                        newValue[newValue.length - 2] instanceof $lex.Export || (
                            newValue[newValue.length - 3] instanceof $lex.Export &&
                            newValue[newValue.length - 2] instanceof $lex.NormalToken
                        )
                    )
                )
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
};

Lex.prototype._round8 = function() {
    let newValue = [];
    this.value.forEach((token, index) => {
        if (
            (
                this.value[index - 1] instanceof $lex.NormalToken ||
                this.value[index - 1] instanceof $lex.RightBracket
            ) &&
            token instanceof $lex.NormalToken &&
            this.value[index + 1] instanceof $lex.Colon
        ) {
            if (token.value === "ifvoid") {
                newValue.push(new $lex.Ifvoid().copyPositionFrom(token));
            }
            else if (token.value === "ifnull") {
                newValue.push(new $lex.Ifnull().copyPositionFrom(token));
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
};

Lex.prototype._round9 = function() {
    let newValue = [];
    let i = 0;
    while (i < this.value.length) {
        let token = this.value[i];
        let next = this.value[i + 1];
        if (token instanceof $lex.Export && next instanceof $lex.As) {
            newValue.push(new $lex.ExportAs().start(i).end(i + 1).setOriginalTokens([token, next]));
            i += 2;
        }
        else if (token instanceof $lex.Not && next instanceof $lex.Equal) {
            newValue.push(new $lex.NotEqual().start(i).end(i + 1).setOriginalTokens([token, next]));
            i += 2;
        }
        else if (token instanceof $lex.Not && next instanceof $lex.In) {
            newValue.push(new $lex.NotIn().start(i).end(i + 1).setOriginalTokens([token, next]));
            i += 2;
        }
        else if (token instanceof $lex.Not && next instanceof $lex.Is) {
            newValue.push(new $lex.Isnt().start(i).end(i + 1).setOriginalTokens([token, next]));
            i += 2;
        }
        else if (token instanceof $lex.Is && next instanceof $lex.Not) {
            newValue.push(new $lex.Isnt().start(i).end(i + 1).setOriginalTokens([token, next]));
            i += 2;
        }
        else if (token instanceof $lex.Question) {
            newValue.push(new $lex.Then().copyPositionFrom(token).setOriginalTokens([token]));
            i++;
        }
        else if (token instanceof $lex.Stick) {
            newValue.push(new $lex.Else().copyPositionFrom(token).setOriginalTokens([token]));
            i++;
        }
        else {
            newValue.push(token);
            i++;
        }
    }
    this.value = newValue;
};

Lex.prototype._removeEmptyLines = function() {
    let newValue = [];
    this.value.forEach((token, index) => {
        if (token instanceof $lex.Indent && (
            index === this.value.length - 1 || this.value[index + 1] instanceof $lex.Indent
        )) {
        }
        else {
            newValue.push(token);
        }
    });
    this.value = newValue;
};

Lex.prototype._round10 = function() {
    this._removeEmptyLines();
};

Lex.prototype._round11 = function() {
    let newValue = [];
    let ignoredTokens = [];
    this.value.forEach((token, index) => {
        if (token instanceof $lex.InlineComment) {
            ignoredTokens.push(token);
        }

        // Removing version directive is temporary, and just for simplification.
        // In the final round we will recover version directive.
        else if (token instanceof $lex.VersionDirective) {
            this._versionDirective = token;
        }

        else if (
            token instanceof $lex.FormattedComment &&
            !(
                this.value[index - 2] instanceof $lex.VersionDirective &&
                this.value[index - 1] instanceof $lex.Indent &&
                (index === this.value.length - 1 || this.value[index + 1] instanceof $lex.Indent)
            )
        ) {
            ignoredTokens.push(token);
        }
        else if (token instanceof $lex.Above) {
            ignoredTokens.push(token);
        }
        else {
            newValue.push(token);
        }
    });
    this.value = newValue;
    this.ignoredTokens = ignoredTokens;
};

Lex.prototype._round12 = function() {
    this._removeEmptyLines();
};

// Each indent uses only 1 whitespace.
Lex.prototype._round13 = function() {
    let newValue = [];
    let stack = [];
    this.value.forEach((token, index) => {
        if (token instanceof $lex.Indent) {
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
                    throw new $lex.IndentError(this.part(index, index));
                }
            }
        }
        else {
            newValue.push(token);
        }
    });
    this.value = newValue;
};

// Normalize indents to all use inline "<<" and ">>" and ";".
Lex.prototype._round14 = function() {
    let newValue = [];
    let oldIndentValue = 0;
    this.value.forEach((token, index) => {
        if (token instanceof $lex.Indent) {
            if (token.value > oldIndentValue) {
                newValue.push(new $lex.LeftChevron().copyPositionFrom(token));
                oldIndentValue = token.value;
            }
            else if (token.value < oldIndentValue) {
                for (let i = 0; i < oldIndentValue - token.value; i++) {
                    newValue.push(new $lex.RightChevron().copyPositionFrom(token));
                }
                if (!(
                    this.value[index + 1] instanceof $lex.RightParenthesis ||
                    this.value[index + 1] instanceof $lex.RightBracket ||
                    this.value[index + 1] instanceof $lex.RightBrace
                )) {
                    newValue.push(new $lex.Semicolon());
                }
                oldIndentValue = token.value;
            }
            else if (newValue.length !== 0) {
                newValue.push(new $lex.Semicolon());
            }
        }
        else {
            newValue.push(token);
        }
    });
    for (let i = 0; i < oldIndentValue; i++) {
        newValue.push(new $lex.RightChevron());
    }
    this.value = newValue;
};

// Add necessary ";".
Lex.prototype._round15 = function() {
    let newValue = [];
    this.value.forEach((token, index) => {
        newValue.push(token);
        if (
            token instanceof $lex.RightChevron &&
            !(this.value[index + 1] instanceof $lex.RightChevron) &&
            !(this.value[index + 1] instanceof $lex.Semicolon) &&
            !(this.value[index + 1] instanceof $lex.RightParenthesis) &&
            !(this.value[index + 1] instanceof $lex.RightBracket) &&
            !(this.value[index + 1] instanceof $lex.RightBrace) &&
            index !== this.value.length - 1
        ) {
            newValue.push(new $lex.Semicolon());
        }
    });
    this.value = newValue;
};

// Remove redundant ";".
Lex.prototype._round16 = function() {
    let newValue = [];
    this.value.forEach((token, index) => {
        if (token instanceof $lex.Semicolon) {
            if (this.value[index - 1] instanceof $lex.Semicolon) {
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
};

// Remove redundant ";".
Lex.prototype._round17 = function() {
    let newValue = [];
    this.value.forEach((token, index) => {
        if (token instanceof $lex.Semicolon) {
            if (index === 0) {
            }
            else if (index === this.value.length - 1) {
            }
            else if (this.value[index - 1] instanceof $lex.LeftChevron) {
            }
            else if (this.value[index + 1] instanceof $lex.RightChevron) {
            }
            else if (this.value[index - 1] instanceof $lex.LeftBrace) {
            }
            else if (this.value[index + 1] instanceof $lex.RightBrace) {
            }
            else if (this.value[index - 1] instanceof $lex.LeftBracket) {
            }
            else if (this.value[index + 1] instanceof $lex.RightBracket) {
            }
            else if (this.value[index - 1] instanceof $lex.LeftParenthesis) {
            }
            else if (this.value[index + 1] instanceof $lex.RightParenthesis) {
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
};

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

{a: 2, b: 3} (This is just JS equivalent. It's actually normalized to {a: 2; b: 3}.)

Function calls like:

a(
    1
    2
)

Normalized to:

a(1, 2) (This is just JS equivalent. It's actually normalized to a(1; 2).)

Note that we don't remove empty chevron pair, because empty chevron pair can be nested,
like "<< << >> << >> >>", removing it will be too complicated. Also, "(())"
isn't stripped, so there's no reason to strip empty chevrons.
*/
Lex.prototype._round18 = function() {
    let newValue = [];
    let stack = [];
    this.value.forEach((token, index) => {
        let prev = this.value[index - 1];
        let next = this.value[index + 1];
        if (token instanceof $lex.LeftChevron) {
            if (newValue[newValue.length - 1] instanceof $lex.Join) {
                newValue.pop();
                stack.push(true);
            }
            else if (
                prev instanceof $lex.LeftParenthesis ||
                prev instanceof $lex.LeftBracket ||
                prev instanceof $lex.LeftBrace ||
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
        else if (token instanceof $lex.RightChevron) {
            if (stack.pop()) {
            }
            else {
                newValue.push(token);
            }
        }
        else if (token instanceof $lex.Semicolon) {
            if (newValue[newValue.length - 1] instanceof $lex.Join) {
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
};

// Remove ";" if "," is before ";".
Lex.prototype._round19 = function() {
    let newValue = [];
    this.value.forEach((token, index) => {
        if (
            this.value[index - 1] instanceof $lex.Comma &&
            token instanceof $lex.Semicolon
        ) {
        }
        else {
            newValue.push(token);
        }
    });
    this.value = newValue;
};

// Remove incorrect ";" before token that can't be statement start. But this doesn't
// include "else" because "else" may appear in "match", where "else" can be after ";".
Lex.prototype._round20 = function() {
    let newValue = [];
    this.value.forEach((token, index) => {
        if (
            token instanceof $lex.Semicolon &&
            this.value[index + 1].constructor.expressionStartForbidden &&
            !this.value[index + 1].constructor.isCommand &&
            !(this.value[index + 1] instanceof $lex.Else)
        ) {
        }
        else {
            newValue.push(token);
        }
    });
    this.value = newValue;
};

// Remove incorrect ";" before "else" that's not in "match".
Lex.prototype._round21 = function() {
    let newValue = [];
    let stack = [];
    this.value.forEach((token, index) => {
        if (token instanceof $lex.Match) {
            stack.push({position: index, kind: $lex.Match});
            newValue.push(token);
        }
        else if (token instanceof $lex.LeftChevron) {
            stack.push({position: index, kind: $lex.LeftChevron});
            newValue.push(token);
        }
        else if (token instanceof $lex.LeftParenthesis) {
            stack.push({position: index, kind: $lex.LeftParenthesis});
            newValue.push(token);
        }
        else if (token instanceof $lex.LeftBracket) {
            stack.push({position: index, kind: $lex.LeftBracket});
            newValue.push(token);
        }
        else if (token instanceof $lex.LeftBrace) {
            stack.push({position: index, kind: $lex.LeftBrace});
            newValue.push(token);
        }
        else if (
            token instanceof $lex.RightChevron ||
            token instanceof $lex.RightParenthesis ||
            token instanceof $lex.RightBracket ||
            token instanceof $lex.RightBrace
        ) {
            if (stack[stack.length - 1].kind === $lex.Match) {
                throw new $lex.MatchNoBodyError(this.part(stack[stack.length - 1].position, index));
            }
            stack.pop();
            if (
                token instanceof $lex.RightChevron &&
                stack.length > 0 &&
                stack[stack.length - 1].kind === $lex.Match
            ) {
                stack.pop();
            }
            newValue.push(token);
        }
        else if (token instanceof $lex.Semicolon && this.value[index + 1] instanceof $lex.Else) {
            if (
                stack.length >= 2 &&
                stack[stack.length - 2].kind === $lex.Match &&
                stack[stack.length - 1].kind === $lex.LeftChevron
            ) {
                newValue.push(token);
            }
        }
        else {
            newValue.push(token);
        }
    });
    this.value = newValue;
};

// Two features: Mark levels and containers, and correct the default export token.
// This is also the beginning period of processing flexible objects.
// Note: We set many properties of tokens in this method, but these properties are
// just for temporary use. Other modules should not use them.
Lex.prototype._round22 = function() {
    let newValue = [];
    let level = 0;
    let stack = [null];

    // Brace container doesn't mean brace's container, but the container is brace type.
    this._braceContainers = [];

    this.value.forEach((token, index) => {
        if (
            token instanceof $lex.LeftChevron ||
            token instanceof $lex.LeftParenthesis ||
            token instanceof $lex.LeftBracket ||
            token instanceof $lex.LeftBrace
        ) {
            token.level = level;
            token.container = stack[stack.length - 1];
            level++;
            if (token instanceof $lex.LeftChevron) {
                stack.push({type: $lex.Chevron});
            }
            else if (token instanceof $lex.LeftParenthesis) {
                stack.push({type: $lex.Parenthesis});
            }
            else if (token instanceof $lex.LeftBracket) {
                stack.push({type: $lex.Bracket});
            }
            else if (token instanceof $lex.LeftBrace) {
                let container = {type: $lex.Brace};
                stack.push(container);
                this._braceContainers.push(container);
            }
            stack[stack.length - 1].leftIndex = index; // the left wrapper, like `{`
            stack[stack.length - 1].leftToken = token;
            token.selfContainer = stack[stack.length - 1]; // only wrapper tokens have `selfContainer`
            newValue.push(token);
        }
        else if (
            token instanceof $lex.RightChevron ||
            token instanceof $lex.RightParenthesis ||
            token instanceof $lex.RightBracket ||
            token instanceof $lex.RightBrace
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
            (index === 0 || this.value[index - 1] instanceof $lex.Semicolon) &&
            token instanceof $lex.NormalToken && token.value === "export" &&
            this.value[index + 1] instanceof $lex.Colon
        ) {
            let newToken = new $lex.Export().copyPositionFrom(token);
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
};

// We will call this method not only once. Because some operations will change the tokens,
// we need to call it to update the container.
Lex.prototype._fillBraceContainers = function() {
    this._braceContainers.forEach(container => {
        container.tokens = [];
    });
    this.value.forEach((token, index) => {
        token.index = index;
        if (token.container !== null && token.container.type === $lex.Brace) {
            token.container.tokens.push(token);
        }
        if (token.selfContainer !== undefined) {
            if (token instanceof $lex.LeftBrace) {
                token.selfContainer.leftIndex = index;
                token.selfContainer.leftToken = token;
            }
            else if (token instanceof $lex.RightBrace) {
                token.selfContainer.rightIndex = index;
                token.selfContainer.rightToken = token;
            }
        }
    });
    this._braceContainers.forEach(container => {
        if (container.exotic) {
            let functionPos = container.tokens.findIndex(m =>
                m instanceof $lex.ArrowFunction ||
                m instanceof $lex.DashFunction ||
                m instanceof $lex.DiamondFunction
            );
            container.exoticEndInternalIndex =
                functionPos === -1 ? container.tokens.length - 1 : functionPos;
        }
    });
};

Lex.prototype._round23 = function() {
    this._fillBraceContainers();
};

// Check every brace container to find if it's exotic or not.
Lex.prototype._round24 = function() {
    this._braceContainers.forEach(container => {
        if (
            container !== null && container.type === $lex.Brace &&
            !(this.value[container.leftIndex - 1] instanceof $lex.As) &&
            !(this.value[container.rightIndex + 1] instanceof $lex.Colon)
        ) {
            container.isExpression = true;
            if (container.tokens.some(m => m instanceof $lex.Colon)) {
                container.exotic = false;
            }
            else {
                let splitterPos = -1;
                for (let i = 0; i < container.tokens.length; i++) {
                    let token = container.tokens[i];
                    if (
                        i === container.tokens.length - 1 ||
                        token instanceof $lex.Comma ||
                        token instanceof $lex.Semicolon
                    ) {
                        // If it's at the end, there will be no comma or semicolon so the limit
                        // should be subtracted by 1.
                        let limit = i === container.tokens.length - 1 ? 1 : 2;

                        if (i - splitterPos > limit) {
                            container.exotic = true;
                            let functionPos = container.tokens.findIndex(m =>
                                m instanceof $lex.ArrowFunction ||
                                m instanceof $lex.DashFunction ||
                                m instanceof $lex.DiamondFunction
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
};

// For exotic brace, remove commas and semicolons and convert keyword to its original `NormalToken`
// form.
Lex.prototype._round25 = function() {
    let newValue = [];
    this.value.forEach((token, index) => {
        if (
            token.container !== null && token.container.type === $lex.Brace &&
            token.container.isExpression && token.container.exotic
        ) {
            if (token instanceof $lex.Comma || token instanceof $lex.Semicolon) {
            }
            else if (
                index <= token.container.tokens[token.container.exoticEndInternalIndex].index &&
                token.getOriginalTokens() !== null &&
                token.getOriginalTokens().some(m => m instanceof $lex.NormalToken)
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
};

Lex.prototype._round26 = function() {
    this._fillBraceContainers();
};

// This will enable all tokens to act like a linked list. Useful in next round,
// because in next round tokens will be traversed, modified or inserted not in order.
Lex.prototype._round27 = function() {
    this.value.forEach((token, index) => {
        if (index === this.value.length - 1) {
            token.next = null;
        }
        else {
            token.next = this.value[index + 1];
        }
    });
};

// This is the core round of processing flexible objects.
Lex.prototype._round28 = function() {
    this._braceContainers.forEach(container => {
        if (container.isExpression) {
            if (container.exotic) {
                let isKey = false;
                for (let i = container.exoticEndInternalIndex; i >= 1; i--) {
                    if (
                        (isKey && container.tokens[i] instanceof $lex.NormalToken) ||
                        (
                            !isKey &&
                            container.tokens[i - 1] instanceof $lex.NormalToken &&
                            !container.tokens[i].constructor.isJoint &&
                            !(
                                container.tokens[i] instanceof $lex.CallLeftParenthesis ||
                                container.tokens[i] instanceof $lex.CallLeftBracket ||
                                container.tokens[i] instanceof $lex.CallLeftBrace ||
                                container.tokens[i] instanceof $lex.LeftChevron
                            ) &&
                            !container.tokens[i].constructor.expressionStartForbidden
                        )
                    ) {
                        if (isKey) {
                            let newToken = new $lex.Comma();
                            newToken.next = container.tokens[i];
                            container.tokens[i - 1].next = newToken;
                        }
                        else {
                            let newToken = new $lex.Colon();
                            newToken.next = container.tokens[i];
                            container.tokens[i - 1].next = newToken;
                            container.tokens[i - 1].isProbablyKeyword = false;
                        }
                        isKey = !isKey; // switch between key and value
                    }
                }
                if (!isKey) { // if the total number of keys and values is odd
                    let inlineNormalString = new $lex.InlineNormalString();
                    let pseudoCallLeftParenthesis = new $lex.PseudoCallLeftParenthesis();
                    let str = new $lex.Str("");
                    let pseudoCallRightParenthesis = new $lex.PseudoCallRightParenthesis();
                    let colon = new $lex.Colon();
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
                        token instanceof $lex.Comma ||
                        token instanceof $lex.Semicolon ||
                        token === this.value[container.rightIndex]
                    ) {
                        if (!hasColon) {
                            let newColon = new $lex.Colon();
                            let newTrue = new $lex.True();
                            newColon.next = newTrue;
                            newTrue.next = token;
                            if (container.tokens[index - 1] instanceof $lex.Keyword) {
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
                    else if (token instanceof $lex.Colon) {
                        hasColon = true;
                    }
                });
            }
        }
    });
};

Lex.prototype._round29 = function() {
    if (this.value.length === 0) return;
    let newValue = [];
    let token = this.value[0];
    while (token !== null) {
        newValue.push(token);
        token = token.next;
    }
    this.value = newValue;
};

// Recover all keyword-like tokens that's not keys to be keywords again in exotic brace.
// This is the end of processing flexible objects.
Lex.prototype._round30 = function() {
    let newValue = [];
    this.value.forEach((token, index) => {
        if (token instanceof $lex.NormalToken && token.isProbablyKeyword) {
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
};

Lex.prototype._round31 = function() {
    let newValue = [this._versionDirective];
    this.value.forEach(token => {
        newValue.push(token);
    });
    this.value = newValue;
};

// `oppositeIndex` property will be used by parser to scan fast.
Lex.prototype._round32 = function() {
    let stack = [];
    this.value.forEach((token, index) => {
        if (
            token instanceof $lex.LeftChevron ||
            token instanceof $lex.LeftParenthesis ||
            token instanceof $lex.LeftBracket ||
            token instanceof $lex.LeftBrace
        ) {
            stack.push([token, index]);
        }
        else if (
            token instanceof $lex.RightChevron ||
            token instanceof $lex.RightParenthesis ||
            token instanceof $lex.RightBracket ||
            token instanceof $lex.RightBrace
        ) {
            stack[stack.length - 1][0].oppositeIndex = index;
            token.oppositeIndex = stack[stack.length - 1][1];
            stack.pop();
        }
    });
};
