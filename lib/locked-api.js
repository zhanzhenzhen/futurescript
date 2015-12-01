import fs from "fs";

// Currently we don't support `utf16BeBom` because Node.js doesn't support it.
export let textEncoding = {
    utf8: 0,
    utf8Bom: 1,
    utf16BeBom: 2,
    utf16LeBom: 3
};

export let readTextFile = function(path) {
    let bytes = fs.readFileSync(filePath);
    if (bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0xFE && bytes[3] === 0xFF) {
        throw new Error("UTF-32 BE not supported.");
    }
    else if (bytes[0] === 0xFF && bytes[1] === 0xFE && bytes[2] === 0x00 && bytes[3] === 0x00) {
        throw new Error("UTF-32 LE not supported.");
    }
    else if (bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) {
        return bytes.toString("utf8", 3);
    }
    else if (bytes[0] === 0xFE && bytes[1] === 0xFF) {
        throw new Error("UTF-16 BE not supported.");
    }
    else if (bytes[0] === 0xFF && bytes[1] === 0xFE) {
        return bytes.toString("utf16le", 2);
    }
    else {
        return bytes.toString("utf8");
    }
};

export let writeTextFile = function(path, text, encoding = textEncoding.utf8) {
    let bytes = null;
    if (encoding === textEncoding.utf8) {
        bytes = new Buffer(text, "utf8");
    }
    else if (encoding === textEncoding.utf8Bom) {
        let rawBytes = new Buffer(text, "utf8");
        bytes = new Buffer(rawBytes.length + 3);
        bytes[0] = 0xEF;
        bytes[1] = 0xBB;
        bytes[2] = 0xBF;
        rawBytes.copy(bytes, 3);
    }
    else if (encoding === textEncoding.utf16LeBom) {
        let rawBytes = new Buffer(text, "utf16le");
        bytes = new Buffer(rawBytes.length + 2);
        bytes[0] = 0xFF;
        bytes[1] = 0xFE;
        rawBytes.copy(bytes, 2);
    }
    else {
        throw new Error("Encoding not supported.");
    }
    fs.writeFileSync(path, bytes);
};
