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
            else if (pendingToken instanceof Token) {
                if (char.search(/[A-Za-z0-9]/) !== -1) {
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
                else if (char.search(/[A-Za-z]/) !== -1) {
                    pendingToken = new Token(char);
                }

                else if (raw[i - 2] !== ":" && raw[i - 1] === ":" && char !== ":") {
                    result.push(new Colon());
                }
                else if (char === ".") {
                    result.push(new Dot());
                }
                else if (char === "(") {
                    result.push(new LeftParenthesis());
                }
                else if (char === ")") {
                    result.push(new RightParenthesis());
                }
                else if (raw[i - 1] !== "|" && char === ">") {
                    result.push(new GreaterThan());
                }
                else if (char === "+") {
                    result.push(new Plus());
                }
                else if (char === "*") {
                    result.push(new Times());
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
                part2 = " " + token.value.toString();
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

class RightParenthesis extends Token {}

class Dot extends Token {}

class Colon extends Token {}

class GreaterThan extends Token {}

class Plus extends Token {}

class Times extends Token {}

class Num extends Token {}
