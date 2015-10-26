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

result = $pattern.Pattern.matchPattern(
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

result = $pattern.Pattern.matchPatternCapture(
    [$lex.NormalToken, $pattern.Any, $lex.Colon, $pattern.Tokens],
    {lex: lex, startIndex: 0, endIndex: lex.value.length - 1},
    true,
    [1, 3]
);
console.log(
    Array.isArray(result) && result.length === 2 &&
    result[0].startIndex === 1 && result[0].endIndex === 0 &&
    result[1].startIndex === 2 && result[1].endIndex === 2
);

result = $pattern.Pattern.matchPattern(
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

result = $pattern.Pattern.matchPattern(
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

result = $pattern.Pattern.matchPattern(
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

result = $pattern.Pattern.matchPattern(
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

result = $pattern.Pattern.matchPattern(
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

result = $pattern.Pattern.matchPatternCapture(
    [$lex.If, $pattern.Tokens, $pattern.ChevronPair, $lex.Else, $pattern.ChevronPair],
    {lex: lex, startIndex: 0, endIndex: lex.value.length - 1},
    true,
    [1, 2, 4]
);
console.log(
    Array.isArray(result) && result.length === 3 &&
    result[0].startIndex === 1 && result[0].endIndex === 3 &&
    result[1].startIndex === 4 && result[1].endIndex === 8 &&
    result[2].startIndex === 10 && result[2].endIndex === 14
);

result = $pattern.Pattern.matchPattern(
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

result = $pattern.Pattern.matchPattern(
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

result = $pattern.Pattern.matchPattern(
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

result = $pattern.Pattern.matchPattern(
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

result = $pattern.Pattern.matchPattern(
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

result = $pattern.Pattern.matchPattern(
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

lex = new $lex.Lex(`lemo 0.1.0, node module
abc(1, 2, 3)
`);
result = $pattern.Pattern.split(
    $lex.Comma,
    {lex: lex, startIndex: 2, endIndex: 6}
);
console.log(
    Array.isArray(result) && result.length === 3 &&
    result[0].startIndex === 2 && result[0].endIndex === 2 &&
    result[1].startIndex === 4 && result[1].endIndex === 4 &&
    result[2].startIndex === 6 && result[2].endIndex === 6
);

lex = new $lex.Lex(`lemo 0.1.0, node module
abc()
`);
result = $pattern.Pattern.split(
    $lex.Comma,
    {lex: lex, startIndex: 2, endIndex: 1}
);
console.log(
    Array.isArray(result) && result.length === 1 &&
    result[0].startIndex === 2 && result[0].endIndex === 1
);

lex = new $lex.Lex(`lemo 0.1.0, node module
a: {
    a: 1,
    b: 2, c: 3
}
`);
result = $pattern.Pattern.split(
    [$lex.Comma, $lex.Semicolon],
    {lex: lex, startIndex: 3, endIndex: 13}
);
console.log(
    Array.isArray(result) && result.length === 3 &&
    result[0].startIndex === 3 && result[0].endIndex === 5 &&
    result[1].startIndex === 7 && result[1].endIndex === 9 &&
    result[2].startIndex === 11 && result[2].endIndex === 13
);

lex = new $lex.Lex(`lemo 0.1.0, node module
a: [1, 2, 3]
`);
result = $pattern.Pattern.matchPattern(
    [$pattern.BracketPair],
    {lex: lex, startIndex: 0, endIndex: lex.value.length - 1},
    true
);
console.log(result === null);

lex = new $lex.Lex(`lemo 0.1.0, node module
[1, 2, 3]
`);
result = $pattern.Pattern.matchPattern(
    [$pattern.BracketPair],
    {lex: lex, startIndex: 0, endIndex: lex.value.length - 1},
    false
);
console.log(
    Array.isArray(result) && result.length === 1 &&
    result[0] === 0
);

lex = new $lex.Lex(`lemo 0.1.0, node module
a.b(5, 6)
`);
result = $pattern.Pattern.matchPattern(
    [$pattern.Tokens, $pattern.ParenthesisPair],
    {lex: lex, startIndex: 0, endIndex: lex.value.length - 1},
    false
);
console.log(
    Array.isArray(result) && result.length === 2 &&
    result[0] === 0 &&
    result[1] === 3
);

lex = new $lex.Lex(`lemo 0.1.0, node module
a: 1 + 2 + 3
`);

result = $pattern.Pattern.matchPattern(
    [$pattern.Tokens, $lex.Plus, $pattern.Tokens],
    {lex: lex, startIndex: 2, endIndex: 6},
    false
);
console.log(
    Array.isArray(result) && result.length === 3 &&
    result[0] === 2 &&
    result[1] === 5 &&
    result[2] === 6
);

result = $pattern.Pattern.matchPatternCapture(
    [$pattern.Tokens, $lex.Plus, $pattern.Tokens],
    {lex: lex, startIndex: 2, endIndex: 6},
    false,
    [0, 1, 2, null]
);
console.log(
    Array.isArray(result) && result.length === 4 &&
    result[0].startIndex === 2 && result[0].endIndex === 4 &&
    result[1].startIndex === 5 && result[1].endIndex === 5 &&
    result[2].startIndex === 6 && result[2].endIndex === 6 &&
    result[3] === null
);
