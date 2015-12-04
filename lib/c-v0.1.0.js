import "./c-readme-0.js";
import * as $lex from "./c-lex-0.js";
import * as $block from "./c-block-0.js";
import * as $lockedApi from "./locked-api.js";

export default function(input) {
    let lex = new $lex.Lex(input.code, input.path);
    let block = new $block.RootBlock(lex);
    //block.batchImportNames.forEach(name => block.batchImports[name] = $lockedApi.readTextFile(name));
    //block.applyBatchImports();
    if (input.generatesCode) {
        block.complyWithJs();
        let compiled = block.compile();
        //console.log(compiled.allMappableJsBuilders().length, compiled.generateLexMap());
        if (input.sourceMapEnabled) {
            return {code: compiled.js, sourceMap: compiled.generateSourceMap(), exports: block.exports};
        }
        else {
            return {code: compiled.js, exports: block.exports};
        }
    }
    else {
        return {exports: block.exports};
    }
};
