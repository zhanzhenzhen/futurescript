// In loading a specific version of compiler, we must use `require`, because it should
// be dynamic, otherwise it will cause large memory usage in the future.

import $fs from "fs";

/*
Input object:
{code: <string>, path: <string>, sourceMapEnabled: <bool>, generatesCode: <bool>}
Either `code` or `path` (or both) must be set.
`path` means the path of the file the code belongs to (or you want the code to belong to).
`sourceMapEnabled` is optional defaulting to false. If it's true, then `path` must be set.
`generatesCode` is optional defaulting to true.
Output object:
{code: <string>, sourceMap: <string>, exports: <string array>}
`code` will be absent if code generation is off.
`sourceMap` will be absent if source map or code generation is off.
`exports` lists all exports' names (the name of the default export is "default"). Will be
an empty array if no export.
*/
export default function(input) {
    if (input.sourceMapEnabled && input.path === undefined) {
        throw new Error();
    }
    let adjustedInput = {
        code: input.code,
        path: input.path,
        sourceMapEnabled: input.sourceMapEnabled,
        generatesCode: input.generatesCode
    };
    if (adjustedInput.code === undefined) {
        adjustedInput.code = $fs.readFileSync(adjustedInput.path, {encoding: "utf8"});
    }
    if (adjustedInput.sourceMapEnabled === undefined) {
        adjustedInput.sourceMapEnabled = false;
    }
    if (adjustedInput.generatesCode === undefined) {
        adjustedInput.generatesCode = true;
    }
    let code = adjustedInput.code;
    let newlinePos = code.search(/\r|\n/);
    let firstLine = newlinePos === -1 ? code : code.substr(0, newlinePos);
    let match = firstLine.match(/\b(\d+\.\d+\.\d+)\b/);
    if (match !== null) {
        let version = match[1];
        switch (version) {
            case "0.1.0":
                return require("./c-v0.1.0.js")(adjustedInput);
            default:
                throw new Error();
        }
    }
    else {
        throw new Error();
    }
};
