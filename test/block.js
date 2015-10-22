import * as $lex from "../lib/compile-lex-0";
import * as $block from "../lib/compile-block-0";
import assert from "assert";

let s = null;
let lex, result;

lex = new $lex.Lex(`lemo 0.1.0, node module
a: 1 + 2 + 3
b: 2 + 3
c: abc(5)
`);
let block = new $block.Block({lex: lex, startIndex: 0, endIndex: lex.count() - 1});
console.log(block);
console.log(block.print());
console.log(block.value[2]);
