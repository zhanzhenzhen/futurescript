import $fs from "fs";
import * as $libLockedApi from "../lib/locked-api.js";

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

let runCodeIndex = 0;
export let runCode = function(code) {
    let output = $libLockedApi.generateOutput({code: code});

    // Must use this kind of filename. Filename can't be fixed, because `require`
    // will just load the content with a certain file path for the first time.
    // Also, `require` can't be used in VM.
    let jsFilename = "code-" + runCodeIndex + ".js";

    writeTextFile("test/temp/" + jsFilename, output.targets[0].code);
    runCodeIndex++;
    let r = require("./temp/" + jsFilename).default;
    if (r !== undefined) {
        r = JSON.parse(JSON.stringify(r)); // to make sure it's JSON
    }
    return r;
};

export let printLine = function(str) {
    console.log(str);
};
