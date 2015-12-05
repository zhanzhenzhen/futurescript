// There are some operations (like reading and writing files) that can't be done without
// a framework like Node.js. The thing is that such framework may change, so the API
// code can't be permanent, but the API itself (i.e. export's name, arity,
// feature, usage, etc.) can be permanent (at least as much as possible).
// So "locked" here just refers to API, not meaning this file is locked.
// Also note that: API can only be functions. Adding new function to API is allowed, but
// once added and released, it's locked. So be careful.

import $fs from "fs";
import compile from "./c.js";

export let readTextFile = function(path) {
    let bytes = $fs.readFileSync(path);
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

// Support any version, but JS file is not supported.
export let fileExports = function(path) {
    let output = compile({path: path, generatesCode: false});
    return output.exports;
};
