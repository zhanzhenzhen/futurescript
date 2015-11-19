import * as $lex from "../lib/c-lex-0.js";
import * as $pattern from "../lib/c-pattern-0.js";
import assert from "assert";

let s = null;
let lex, result;

lex = new $lex.Lex(`lemo 0.1.0, node module
a: 1
`);

result = $pattern.Pattern.searchOne(
    $lex.Colon,
    lex.part(1),
    true
);
console.log(result === 2);

result = $pattern.Pattern.searchSequence(
    [$lex.NormalToken, $lex.Colon],
    lex.part(1),
    true
);
console.log(result === 1);

result = $pattern.Pattern.matchPattern(
    [$lex.NormalToken, $pattern.any, $lex.Colon, $pattern.tokens],
    lex.part(1),
    true
);
console.log(
    Array.isArray(result) && result.length === 4 &&
    result[0] === 1 &&
    result[1] === 2 &&
    result[2] === 2 &&
    result[3] === 3
);

result = $pattern.Pattern.matchPatternCapture(
    [$lex.NormalToken, $pattern.any, $lex.Colon, $pattern.tokens],
    lex.part(1),
    true,
    [1, 3]
);
console.log(
    Array.isArray(result) && result.length === 2 &&
    result[0] instanceof Object && result[0].startIndex === 2 && result[0].endIndex === 1 &&
    result[1] instanceof Object && result[1].startIndex === 3 && result[1].endIndex === 3
);

result = $pattern.Pattern.matchPatternsAndCaptures(
    [
        [[$lex.NormalToken, $pattern.any, $lex.Colon, $pattern.tokens], [1, 3]]
    ],
    lex.part(1),
    true
);
console.log(
    Array.isArray(result) && result.length === 2 &&
    result[0] instanceof Object && result[0].startIndex === 2 && result[0].endIndex === 1 &&
    result[1] instanceof Object && result[1].startIndex === 3 && result[1].endIndex === 3
);

result = $pattern.Pattern.matchPattern(
    [$lex.NormalToken, $pattern.tokens, $lex.Colon, $pattern.tokens],
    lex.part(1),
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
    [$pattern.any, $lex.NormalToken, $lex.Equal, $pattern.any],
    lex.part(1),
    true
);
console.log(
    Array.isArray(result) && result.length === 4 &&
    result[0] === 1 &&
    result[1] === 2 &&
    result[2] === 3 &&
    result[3] === 4
);

result = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $lex.NormalToken, $lex.Equal, $pattern.tokens],
    lex.part(1),
    true
);
console.log(
    Array.isArray(result) && result.length === 4 &&
    result[0] === 1 &&
    result[1] === 2 &&
    result[2] === 3 &&
    result[3] === 4
);

result = $pattern.Pattern.matchPattern(
    [$lex.If, $pattern.any, $pattern.ChevronPair, $lex.Else, $pattern.ChevronPair],
    lex.part(1),
    true
);
console.log(
    Array.isArray(result) && result.length === 5 &&
    result[0] === 1 &&
    result[1] === 2 &&
    result[2] === 5 &&
    result[3] === 10 &&
    result[4] === 11
);

result = $pattern.Pattern.matchPattern(
    [$lex.If, $pattern.tokens, $pattern.ChevronPair, $lex.Else, $pattern.ChevronPair],
    lex.part(1),
    true
);
console.log(
    Array.isArray(result) && result.length === 5 &&
    result[0] === 1 &&
    result[1] === 2 &&
    result[2] === 5 &&
    result[3] === 10 &&
    result[4] === 11
);

result = $pattern.Pattern.matchPatternCapture(
    [$lex.If, $pattern.tokens, $pattern.ChevronPair, $lex.Else, $pattern.ChevronPair],
    lex.part(1),
    true,
    [1, 2, 4]
);
console.log(
    Array.isArray(result) && result.length === 3 &&
    result[0] instanceof Object && result[0].startIndex === 2 && result[0].endIndex === 4 &&
    result[1] instanceof Object && result[1].startIndex === 5 && result[1].endIndex === 9 &&
    result[2] instanceof Object && result[2].startIndex === 11 && result[2].endIndex === 15
);

result = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $lex.Else, $pattern.ChevronPair],
    lex.part(1),
    true
);
console.log(
    Array.isArray(result) && result.length === 3 &&
    result[0] === 1 &&
    result[1] === 10 &&
    result[2] === 11
);

lex = new $lex.Lex(`lemo 0.1.0, node module
a ? b | c + d ? e | f
`);

result = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $lex.Then, $pattern.tokens, $lex.Else, $pattern.tokens],
    lex.part(1),
    false
);
console.log(
    Array.isArray(result) && result.length === 5 &&
    result[0] === 1 &&
    result[1] === 8 &&
    result[2] === 9 &&
    result[3] === 10 &&
    result[4] === 11
);

result = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $lex.Then, $pattern.tokens, $lex.Else, $pattern.tokens],
    lex.part(1),
    true
);
console.log(
    Array.isArray(result) && result.length === 5 &&
    result[0] === 1 &&
    result[1] === 2 &&
    result[2] === 3 &&
    result[3] === 4 &&
    result[4] === 5
);

lex = new $lex.Lex(`lemo 0.1.0, node module
(x, y) -> x * y
`);

result = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $lex.ArrowFunction, $pattern.any],
    lex.part(1),
    true
);
console.log(
    Array.isArray(result) && result.length === 3 &&
    result[0] === 1 &&
    result[1] === 6 &&
    result[2] === 7
);

result = $pattern.Pattern.matchPattern(
    [$pattern.ParenthesisPair, $lex.ArrowFunction, $pattern.any],
    lex.part(1),
    true
);
console.log(
    Array.isArray(result) && result.length === 3 &&
    result[0] === 1 &&
    result[1] === 6 &&
    result[2] === 7
);

lex = new $lex.Lex(`lemo 0.1.0, node module
1 + 2 + 3
`);

result = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $lex.Plus, $pattern.tokens],
    lex.part(1),
    false
);
console.log(
    Array.isArray(result) && result.length === 3 &&
    result[0] === 1 &&
    result[1] === 4 &&
    result[2] === 5
);

lex = new $lex.Lex(`lemo 0.1.0, node module
abc(1, 2, 3)
`);
result = $pattern.Pattern.split(
    $lex.Comma,
    lex.part(3, 7)
);
console.log(
    Array.isArray(result) && result.length === 3 &&
    result[0] instanceof Object && result[0].startIndex === 3 && result[0].endIndex === 3 &&
    result[1] instanceof Object && result[1].startIndex === 5 && result[1].endIndex === 5 &&
    result[2] instanceof Object && result[2].startIndex === 7 && result[2].endIndex === 7
);

lex = new $lex.Lex(`lemo 0.1.0, node module
abc()
`);
result = $pattern.Pattern.split(
    $lex.Comma,
    lex.part(3, 2)
);
console.log(
    Array.isArray(result) && result.length === 1 &&
    result[0] instanceof Object && result[0].startIndex === 3 && result[0].endIndex === 2
);

lex = new $lex.Lex(`lemo 0.1.0, node module
a: {
    a: 1,
    b: 2, c: 3
}
`);
result = $pattern.Pattern.split(
    [$lex.Comma, $lex.Semicolon],
    lex.part(4, 14)
);
console.log(
    Array.isArray(result) && result.length === 3 &&
    result[0] instanceof Object && result[0].startIndex === 4 && result[0].endIndex === 6 &&
    result[1] instanceof Object && result[1].startIndex === 8 && result[1].endIndex === 10 &&
    result[2] instanceof Object && result[2].startIndex === 12 && result[2].endIndex === 14
);

lex = new $lex.Lex(`lemo 0.1.0, node module
a: [1, 2, 3]
`);
result = $pattern.Pattern.matchPattern(
    [$pattern.BracketPair],
    lex.part(1),
    true
);
console.log(result === null);

lex = new $lex.Lex(`lemo 0.1.0, node module
[1, 2, 3]
`);
result = $pattern.Pattern.matchPattern(
    [$pattern.BracketPair],
    lex.part(1),
    false
);
console.log(
    Array.isArray(result) && result.length === 1 &&
    result[0] === 1
);

lex = new $lex.Lex(`lemo 0.1.0, node module
a.b(5, 6)
`);
result = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $pattern.ParenthesisPair],
    lex.part(1),
    false
);
console.log(
    Array.isArray(result) && result.length === 2 &&
    result[0] === 1 &&
    result[1] === 4
);

lex = new $lex.Lex(`lemo 0.1.0, node module
a: 1 + 2 + 3
`);

result = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $lex.Plus, $pattern.tokens],
    lex.part(3, 7),
    false
);
console.log(
    Array.isArray(result) && result.length === 3 &&
    result[0] === 3 &&
    result[1] === 6 &&
    result[2] === 7
);

result = $pattern.Pattern.matchPatternCapture(
    [$pattern.tokens, $lex.Plus, $pattern.tokens],
    lex.part(3, 7),
    false,
    [0, 1, 2, null]
);
console.log(
    Array.isArray(result) && result.length === 4 &&
    result[0] instanceof Object && result[0].startIndex === 3 && result[0].endIndex === 5 &&
    result[1] instanceof Object && result[1].startIndex === 6 && result[1].endIndex === 6 &&
    result[2] instanceof Object && result[2].startIndex === 7 && result[2].endIndex === 7 &&
    result[3] === null
);

result = $pattern.Pattern.matchPatternCapture(
    [$pattern.tokens, $lex.Plus, $pattern.tokens],
    lex.part(3, 7),
    false,
    [0, [1, 2], null]
);
console.log(
    Array.isArray(result) && result.length === 3 &&
    result[0] instanceof Object && result[0].startIndex === 3 && result[0].endIndex === 5 &&
    result[1] instanceof Object && result[1].startIndex === 6 && result[1].endIndex === 7 &&
    result[2] === null
);

result = $pattern.Pattern.matchPatternCapture(
    [$pattern.tokens, $lex.Plus, $pattern.tokens],
    lex.part(3, 7),
    false,
    [null, 2, 0, 1]
);
console.log(
    Array.isArray(result) && result.length === 4 &&
    result[0] === null &&
    result[1] instanceof Object && result[1].startIndex === 7 && result[1].endIndex === 7 &&
    result[2] instanceof Object && result[2].startIndex === 3 && result[2].endIndex === 5 &&
    result[3] instanceof Object && result[3].startIndex === 6 && result[3].endIndex === 6
);

lex = new $lex.Lex(`lemo 0.1.0, node module
if a
else
    22
`);
result = $pattern.Pattern.matchPattern(
    [$lex.If, $pattern.tokensExcept([$lex.LeftChevron, $lex.Then]), $lex.Else, $pattern.any],
    lex.part(1),
    true
);
console.log(
    Array.isArray(result) && result.length === 4 &&
    result[0] === 1 &&
    result[1] === 2 &&
    result[2] === 3 &&
    result[3] === 4
);

lex = new $lex.Lex(`lemo 0.1.0, node module
a: 1 if b
`);
result = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $lex.If, $pattern.tokensExcept([$lex.LeftChevron, $lex.Then, $lex.Else])],
    lex.part(1),
    true
);
console.log(
    Array.isArray(result) && result.length === 3 &&
    result[0] === 1 &&
    result[1] === 4 &&
    result[2] === 5
);

lex = new $lex.Lex(`lemo 0.1.0, node module
a: b if c then d true
`);
result = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $lex.If, $pattern.tokensExcept([$lex.LeftChevron, $lex.Then, $lex.Else]), $lex.True],
    lex.part(1),
    true
);
console.log(result === null);

lex = new $lex.Lex(`lemo 0.1.0, node module
a: b if c then d
`);
result = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $lex.If, $pattern.tokensExcept([$lex.LeftChevron, $lex.Then, $lex.Else])],
    lex.part(1),
    true
);
console.log(result === null);

lex = new $lex.Lex(`lemo 0.1.0, node module
a b (c d) e
`);
result = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $pattern.ParenthesisPair, $pattern.tokens],
    lex.part(1),
    true
);
console.log(
    Array.isArray(result) && result.length === 3 &&
    result[0] === 1 &&
    result[1] === 3 &&
    result[2] === 7
);

lex = new $lex.Lex(`lemo 0.1.0, node module
if a
    b
else
`);
result = $pattern.Pattern.matchPattern(
    [$lex.If, $pattern.tokens, $pattern.ChevronPair, $lex.Else, $pattern.any],
    lex.part(1),
    true
);
console.log(
    Array.isArray(result) && result.length === 5 &&
    result[0] === 1 &&
    result[1] === 2 &&
    result[2] === 3 &&
    result[3] === 6 &&
    result[4] === 7
);

lex = new $lex.Lex(`lemo 0.1.0, node module
if if a then b
`);

result = $pattern.Pattern.matchPattern(
    [$lex.If, $pattern.tokens, $lex.Then, $pattern.tokens],
    lex.part(1),
    true
);
console.log(
    Array.isArray(result) && result.length === 4 &&
    result[0] === 1 &&
    result[1] === 2 &&
    result[2] === 4 &&
    result[3] === 5
);

result = $pattern.Pattern.matchPattern(
    [$lex.If, $pattern.tokensExcept([$lex.If]), $lex.Then, $pattern.tokens],
    lex.part(1),
    true
);
console.log(result === null);

lex = new $lex.Lex(`lemo 0.1.0, node module
a -> if b then c if d
`);
result = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $lex.If, $pattern.tokensExcept([$lex.Then])],
    lex.part(1),
    true
);
console.log(result === null);

lex = new $lex.Lex(`lemo 0.1.0, node module
a b c d
`);

result = $pattern.Pattern.matchPattern(
    [(token => token.value === "a"), $pattern.tokens],
    lex.part(1),
    true
);
console.log(
    Array.isArray(result) && result.length === 2 &&
    result[0] === 1 &&
    result[1] === 2
);

result = $pattern.Pattern.matchPattern(
    [(token => token.value === "b"), $pattern.tokens],
    lex.part(1),
    true
);
console.log(result === null);

lex = new $lex.Lex(`lemo 0.1.0, node module
(a) (b)
`);

result = $pattern.Pattern.searchOne(
    (token, index) => {
        let next = lex.at(index + 1);
        return token instanceof $lex.RightParenthesis && next instanceof $lex.NormalLeftParenthesis;
    },
    lex.part(1),
    true
);
console.log(result === 3);

result = $pattern.Pattern.searchOne(
    (token, index) => {
        let next = lex.at(index + 1);
        return token instanceof $lex.RightParenthesis && next instanceof $lex.CallLeftParenthesis;
    },
    lex.part(1),
    true
);
console.log(result === null);
