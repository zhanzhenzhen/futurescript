export class Lex {
    constructor(raw) {
        let result = [];

        let indent = null;
        let number = null;
        let tokenName = null;

        for (let i = 0; i < raw.length; i++) {
            let char = raw[i];

            if ((char === " " || char === "\t") && raw[i - 1] === "\n" && indent === null) {
                indent = 1;
            }
            else if (indent !== null) {
                if (char === " " || char === "\t") {
                    indent++;
                }
                else {
                    result.push(new Indent(indent));
                    indent = null;
                }
            }

            if (char.search(/[0-9]/) !== -1 && number === null) {
                number = char;
            }
            else if (number !== null) {
                if (char.search(/[0-9.]/) !== -1) {
                    number += char;
                }
                else {
                    result.push(new Num(number));
                    number = null;
                }
            }

            if (char.search(/[A-Za-z]/) !== -1 && tokenName === null) {
                tokenName = char;
            }
            else if (tokenName !== null) {
                if (char.search(/[A-Za-z0-9]/) !== -1) {
                    tokenName += char;
                }
                else {
                    result.push(new Token(tokenName));
                    tokenName = null;
                }
            }

            if (char === "\n") {
                result.push(new Terminator());
            }
            else if (raw[i - 2] !== ":" && raw[i - 1] === ":" && char !== ":") {
                result.push(new AssignColon());
            }
            else if (char === "." && number === null) {
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

class Indent extends Token {}

class Terminator extends Token {}

class LeftParenthesis extends Token {}

class RightParenthesis extends Token {}

class Dot extends Token {}

class AssignColon extends Token {}

class GreaterThan extends Token {}

class Plus extends Token {}

class Times extends Token {}

class Num extends Token {}
