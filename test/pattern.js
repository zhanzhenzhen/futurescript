import * as $lex from "../lib/compile-lex-0";
import * as $pattern from "../lib/compile-pattern-0";
import assert from "assert";

let s = null;
let lex, result;

lex = new $lex.Lex(`lemo 0.1.0, node module
a: 1
`);
result = $pattern.Pattern.searchSequence(
    [$lex.NormalToken, $lex.Colon],
    {lex: lex, startIndex: 0, endIndex: lex.value.length - 1},
    true
);
console.log(result === 0);

lex = new $lex.Lex(`lemo 0.1.0, node module
if a = 1
    b: 1
else
    b: 2
`);

result = $pattern.Pattern.searchPattern(
    [$pattern.Any, $lex.NormalToken, $lex.Equal, $pattern.Any],
    {lex: lex, startIndex: 0, endIndex: lex.value.length - 1},
    true
);
console.log(result.length === 4);
console.log(result[0] === 0);
console.log(result[1] === 1);
console.log(result[2] === 2);
console.log(result[3] === 3);

result = $pattern.Pattern.searchPattern(
    [$pattern.Tokens, $lex.NormalToken, $lex.Equal, $pattern.Tokens],
    {lex: lex, startIndex: 0, endIndex: lex.value.length - 1},
    true
);
console.log(result.length === 4);
console.log(result[0] === 0);
console.log(result[1] === 1);
console.log(result[2] === 2);
console.log(result[3] === 3);

result = $pattern.Pattern.searchPattern(
    [$lex.If, $pattern.Any, $pattern.ChevronPair, $lex.Else, $pattern.ChevronPair],
    {lex: lex, startIndex: 0, endIndex: lex.value.length - 1},
    true
);
console.log(result);
console.log(result.length === 5);
console.log(result[0] === 0);
console.log(result[1] === 1);
console.log(result[2] === 4);
console.log(result[3] === 9);
console.log(result[4] === 10);

result = $pattern.Pattern.searchPattern(
    [$lex.If, $pattern.Tokens, $pattern.ChevronPair, $lex.Else, $pattern.ChevronPair],
    {lex: lex, startIndex: 0, endIndex: lex.value.length - 1},
    true
);
console.log(result.length === 5);
console.log(result[0] === 0);
console.log(result[1] === 1);
console.log(result[2] === 4);
console.log(result[3] === 9);
console.log(result[4] === 10);

result = $pattern.Pattern.searchPattern(
    [$pattern.Tokens, $lex.Else, $pattern.ChevronPair],
    {lex: lex, startIndex: 0, endIndex: lex.value.length - 1},
    true
);
console.log(result);

lex = new $lex.Lex(`lemo 0.1.0, node module
a ? b | c + d ? e | f
`);
result = $pattern.Pattern.searchPattern(
    [$pattern.Tokens, $lex.Then, $pattern.Tokens, $lex.Else, $pattern.Tokens],
    {lex: lex, startIndex: 0, endIndex: lex.value.length - 1},
    false
);
console.log(result);
result = $pattern.Pattern.searchPattern(
    [$pattern.Tokens, $lex.Then, $pattern.Tokens, $lex.Else, $pattern.Tokens],
    {lex: lex, startIndex: 0, endIndex: lex.value.length - 1},
    true
);
console.log(result);
