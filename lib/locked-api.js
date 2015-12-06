// There are some operations (like reading and writing files) that can't be done without
// a framework like Node.js. The thing is that such framework may change, so the API
// code can't be permanent, but the API itself (i.e. export's name, arity,
// feature, usage, etc.) can be permanent (at least as much as possible).
// So "locked" here just refers to API, not meaning this file is locked.
// Also note that: API can only be functions. Adding new function to API is allowed, but
// once added and released, it's locked. So be careful.

import $fs from "fs";

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
    let output = generateOutput({path: path, level: OutputLevel.exports});
    return output.exports;
};

export let OutputLevel = {
    version: 0,
    exports: 1,
    compile: 2,
    sourceMap: 3,
};

export let OutputCodeType = {
    ecmaScript: 0
};

/*
Input object:
{
    code: <string>,
    path: <string>,
    level: <OutputLevel>
}
Either `code` or `path` (or both) must be set.
`path` means the path of the file the code belongs to (or you want the code to belong to).
`level` is optional defaulting to `OutputLevel.compile`.

Output object:
{
    version: <string>,
    exports: <string array>,
    targets: <Target array>
}

`targets` is an array of objects of virtual type `Target`.
`Target` type structure:
{
    code: <string>,
    codeType: <OutputCodeType>,
    sourceMap: <string>
}
`sourceMap` will be absent if `level` < `OutputLevel.sourceMap`.
The whole `targets` field will be absent if `level` < `OutputLevel.compile`.

`exports` will be absent if `level` < `OutputLevel.exports`. This property lists all exports' names
(note that the name of the default export is "default"). Will be an empty array if no export.

Note: the `targets` array always has only 1 element. Why it's an array is for future use.
*/
export let generateOutput = function(input) {
    if (input.code === undefined && input.path === undefined) {
        throw new Error();
    }
    let adjustedInput = {
        code: input.code,
        path: input.path,
        level: input.level
    };
    if (adjustedInput.code === undefined) {
        adjustedInput.code = readTextFile(adjustedInput.path);
    }
    if (adjustedInput.level === undefined) {
        adjustedInput.level = OutputLevel.compile;
    }
    let code = adjustedInput.code;
    let newlinePos = code.search(/\r|\n/);
    let firstLine = newlinePos === -1 ? code : code.substr(0, newlinePos);
    let match = firstLine.match(/\b(\d+\.\d+\.\d+)\b/);
    if (match === null) throw new Error();
    let version = match[1];
    let output = require("./c-v" + version + ".js")(adjustedInput);
    output.version = version;
    return output;
};

/* TODO: For now this function is just a placeholder.
This function categorizes code parts into colors. Useful in syntax highlighting.
Returns an array of arrays.
A return example is [[0, 1], [3, 0]], which means the first segment's start index is 0
(this should always be 0) and its color is 1 (which means keyword), and the second
segment's start index is 3 and its color is 0 (which means normal). Color is a
number instead of a real color name, because the real color should be customizable.
We even don't use names `keyword` or `normal` because it's sometimes hard to define
a kind in accurate, irrevocable words. I can now only confirm the use of the first 4 colors:
0: normal, 1: keyword, 2: string, 3: comment
*/
export let codeColors = function(code) {
};
