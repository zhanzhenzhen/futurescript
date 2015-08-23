let codeLines = null;

let calcIndent = function(lineCode) {
    return lineCode.match(/^[ \t]*/)[0].length;
};

export let parse = function(raw) {
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

        if (raw[i - 2] !== ":" && raw[i - 1] === ":" && char !== ":") {
            result.push(new AssignColon());
        }

        if (raw[i - 1] !== "|" && char === ">") {
            result.push(new GreaterThan());
        }

        if (char === "+") {
            result.push(new Plus());
        }

        if (char === "*") {
            result.push(new Times());
        }

        if (char.search(/[0-9]/) !== -1 && number === null) {
            number = char;
        }
        else if (number !== null) {
            if (char.search(/[0-9.]/) !== -1) {
                number += char;
            }
            else {
                result.push(new NumberLiteral(number));
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
    }
    return result;
}

class Token {
    constructor(value) {
        if (value !== undefined) {
            this.value = value;
        }
    }
}

class Indent extends Token {}

class AssignColon extends Token {}

class GreaterThan extends Token {}

class Plus extends Token {}

class Times extends Token {}

class NumberLiteral extends Token {}
