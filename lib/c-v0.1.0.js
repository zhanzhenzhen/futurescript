import "./c-readme-0.js";
import * as $lockedApi from "./locked-api.js";
import * as $lex from "./c-lex-0.js";
import * as $block from "./c-block-0.js";

export default function(input) {
    if (input.level >= $lockedApi.OutputLevel.sourceMap && input.path === undefined) {
        throw new Error("If source map is enabled, then input.path must be set.");
    }
    let output = {};
    if (input.level >= $lockedApi.OutputLevel.exports) {
        let lex = new $lex.Lex(input.code, input.path);
        let block = new $block.RootBlock(lex);
        output.exports = block.exports;
        //block.batchImportNames.forEach(name => block.batchImports[name] = $lockedApi.readTextFile(name));
        //block.applyBatchImports();
        if (input.level >= $lockedApi.OutputLevel.compile) {
            block.complyWithJs();
            let jb = block.compile();
            //console.log(compiled.allMappableJsBuilders().length, compiled.generateLexMap());
            let target = {code: jb.js, codeType: $lockedApi.OutputCodeType.ecmaScript};
            if (input.level >= $lockedApi.OutputLevel.sourceMap) {
                target.sourceMap = jb.generateSourceMap();
            }
            output.targets = [target];
        }
    }
    return output;
};
