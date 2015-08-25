export class Lex {
    constructor(raw) {
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
            else if (pendingToken instanceof Token) {
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
                    pendingToken = new Token(char);
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
                    result.push(new Plus());
                }
                else if (raw[i - 1] !== "-" && char === "-" && raw[i + 1] !== "-" && raw[i + 1] !== ">") {
                    result.push(new Minus());
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

class Token {
    constructor(value) {
        if (value !== undefined) {
            this.value = value;
        }
    }
}

class VersionDirective extends Token {}
class Indent extends Token {}
class LeftParenthesis extends Token {}
class NormalLeftParenthesis extends LeftParenthesis {}
class CallLeftParenthesis extends LeftParenthesis {}
class RightParenthesis extends Token {}
class LeftBracket extends Token {}
class RightBracket extends Token {}
class LeftBrace extends Token {}
class RightBrace extends Token {}
class Comma extends Token {}
class Dot extends Token {}
class Colon extends Token {}
class Equal extends Token {}
class NotEqual extends Token {}
class LessThan extends Token {}
class GreaterThan extends Token {}
class LessThanOrEqual extends Token {}
class GreaterThanOrEqual extends Token {}
class Plus extends Token {}
class Minus extends Token {}
class Times extends Token {}
class Over extends Token {}
class Num extends Token {}
class Str extends Token {}
class NormalStringStart extends Token {}
class NormalStringEnd extends Token {}
class NormalComment extends Token {}
class DashFunction extends Token {}
class ArrowFunction extends Token {}
class DiamondFunction extends Token {}
