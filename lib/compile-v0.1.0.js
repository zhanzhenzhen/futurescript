import * as $lex from "./compile-lex-0";
import * as $block from "./compile-block-0";

export default function(input) {
    let lex = new $lex.Lex(input.code);
    let block = new $block.RootBlock(lex);
    block.complyWithJs();
    return {code: block.compile().js};
};
