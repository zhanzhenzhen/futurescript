import * as $lex from "./lex.js";

let Lex = $lex.Lex;

// Check syntax error and let right-hand pair parts be more accurate.
// For example "CallLeftParenthesis, ... , RightParenthesis" will be normalized to
// "CallLeftParenthesis, ... , CallRightParenthesis".
Lex.prototype._round2 = function() {
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
};

Lex.prototype._round3 = function() {
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
};

Lex.prototype._round4 = function() {
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
};

// This will add a parenthesis wrapper to make it easier to parse later.
Lex.prototype._round5 = function() {
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
};

// This will add a parenthesis wrapper to make things like `a.0` easier to parse later.
Lex.prototype._round6 = function() {
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
};

Lex.prototype._detectKeyword = function(normalToken) {
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
};

Lex.prototype._round7 = function() {
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
};

Lex.prototype._round8 = function() {
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
};

Lex.prototype._round9 = function() {
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
};

Lex.prototype._removeEmptyLines = function() {
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
};

Lex.prototype._round10 = function() {
    this._removeEmptyLines();
};

Lex.prototype._round11 = function() {
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
};

Lex.prototype._round12 = function() {
    this._removeEmptyLines();
};

// Each indent uses only 1 whitespace.
Lex.prototype._round13 = function() {
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
};

// Normalize indents to all use inline "<<" and ">>" and ";".
Lex.prototype._round14 = function() {
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
};

// Add necessary ";".
Lex.prototype._round15 = function() {
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
};

// Remove redundant ";".
Lex.prototype._round16 = function() {
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
};

// Remove redundant ";".
Lex.prototype._round17 = function() {
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

{a: 2, b: 3}

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
};

// Remove ";" if "," is before ";".
Lex.prototype._round19 = function() {
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
};

// Remove incorrect ";" before token that can't be statement start. But this doesn't
// include "else" because "else" may appear in "match", where "else" can be after ";".
Lex.prototype._round20 = function() {
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
};

// Remove incorrect ";" before "else" that's not in "match".
Lex.prototype._round21 = function() {
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
};

// We will call this method not only once. Because some operations will change the tokens,
// we need to call it to update the container.
Lex.prototype._fillBraceContainers = function() {
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
};

Lex.prototype._round23 = function() {
    this._fillBraceContainers();
};

// Check every brace container to find if it's exotic or not.
Lex.prototype._round24 = function() {
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
};

// For exotic brace, remove commas and semicolons and convert keyword to its original `NormalToken`
// form.
Lex.prototype._round25 = function() {
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
};

Lex.prototype._round31 = function() {
    let newValue = [this._versionDirective];
    this.value.forEach(token => {
        newValue.push(token);
    });
    this.value = newValue;
};
