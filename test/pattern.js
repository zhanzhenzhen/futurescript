import * as $lex from "../lib/compile-lex-0";
import * as $pattern from "../lib/compile-pattern-0";
import assert from "assert";

let s = null;
let lex, result;

lex = new $lex.Lex(`lemo 0.1.0, node module
a: 1
`);
result = $pattern.Pattern.searchSequence([$lex.NormalToken, $lex.Colon], lex, 0, lex.value.length - 1, true);
console.log(result);

lex = new $lex.Lex(`lemo 0.1.0, node module
if a = 1
    b: 1
else
    b: 2
`);
console.log(lex);
result = $pattern.Pattern.searchPattern([$pattern.Any, $lex.NormalToken, $lex.Equal, $pattern.Any], lex, 0, lex.value.length - 1, true);
console.log(result);
result = $pattern.Pattern.searchPattern([$pattern.Tokens, $lex.NormalToken, $lex.Equal, $pattern.Tokens], lex, 0, lex.value.length - 1, true);
console.log(result);
