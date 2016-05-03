// There are some operations (like reading and writing files) that can't be done without
// a framework like Node.js. The thing is that such framework may change, so the API
// code can't be permanent, but the API itself (i.e. export's name, arity,
// feature, usage, etc.) can be permanent (at least as much as possible).
// So "locked" here just refers to API, not meaning this file is locked.
// Also note that: API can only be functions. Adding new function to API is allowed, but
// once added and released, it's locked. So be careful.

import * as $env from "./env.js";

if ($env.isNode && $env.nodeVersion.search(/^[0-4]\./) !== -1) {
    // Use `module.require` to prevent bundling for browser.
    module.require("babel-polyfill");
}

// This function is never called. But useful for bundlers to parse, so that
// the current version can be included.
let bundlerLookup = function() {
    require("./c-v2.0.1/main.js");
    require("./c-v2.0.2/main.js");
    require("./c-v2.0.3/main.js");
    require("./c-v2.0.4/main.js");
    require("./c-v2.0.5/main.js");
};

let normalizeBrowserPath = function(path) {
    let parts = path.split("/");
    let arr = [];
    parts.forEach(s => {
        if (s === ".") {
        }
        else if (s === "..") {
            arr.pop();
        }
        else {
            arr.push(s);
        }
    });
    let r = arr.join("/");
    if (!r.startsWith("/")) {
        r = "/" + r;
    }
    return r;
};

// For Windows compatibility. Convert path to Unix style.
let slashPath = function(path) {
    if (typeof path === "string") {
        return path.replace(/\\/g, "/");
    }
    else {
        return path;
    }
};

export let readTextFile = function(path) {
    path = slashPath(path);
    if ($env.isNode) {
        // Use `module.require` to prevent bundling for browser.
        let $fs = module.require("fs");
        let $path = module.require("path").posix;

        let absolutePath = slashPath($path.resolve(path));
        if ($env.fsPreset[absolutePath] === undefined) {
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
        }
        else {
            return $env.fsPreset[absolutePath];
        }
    }
    else {
        let absolutePath = normalizeBrowserPath(path);
        if ($env.fsPreset[absolutePath] === undefined) {
            throw new Error("In browser environment, file must be preset.");
        }
        else {
            return $env.fsPreset[absolutePath];
        }
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
    sourceMap: 3
};

export let OutputCodeType = {
    ecmaScript: 0
};

/*
Input object:
{
    code: <string>,
    path: <string>,
    level: <OutputLevel>,
    generatesStyles: <boolean>,
    outputCodeReadability: <number>
}
Either `code` or `path` (or both) must be set.
`path` means the path of the file the code belongs to (or you want the code to behave as if
it is located at the path, for source maps and other use).
If `code` is set, it won't read code from `path`, otherwise it will read code from `path`.
`level` is optional defaulting to `OutputLevel.compile`.
`generatesStyles` is optional defaulting to false. If true, then `level` can't be less than
`OutputLevel.exports`. It categorizes code parts into styles. Useful in syntax highlighting.
`outputCodeReadability` is optional defaulting to 0. It must be between 0 (including) and 1 (including),
for example, `0.3`, `0.8`.

Output object:
{
    version: <string>,
    exports: <string array>,
    styles: <array of arrays>,
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

`styles` will be absent if `generatesStyles` is false. If present, it's
an array of arrays.
A `styles` example is [[0, 1], [3, 0]], which means the first segment's start index is 0
(this should always be 0) and its style is 1 (which means keyword), and the second
segment's start index is 3 and its style is 0 (which means normal). Style is a
number instead of a real color name, because the real color should be customizable,
also because sometimes we use underline, bold, italic, etc. to show a style.
We even don't use names `keyword` or `normal` because it's sometimes hard to define
a kind in accurate, irrevocable words. I can now only confirm the use of the first 4 styles:
0: normal, 1: keyword, 2: string, 3: comment
It can't be larger than 15, except for extended style. Is the limit too small? No, it's
by design, because if there're too many then the meanings will be less likely to be fixed.

Note: the `targets` array always has only 1 element. Why it's an array is for future use.

Note: Besides main style, there's extended style: a combination of different categories.
This is useful when adding "italic" or "underline" to a code fragment that already has many styles.
It uses flags, each of which has 16 possible values, so it's compatible with the main style.
The first category (bit 0-3) is the main style (note that it can also be displayed as italic
or underline, depending on the theme).
The second category (bit 4-7) is mainly for italic (only two lowest values used).
The third category (bit 8-11) is mainly for underline (only two lowest values used).
There may be additional categories for future use.
For example, if the style is 16, it means "normal, italic".
If the style is 274, it means "string, italic, underline".
*/
export let generateOutput = function(input) {
    if (input.code === undefined && input.path === undefined) {
        throw new Error();
    }
    let adjustedInput = {
        code: input.code,
        path: input.path,
        level: input.level,
        generatesStyles: input.generatesStyles,
        outputCodeReadability: input.outputCodeReadability
    };
    adjustedInput.path = slashPath(adjustedInput.path);
    if (adjustedInput.code === undefined) {
        adjustedInput.code = readTextFile(adjustedInput.path);
    }
    if (adjustedInput.level === undefined) {
        adjustedInput.level = OutputLevel.compile;
    }
    if (adjustedInput.generatesStyles === undefined) {
        adjustedInput.generatesStyles = false;
    }
    if (adjustedInput.outputCodeReadability === undefined) {
        adjustedInput.outputCodeReadability = 0;
    }
    let code = adjustedInput.code;
    let newlinePos = code.search(/\r|\n/);
    let firstLine = newlinePos === -1 ? code : code.substr(0, newlinePos);
    let match = firstLine.match(/\b(\d+\.\d+\.\d+)\b/);
    if (match === null) {
        throw new SyntaxError("Version line missing.");
    }
    let version = match[1];
    let mainModule = null;
    try {
        mainModule = require("./c-v" + version + "/main.js");
    }
    catch (ex) {
        throw new SyntaxError("Cannot find module matching this version.");
    }
    let output = mainModule.default(adjustedInput);
    output.version = version;
    return output;
};

export class SyntaxError extends Error {
    constructor(message) {
        super(message);

        // Subclassable `Error` has problems in ES5 and Babel, so as a workaround,
        // we have to explicitly assign message to `message` property. In the future
        // we can remove it and even all the constructor.
        this.message = message;
    }
}
