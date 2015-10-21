import * as $lex from "../lib/compile-lex-0";
import * as $pattern from "../lib/compile-pattern-0";
import assert from "assert";

let s = null;
let lex, result;

lex = new $lex.Lex(`lemo 0.1.0, node module
a: 1
`);

result = $pattern.Pattern.searchOne(
    $lex.Colon,
    {lex: lex, startIndex: 0, endIndex: lex.value.length - 1},
    true
);
console.log(result === 1);

result = $pattern.Pattern.searchSequence(
    [$lex.NormalToken, $lex.Colon],
    {lex: lex, startIndex: 0, endIndex: lex.value.length - 1},
    true
);
console.log(result === 0);

result = $pattern.Pattern.searchPattern(
    [$lex.NormalToken, $pattern.Any, $lex.Colon, $pattern.Tokens],
    {lex: lex, startIndex: 0, endIndex: lex.value.length - 1},
    true
);
console.log(
    Array.isArray(result) && result.length === 4 &&
    result[0] === 0 &&
    result[1] === 1 &&
    result[2] === 1 &&
    result[3] === 2
);

result = $pattern.Pattern.searchPattern(
    [$lex.NormalToken, $pattern.Tokens, $lex.Colon, $pattern.Tokens],
    {lex: lex, startIndex: 0, endIndex: lex.value.length - 1},
    true
);
console.log(result === null);

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
console.log(
    Array.isArray(result) && result.length === 4 &&
    result[0] === 0 &&
    result[1] === 1 &&
    result[2] === 2 &&
    result[3] === 3
);

result = $pattern.Pattern.searchPattern(
    [$pattern.Tokens, $lex.NormalToken, $lex.Equal, $pattern.Tokens],
    {lex: lex, startIndex: 0, endIndex: lex.value.length - 1},
    true
);
console.log(
    Array.isArray(result) && result.length === 4 &&
    result[0] === 0 &&
    result[1] === 1 &&
    result[2] === 2 &&
    result[3] === 3
);

result = $pattern.Pattern.searchPattern(
    [$lex.If, $pattern.Any, $pattern.ChevronPair, $lex.Else, $pattern.ChevronPair],
    {lex: lex, startIndex: 0, endIndex: lex.value.length - 1},
    true
);
console.log(
    Array.isArray(result) && result.length === 5 &&
    result[0] === 0 &&
    result[1] === 1 &&
    result[2] === 4 &&
    result[3] === 9 &&
    result[4] === 10
);

result = $pattern.Pattern.searchPattern(
    [$lex.If, $pattern.Tokens, $pattern.ChevronPair, $lex.Else, $pattern.ChevronPair],
    {lex: lex, startIndex: 0, endIndex: lex.value.length - 1},
    true
);
console.log(
    Array.isArray(result) && result.length === 5 &&
    result[0] === 0 &&
    result[1] === 1 &&
    result[2] === 4 &&
    result[3] === 9 &&
    result[4] === 10
);

result = $pattern.Pattern.searchPattern(
    [$pattern.Tokens, $lex.Else, $pattern.ChevronPair],
    {lex: lex, startIndex: 0, endIndex: lex.value.length - 1},
    true
);
console.log(
    Array.isArray(result) && result.length === 3 &&
    result[0] === 0 &&
    result[1] === 9 &&
    result[2] === 10
);

lex = new $lex.Lex(`lemo 0.1.0, node module
a ? b | c + d ? e | f
`);

result = $pattern.Pattern.searchPattern(
    [$pattern.Tokens, $lex.Then, $pattern.Tokens, $lex.Else, $pattern.Tokens],
    {lex: lex, startIndex: 0, endIndex: lex.value.length - 1},
    false
);
console.log(
    Array.isArray(result) && result.length === 5 &&
    result[0] === 0 &&
    result[1] === 7 &&
    result[2] === 8 &&
    result[3] === 9 &&
    result[4] === 10
);

result = $pattern.Pattern.searchPattern(
    [$pattern.Tokens, $lex.Then, $pattern.Tokens, $lex.Else, $pattern.Tokens],
    {lex: lex, startIndex: 0, endIndex: lex.value.length - 1},
    true
);
console.log(
    Array.isArray(result) && result.length === 5 &&
    result[0] === 0 &&
    result[1] === 1 &&
    result[2] === 2 &&
    result[3] === 3 &&
    result[4] === 4
);

lex = new $lex.Lex(`lemo 0.1.0, node module
(x, y) -> x * y
`);

result = $pattern.Pattern.searchPattern(
    [$pattern.Tokens, $lex.ArrowFunction, $pattern.Any],
    {lex: lex, startIndex: 0, endIndex: lex.value.length - 1},
    true
);
console.log(
    Array.isArray(result) && result.length === 3 &&
    result[0] === 0 &&
    result[1] === 5 &&
    result[2] === 6
);

result = $pattern.Pattern.searchPattern(
    [$pattern.ParenthesisPair, $lex.ArrowFunction, $pattern.Any],
    {lex: lex, startIndex: 0, endIndex: lex.value.length - 1},
    true
);
console.log(
    Array.isArray(result) && result.length === 3 &&
    result[0] === 0 &&
    result[1] === 5 &&
    result[2] === 6
);

lex = new $lex.Lex(`lemo 0.1.0, node module
1 + 2 + 3
`);

result = $pattern.Pattern.searchPattern(
    [$pattern.Tokens, $lex.Plus, $pattern.Tokens],
    {lex: lex, startIndex: 0, endIndex: lex.value.length - 1},
    false
);
console.log(
    Array.isArray(result) && result.length === 3 &&
    result[0] === 0 &&
    result[1] === 3 &&
    result[2] === 4
);