import "./c-readme-0";
import * as $lex from "./c-lex-0";
import * as $block from "./c-block-0";

export default function(input) {
    let lex = new $lex.Lex(input.code, input.path);
    let block = new $block.RootBlock(lex);
    block.complyWithJs();
    let compiled = block.compile();
    //console.log(compiled.allMappableJsBuilders().length, compiled.generateLexMap());
    if (input.sourceMapEnabled) {
        return {code: compiled.js, sourceMap: compiled.generateSourceMap()};
    }
    else {
        return {code: compiled.js};
    }
};
