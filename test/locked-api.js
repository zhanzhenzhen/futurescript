import $fs from "fs";

// Currently we don't support `utf16BeBom` because Node.js doesn't support it.
export let TextEncoding = {
    utf8: 0,
    utf8Bom: 1,
    utf16BeBom: 2,
    utf16LeBom: 3
};

export let writeTextFile = function(path, text, encoding = TextEncoding.utf8) {
    let bytes = null;
    if (encoding === TextEncoding.utf8) {
        bytes = new Buffer(text, "utf8");
    }
    else if (encoding === TextEncoding.utf8Bom) {
        let rawBytes = new Buffer(text, "utf8");
        bytes = new Buffer(rawBytes.length + 3);
        bytes[0] = 0xEF;
        bytes[1] = 0xBB;
        bytes[2] = 0xBF;
        rawBytes.copy(bytes, 3);
    }
    else if (encoding === TextEncoding.utf16LeBom) {
        let rawBytes = new Buffer(text, "utf16le");
        bytes = new Buffer(rawBytes.length + 2);
        bytes[0] = 0xFF;
        bytes[1] = 0xFE;
        rawBytes.copy(bytes, 2);
    }
    else {
        throw new Error("Encoding not supported.");
    }
    $fs.writeFileSync(path, bytes);
};

export let directoryExists = function(path) {
    return $fs.existsSync(path) && $fs.statSync(path).isDirectory();
};

export let createDirectory = function(path) {
    $fs.mkdirSync(path);
};
