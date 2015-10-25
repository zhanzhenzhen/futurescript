import * as $block from "./compile-block-0";

export default function(block) {
    console.log(block.print());
    console.log(block.compile());
    return {code: "haha", sourceMap: null};
};
