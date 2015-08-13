import v0_1_0 from "./compile-v0.1.0.js";

export default function(input) {
    var newlinePos = input.search(/\r|\n/);
    var firstLine = newlinePos === -1 ? input : input.substr(0, newlinePos);
    var match = firstLine.match(/\b(\d+\.\d+\.\d+)\b/);
    if (match !== null) {
        var version = match[1];
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
