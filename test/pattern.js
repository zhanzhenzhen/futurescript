import * as $lex from "../lib/compile-lex-0";
import * as $statement from "../lib/compile-statement-0";
import assert from "assert";

let s = null;
let lex, result;

lex = new $lex.Lex(`lemo 0.1.0, node module
a: 1
`);
result = $statement.Statement.searchOuterSequence([$lex.NormalToken, $lex.Colon], lex, 0, lex.value.length - 1, true);
console.log(result);

lex = new $lex.Lex(`lemo 0.1.0, node module
if a = 1
    b: 1
else
    b: 2
`);
console.log(lex);
result = $statement.Statement.searchOuterPattern([$statement.Any, $lex.NormalToken, $lex.Equal, $statement.Any], lex, 0, lex.value.length - 1, true);
console.log(result);
result = $statement.Statement.searchOuterPattern([$statement.Tokens, $lex.NormalToken, $lex.Equal, $statement.Any], lex, 0, lex.value.length - 1, true);
console.log(result);
