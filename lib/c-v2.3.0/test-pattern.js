import {test, assert, code} from "./test-base.js";
import * as $lex from "./lex.js";
import * as $pattern from "./pattern.js";

let lex, r;

test(() => {
lex = new $lex.Lex(code`, node modules
a: 1
`);

r = $pattern.Pattern.searchOne(
    $lex.Colon,
    lex.part(1),
    true
);
assert(r === 2);

r = $pattern.Pattern.matchPattern(
    [$lex.NormalToken, $pattern.any, $lex.Colon, $pattern.tokens],
    lex.part(1),
    true
);
assert(
    Array.isArray(r) && r.length === 4 &&
    r[0] === 1 &&
    r[1] === 2 &&
    r[2] === 2 &&
    r[3] === 3
);

r = $pattern.Pattern.matchPattern(
    [$lex.NormalToken, $pattern.any, $lex.Colon, $pattern.tokens],
    lex.part(1),
    false
);
assert(
    Array.isArray(r) && r.length === 4 &&
    r[0] === 1 &&
    r[1] === 2 &&
    r[2] === 2 &&
    r[3] === 3
);

r = $pattern.Pattern.matchPatternCapture(
    [$lex.NormalToken, $pattern.any, $lex.Colon, $pattern.tokens],
    lex.part(1),
    true,
    [1, 3]
);
assert(
    Array.isArray(r) && r.length === 2 &&
    r[0] instanceof Object && r[0].startIndex === 2 && r[0].endIndex === 1 &&
    r[1] instanceof Object && r[1].startIndex === 3 && r[1].endIndex === 3
);

r = $pattern.Pattern.matchPatternsAndCaptures(
    [
        [[$lex.NormalToken, $pattern.any, $lex.Colon, $pattern.tokens], [1, 3]]
    ],
    lex.part(1),
    true
);
assert(
    Array.isArray(r) && r.length === 2 &&
    r[0] instanceof Object && r[0].startIndex === 2 && r[0].endIndex === 1 &&
    r[1] instanceof Object && r[1].startIndex === 3 && r[1].endIndex === 3
);

r = $pattern.Pattern.matchPattern(
    [$lex.NormalToken, $pattern.tokens, $lex.Colon, $pattern.tokens],
    lex.part(1),
    true
);
assert(r === null);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
if a = 1
    b: 1
else
    b: 2
`);

r = $pattern.Pattern.matchPattern(
    [$pattern.any, $lex.NormalToken, $lex.Equal, $pattern.any],
    lex.part(1),
    true
);
assert(
    Array.isArray(r) && r.length === 4 &&
    r[0] === 1 &&
    r[1] === 2 &&
    r[2] === 3 &&
    r[3] === 4
);

r = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $lex.NormalToken, $lex.Equal, $pattern.tokens],
    lex.part(1),
    true
);
assert(
    Array.isArray(r) && r.length === 4 &&
    r[0] === 1 &&
    r[1] === 2 &&
    r[2] === 3 &&
    r[3] === 4
);

r = $pattern.Pattern.matchPattern(
    [$lex.If, $pattern.any, $pattern.ChevronPair, $lex.Else, $pattern.ChevronPair],
    lex.part(1),
    true
);
assert(
    Array.isArray(r) && r.length === 5 &&
    r[0] === 1 &&
    r[1] === 2 &&
    r[2] === 5 &&
    r[3] === 10 &&
    r[4] === 11
);

r = $pattern.Pattern.matchPattern(
    [$lex.If, $pattern.tokens, $pattern.ChevronPair, $lex.Else, $pattern.ChevronPair],
    lex.part(1),
    true
);
assert(
    Array.isArray(r) && r.length === 5 &&
    r[0] === 1 &&
    r[1] === 2 &&
    r[2] === 5 &&
    r[3] === 10 &&
    r[4] === 11
);

r = $pattern.Pattern.matchPatternCapture(
    [$lex.If, $pattern.tokens, $pattern.ChevronPair, $lex.Else, $pattern.ChevronPair],
    lex.part(1),
    true,
    [1, 2, 4]
);
assert(
    Array.isArray(r) && r.length === 3 &&
    r[0] instanceof Object && r[0].startIndex === 2 && r[0].endIndex === 4 &&
    r[1] instanceof Object && r[1].startIndex === 5 && r[1].endIndex === 9 &&
    r[2] instanceof Object && r[2].startIndex === 11 && r[2].endIndex === 15
);

r = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $lex.Else, $pattern.ChevronPair],
    lex.part(1),
    true
);
assert(
    Array.isArray(r) && r.length === 3 &&
    r[0] === 1 &&
    r[1] === 10 &&
    r[2] === 11
);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
a ? b | c + d ? e | f
`);

r = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $lex.Then, $pattern.tokens, $lex.Else, $pattern.tokens],
    lex.part(1),
    false
);
assert(
    Array.isArray(r) && r.length === 5 &&
    r[0] === 1 &&
    r[1] === 8 &&
    r[2] === 9 &&
    r[3] === 10 &&
    r[4] === 11
);

r = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $lex.Then, $pattern.tokens, $lex.Else, $pattern.tokens],
    lex.part(1),
    true
);
assert(
    Array.isArray(r) && r.length === 5 &&
    r[0] === 1 &&
    r[1] === 2 &&
    r[2] === 3 &&
    r[3] === 4 &&
    r[4] === 5
);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
(x, y) -> x * y
`);

r = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $lex.ArrowFunction, $pattern.any],
    lex.part(1),
    true
);
assert(
    Array.isArray(r) && r.length === 3 &&
    r[0] === 1 &&
    r[1] === 6 &&
    r[2] === 7
);

r = $pattern.Pattern.matchPattern(
    [$pattern.ParenthesisPair, $lex.ArrowFunction, $pattern.any],
    lex.part(1),
    true
);
assert(
    Array.isArray(r) && r.length === 3 &&
    r[0] === 1 &&
    r[1] === 6 &&
    r[2] === 7
);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
1 + 2 + 3
`);

r = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $lex.Plus, $pattern.tokens],
    lex.part(1),
    false
);
assert(
    Array.isArray(r) && r.length === 3 &&
    r[0] === 1 &&
    r[1] === 4 &&
    r[2] === 5
);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
abc(1, 2, 3)
`);

r = $pattern.Pattern.split(
    $lex.Comma,
    lex.part(3, 7)
);
assert(
    Array.isArray(r) && r.length === 3 &&
    r[0] instanceof Object && r[0].startIndex === 3 && r[0].endIndex === 3 &&
    r[1] instanceof Object && r[1].startIndex === 5 && r[1].endIndex === 5 &&
    r[2] instanceof Object && r[2].startIndex === 7 && r[2].endIndex === 7
);

r = $pattern.Pattern.split(
    $lex.Comma,
    lex.part(3, 2)
);
assert(
    Array.isArray(r) && r.length === 1 &&
    r[0] instanceof Object && r[0].startIndex === 3 && r[0].endIndex === 2
);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
abc()
`);

r = $pattern.Pattern.split(
    $lex.Comma,
    lex.part(3, 2)
);
assert(
    Array.isArray(r) && r.length === 1 &&
    r[0] instanceof Object && r[0].startIndex === 3 && r[0].endIndex === 2
);

r = $pattern.Pattern.split(
    $lex.Comma,
    lex.part(1)
);
assert(
    Array.isArray(r) && r.length === 1 &&
    r[0] instanceof Object && r[0].startIndex === 1 && r[0].endIndex === 3
);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
true false false true false true
`);
r = $pattern.Pattern.split(
    $lex.True,
    lex.part(1)
);
assert(
    Array.isArray(r) && r.length === 4 &&
    r[0] instanceof Object && r[0].startIndex === 1 && r[0].endIndex === 0 &&
    r[1] instanceof Object && r[1].startIndex === 2 && r[1].endIndex === 3 &&
    r[2] instanceof Object && r[2].startIndex === 5 && r[2].endIndex === 5 &&
    r[3] instanceof Object && r[3].startIndex === 7 && r[3].endIndex === 6
);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
true true false true true false true true
`);
r = $pattern.Pattern.split(
    $lex.True,
    lex.part(1)
);
assert(
    Array.isArray(r) && r.length === 7 &&
    r[0] instanceof Object && r[0].startIndex === 1 && r[0].endIndex === 0 &&
    r[1] instanceof Object && r[1].startIndex === 2 && r[1].endIndex === 1 &&
    r[2] instanceof Object && r[2].startIndex === 3 && r[2].endIndex === 3 &&
    r[3] instanceof Object && r[3].startIndex === 5 && r[3].endIndex === 4 &&
    r[4] instanceof Object && r[4].startIndex === 6 && r[4].endIndex === 6 &&
    r[5] instanceof Object && r[5].startIndex === 8 && r[5].endIndex === 7 &&
    r[6] instanceof Object && r[6].startIndex === 9 && r[6].endIndex === 8
);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
a: {
    a: 1,
    b: 2, c: 3
}
`);
r = $pattern.Pattern.split(
    [$lex.Comma, $lex.Semicolon],
    lex.part(4, 14)
);
assert(
    Array.isArray(r) && r.length === 3 &&
    r[0] instanceof Object && r[0].startIndex === 4 && r[0].endIndex === 6 &&
    r[1] instanceof Object && r[1].startIndex === 8 && r[1].endIndex === 10 &&
    r[2] instanceof Object && r[2].startIndex === 12 && r[2].endIndex === 14
);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
a: {
    a: 1
    b: 2, c: 3
}
`);
r = $pattern.Pattern.split(
    [$lex.Comma, $lex.Semicolon],
    lex.part(4, 14)
);
assert(
    Array.isArray(r) && r.length === 3 &&
    r[0] instanceof Object && r[0].startIndex === 4 && r[0].endIndex === 6 &&
    r[1] instanceof Object && r[1].startIndex === 8 && r[1].endIndex === 10 &&
    r[2] instanceof Object && r[2].startIndex === 12 && r[2].endIndex === 14
);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
a: [1, 2, 3]
`);
r = $pattern.Pattern.matchPattern(
    [$pattern.BracketPair],
    lex.part(1),
    true
);
assert(r === null);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
[1, 2, 3]
`);
r = $pattern.Pattern.matchPattern(
    [$pattern.BracketPair],
    lex.part(1),
    false
);
assert(
    Array.isArray(r) && r.length === 1 &&
    r[0] === 1
);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
a.b(5, 6)
`);
r = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $pattern.ParenthesisPair],
    lex.part(1),
    false
);
assert(
    Array.isArray(r) && r.length === 2 &&
    r[0] === 1 &&
    r[1] === 4
);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
a: 1 + 2 + 3
`);

r = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $lex.Plus, $pattern.tokens],
    lex.part(3, 7),
    false
);
assert(
    Array.isArray(r) && r.length === 3 &&
    r[0] === 3 &&
    r[1] === 6 &&
    r[2] === 7
);

r = $pattern.Pattern.matchPatternCapture(
    [$pattern.tokens, $lex.Plus, $pattern.tokens],
    lex.part(3, 7),
    false,
    [0, 1, 2, null]
);
assert(
    Array.isArray(r) && r.length === 4 &&
    r[0] instanceof Object && r[0].startIndex === 3 && r[0].endIndex === 5 &&
    r[1] instanceof Object && r[1].startIndex === 6 && r[1].endIndex === 6 &&
    r[2] instanceof Object && r[2].startIndex === 7 && r[2].endIndex === 7 &&
    r[3] === null
);

r = $pattern.Pattern.matchPatternCapture(
    [$pattern.tokens, $lex.Plus, $pattern.tokens],
    lex.part(3, 7),
    false,
    [0, [1, 2], null]
);
assert(
    Array.isArray(r) && r.length === 3 &&
    r[0] instanceof Object && r[0].startIndex === 3 && r[0].endIndex === 5 &&
    r[1] instanceof Object && r[1].startIndex === 6 && r[1].endIndex === 7 &&
    r[2] === null
);

r = $pattern.Pattern.matchPatternCapture(
    [$pattern.tokens, $lex.Plus, $pattern.tokens],
    lex.part(3, 7),
    false,
    [null, 2, 0, 1]
);
assert(
    Array.isArray(r) && r.length === 4 &&
    r[0] === null &&
    r[1] instanceof Object && r[1].startIndex === 7 && r[1].endIndex === 7 &&
    r[2] instanceof Object && r[2].startIndex === 3 && r[2].endIndex === 5 &&
    r[3] instanceof Object && r[3].startIndex === 6 && r[3].endIndex === 6
);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
if a
else
    22
`);
r = $pattern.Pattern.matchPattern(
    [$lex.If, $pattern.tokensExcept([$lex.LeftChevron, $lex.Then]), $lex.Else, $pattern.any],
    lex.part(1),
    true
);
assert(
    Array.isArray(r) && r.length === 4 &&
    r[0] === 1 &&
    r[1] === 2 &&
    r[2] === 3 &&
    r[3] === 4
);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
a: 1 if b
`);
r = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $lex.If, $pattern.tokensExcept([$lex.LeftChevron, $lex.Then, $lex.Else])],
    lex.part(1),
    true
);
assert(
    Array.isArray(r) && r.length === 3 &&
    r[0] === 1 &&
    r[1] === 4 &&
    r[2] === 5
);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
a: b if c then d true
`);
r = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $lex.If, $pattern.tokensExcept([$lex.LeftChevron, $lex.Then, $lex.Else]), $lex.True],
    lex.part(1),
    true
);
assert(r === null);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
a: b if c then d
`);
r = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $lex.If, $pattern.tokensExcept([$lex.LeftChevron, $lex.Then, $lex.Else])],
    lex.part(1),
    true
);
assert(r === null);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
a b (c d) e
`);
r = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $pattern.ParenthesisPair, $pattern.tokens],
    lex.part(1),
    true
);
assert(
    Array.isArray(r) && r.length === 3 &&
    r[0] === 1 &&
    r[1] === 3 &&
    r[2] === 7
);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
if a
    b
else
`);
r = $pattern.Pattern.matchPattern(
    [$lex.If, $pattern.tokens, $pattern.ChevronPair, $lex.Else, $pattern.any],
    lex.part(1),
    true
);
assert(
    Array.isArray(r) && r.length === 5 &&
    r[0] === 1 &&
    r[1] === 2 &&
    r[2] === 3 &&
    r[3] === 6 &&
    r[4] === 7
);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
if if a then b
`);

r = $pattern.Pattern.matchPattern(
    [$lex.If, $pattern.tokens, $lex.Then, $pattern.tokens],
    lex.part(1),
    true
);
assert(
    Array.isArray(r) && r.length === 4 &&
    r[0] === 1 &&
    r[1] === 2 &&
    r[2] === 4 &&
    r[3] === 5
);

r = $pattern.Pattern.matchPattern(
    [$lex.If, $pattern.tokensExcept([$lex.If]), $lex.Then, $pattern.tokens],
    lex.part(1),
    true
);
assert(r === null);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
a -> if b then c if d
`);
r = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $lex.If, $pattern.tokensExcept([$lex.Then])],
    lex.part(1),
    true
);
assert(r === null);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
a b c d
`);

r = $pattern.Pattern.matchPattern(
    [(token => token.value === "a"), $pattern.tokens],
    lex.part(1),
    true
);
assert(
    Array.isArray(r) && r.length === 2 &&
    r[0] === 1 &&
    r[1] === 2
);

r = $pattern.Pattern.matchPattern(
    [(token => token.value === "b"), $pattern.tokens],
    lex.part(1),
    true
);
assert(r === null);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
(a) (b)
`);

r = $pattern.Pattern.searchOne(
    (token, index) => {
        let next = lex.at(index + 1);
        return token instanceof $lex.RightParenthesis && next instanceof $lex.NormalLeftParenthesis;
    },
    lex.part(1),
    true
);
assert(r === 3);

r = $pattern.Pattern.searchOne(
    (token, index) => {
        let next = lex.at(index + 1);
        return token instanceof $lex.RightParenthesis && next instanceof $lex.CallLeftParenthesis;
    },
    lex.part(1),
    true
);
assert(r === null);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
a |> b.c :: d
`);

r = $pattern.Pattern.matchPatternsAndCaptures(
    [
        [[$pattern.tokens, $lex.Dot, $pattern.tokens], [0, 2]],
        [[$pattern.tokens, $lex.FatDot, $pattern.tokens], [0, 2]]
    ],
    lex.part(1),
    false
);
assert(
    Array.isArray(r) && r.length === 2 &&
    r[0] instanceof Object && r[0].startIndex === 1 && r[0].endIndex === 5 &&
    r[1] instanceof Object && r[1].startIndex === 7 && r[1].endIndex === 7
);

r = $pattern.Pattern.matchPatternsAndCaptures(
    [
        [[$pattern.tokens, $lex.Dot, $pattern.tokens], [0, 2]],
        [[$pattern.tokens, $lex.FatDot, $pattern.tokens], [0, 2]]
    ],
    lex.part(1),
    false,
    true
);
assert(
    r instanceof Object && (
        Array.isArray(r.selected) && r.selected.length === 2 &&
        r.selected[0] instanceof Object &&
            r.selected[0].startIndex === 1 && r.selected[0].endIndex === 5 &&
        r.selected[1] instanceof Object &&
            r.selected[1].startIndex === 7 && r.selected[1].endIndex === 7
    ) && (
        Array.isArray(r.all) && r.all.length === 3 &&
        r.all[0] instanceof Object && r.all[0].startIndex === 1 && r.all[0].endIndex === 5 &&
        r.all[1] instanceof Object && r.all[1].startIndex === 6 && r.all[1].endIndex === 6 &&
        r.all[2] instanceof Object && r.all[2].startIndex === 7 && r.all[2].endIndex === 7
    )
);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
import "aaa"
`);
r = $pattern.Pattern.matchPattern(
    [$pattern.tokensExcept([$lex.InlineNormalString]), $pattern.PseudoCallParenthesisPair],
    lex.part(1),
    false
);
assert(r === null);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
true true true true
`);
r = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $lex.True, $pattern.tokens],
    lex.part(1),
    false
);
assert(
    Array.isArray(r) && r.length === 3 &&
    r[0] === 1 &&
    r[1] === 3 &&
    r[2] === 4
);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
true true true true
`);
r = $pattern.Pattern.matchPattern(
    [$pattern.tokens, $lex.True, $pattern.tokens],
    lex.part(1),
    true
);
assert(
    Array.isArray(r) && r.length === 3 &&
    r[0] === 1 &&
    r[1] === 2 &&
    r[2] === 3
);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
true true true true
`);
r = $pattern.Pattern.matchPattern(
    [$pattern.any, $lex.True, $pattern.any],
    lex.part(1),
    false
);
assert(
    Array.isArray(r) && r.length === 3 &&
    r[0] === 1 &&
    r[1] === 4 &&
    r[2] === 5
);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
true true true true
`);
r = $pattern.Pattern.matchPattern(
    [$pattern.any, $lex.True, $pattern.any],
    lex.part(1),
    true
);
assert(
    Array.isArray(r) && r.length === 3 &&
    r[0] === 1 &&
    r[1] === 1 &&
    r[2] === 2
);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
true and false
`);

r = $pattern.Pattern.matchPattern(
    [$pattern.tokensExcept([$lex.Or]), $lex.True, $lex.And, $lex.False],
    lex.part(1),
    false
);
assert(r === null);

r = $pattern.Pattern.matchPattern(
    [$pattern.anyExcept([$lex.Or]), $lex.True, $lex.And, $lex.False],
    lex.part(1),
    false
);
assert(
    Array.isArray(r) && r.length === 4 &&
    r[0] === 1 &&
    r[1] === 1 &&
    r[2] === 2 &&
    r[3] === 3
);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
1
`);

r = $pattern.Pattern.matchPattern(
    [$pattern.tokensExcept([$lex.Or])],
    lex.part(1),
    false
);
assert(
    Array.isArray(r) && r.length === 1 &&
    r[0] === 1
);

r = $pattern.Pattern.matchPattern(
    [$pattern.tokensExcept([$lex.Num])],
    lex.part(1),
    false
);
assert(r === null);

r = $pattern.Pattern.matchPattern(
    [$pattern.anyExcept([$lex.Or])],
    lex.part(1),
    false
);
assert(
    Array.isArray(r) && r.length === 1 &&
    r[0] === 1
);

r = $pattern.Pattern.matchPattern(
    [$pattern.anyExcept([$lex.Num])],
    lex.part(1),
    false
);
assert(r === null);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
"aaa"
`);
r = $pattern.Pattern.matchPattern(
    [$lex.InlineNormalString, $pattern.PseudoCallParenthesisPair],
    lex.part(1),
    true
);
assert(
    Array.isArray(r) && r.length === 2 &&
    r[0] === 1 &&
    r[1] === 2
);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
pause
`);

r = $pattern.Pattern.matchPatternCapture(
    [$lex.Pause],
    lex.part(1),
    true,
    []
);
assert(
    Array.isArray(r) && r.length === 0
);

r = $pattern.Pattern.matchPatternsAndCaptures(
    [
        [[$lex.Pause], []]
    ],
    lex.part(1),
    true
);
assert(
    Array.isArray(r) && r.length === 0
);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
if a
    b
`);

r = $pattern.Pattern.matchPattern(
    [$lex.If, $lex.NormalToken, (token => token instanceof $lex.LeftChevron)],
    lex.part(1),
    true
);
assert(
    Array.isArray(r) && r.length === 3 &&
    r[0] === 1 &&
    r[1] === 2 &&
    r[2] === 3
);

r = $pattern.Pattern.matchPattern(
    [$lex.If, $lex.NormalToken, $lex.LeftChevron],
    lex.part(1),
    true
);
assert(
    Array.isArray(r) && r.length === 3 &&
    r[0] === 1 &&
    r[1] === 2 &&
    r[2] === 3
);

r = $pattern.Pattern.matchPattern(
    [$lex.If, $lex.NormalToken, $lex.LeftChevron, $lex.RightChevron],
    lex.part(1),
    true
);
assert(r === null);

r = $pattern.Pattern.matchPattern(
    [$lex.If, $lex.NormalToken, $lex.LeftChevron, $pattern.tokens],
    lex.part(1),
    true
);
assert(r === null);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
(a.b)(1 + 2 + 3)
`);

r = $pattern.Pattern.matchPattern(
    [$pattern.ParenthesisPair, $pattern.any, $pattern.ParenthesisPair],
    lex.part(1),
    true
);
assert(
    Array.isArray(r) && r.length === 3 &&
    r[0] === 1 &&
    r[1] === 6 &&
    r[2] === 6
);

r = $pattern.Pattern.matchPattern(
    [$pattern.ParenthesisPair, $pattern.any, $pattern.ParenthesisPair],
    lex.part(1),
    false
);
assert(
    Array.isArray(r) && r.length === 3 &&
    r[0] === 1 &&
    r[1] === 6 &&
    r[2] === 6
);
}); // ============================================================

test(() => {
lex = new $lex.Lex(code`, node modules
a
`);

r = $pattern.Pattern.matchPattern(
    [$lex.NormalToken],
    lex.part(1, 0),
    true
);
assert(r === null);

r = $pattern.Pattern.matchPattern(
    [$pattern.tokens],
    lex.part(1, 0),
    true
);
assert(r === null);

r = $pattern.Pattern.matchPattern(
    [$pattern.any],
    lex.part(1, 0),
    true
);
assert(
    Array.isArray(r) && r.length === 1 &&
    r[0] === 1
);

r = $pattern.Pattern.matchPattern(
    [$pattern.any],
    lex.part(1, 0),
    false
);
assert(
    Array.isArray(r) && r.length === 1 &&
    r[0] === 1
);

r = $pattern.Pattern.matchPattern(
    [],
    lex.part(1, 0),
    true
);
assert(
    Array.isArray(r) && r.length === 0
);

r = $pattern.Pattern.matchPattern(
    [],
    lex.part(1, 0),
    false
);
assert(
    Array.isArray(r) && r.length === 0
);

r = $pattern.Pattern.matchPattern(
    [],
    lex.part(1),
    true
);
assert(r === null);

r = $pattern.Pattern.matchPattern(
    [],
    lex.part(1),
    false
);
assert(r === null);
}); // ============================================================
