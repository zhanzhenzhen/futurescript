import "./compile-shim-0.js";
import v0_1_0 from "./compile-v0.1.0.js";

// Input object:
// {code: <string>, path: <string>, sourceMapEnabled: <bool>}
// `path` is optional. `sourceMapEnabled` is optional defaulting to true.
// Output object:
// {code: <string>, sourceMap: <string>}
// `sourceMap` is absent if not enabled.
export default function(input) {
    let code = input.code;
    let newlinePos = code.search(/\r|\n/);
    let firstLine = newlinePos === -1 ? code : code.substr(0, newlinePos);
    let match = firstLine.match(/\b(\d+\.\d+\.\d+)\b/);
    if (match !== null) {
        let version = match[1];
        switch (version) {
            case "0.1.0":
                return v0_1_0(input);
            default:
                throw new Error();
        }
    }
    else {
        throw new Error();
    }
};
