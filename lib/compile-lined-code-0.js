export class LinedCode {
    constructor(raw) {
        let statementPos = 0;
        let indent = 0;
        this.lines = [];
        let inIndent = false;
        let pos = 0;
        for (let i = 0; i < raw.length; i++) {
            let char = raw[i];
            let endPos = null;
            if (char === "\n") {
                if (raw[i - 1] === "\r") {
                    endPos = i - 2;
                }
                else {
                    endPos = i - 1;
                }
                let code = raw.substr(pos, endPos - pos + 1);
                this.lines.push({code: code, indent: calcIndent(code), rawPosition: pos});
                pos = i + 1;
            }
        }
        let block = generateBlock(this.lines, 1, 0, this.lines.length - 1, this.lines[this.lines.length - 1].length - 1, true);
    }
}
