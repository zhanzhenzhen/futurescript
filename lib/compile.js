import "./compile-shim-0.js";
import fs from "fs";
import v0_1_0 from "./compile-v0.1.0.js";

// Input object:
// {code: <string>, path: <string>, sourceMapEnabled: <bool>}
// Either `code` or `path` (or both) must be set.
// `path` means the path of the file the code belongs to (or you want the code to belong to).
// `sourceMapEnabled` is optional defaulting to false. If it's true, then `path` must be set.
// Output object:
// {code: <string>, sourceMap: <string>}
// `sourceMap` is absent if not enabled.
export default function(input) {
    if (input.sourceMapEnabled && input.path === undefined) {
        throw new Error();
    }
    let adjustedInput = {
        code: input.code,
        path: input.path,
        sourceMapEnabled: input.sourceMapEnabled
    };
    if (adjustedInput.code === undefined) {
        adjustedInput.code = fs.readFileSync(adjustedInput.path, {encoding: "utf8"});
    }
    if (adjustedInput.sourceMapEnabled === undefined) {
        adjustedInput.sourceMapEnabled = false;
    }
    let code = adjustedInput.code;
    let newlinePos = code.search(/\r|\n/);
    let firstLine = newlinePos === -1 ? code : code.substr(0, newlinePos);
    let match = firstLine.match(/\b(\d+\.\d+\.\d+)\b/);
    if (match !== null) {
        let version = match[1];
        switch (version) {
            case "0.1.0":
                return v0_1_0(adjustedInput);
            default:
                throw new Error();
        }
    }
    else {
        throw new Error();
    }
};
