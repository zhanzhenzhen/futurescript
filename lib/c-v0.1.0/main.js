import "../c-v0.1.0/c-readme.js";
import * as $lockedApi from "../locked-api.js";
import * as $lex from "../c-v0.1.0/c-lex.js";
import * as $node from "../c-v0.1.0/c-node.js";

export default function(input) {
    if (input.level >= $lockedApi.OutputLevel.sourceMap && input.path === undefined) {
        throw new Error("If source map is enabled, then input.path must be set.");
    }
    let output = {};
    if (input.level >= $lockedApi.OutputLevel.exports) {
        let lex = new $lex.Lex(input.code, input.path);
        let block = new $node.RootBlock(lex);
        output.exports = block.exports;
        if (input.level >= $lockedApi.OutputLevel.compile) {
            block.complyWithJs();
            let jb = block.compile();
            let target = {code: jb.js, codeType: $lockedApi.OutputCodeType.ecmaScript};
            if (input.level >= $lockedApi.OutputLevel.sourceMap) {
                target.sourceMap = jb.generateSourceMap();
            }
            output.targets = [target];
        }
    }
    return output;
};
