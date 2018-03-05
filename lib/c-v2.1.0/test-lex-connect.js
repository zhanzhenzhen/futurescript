import * as $api from "../test-locked-api.js";
import {test, assert, code} from "./test-base.js";
import * as $lex from "./lex.js";

test(async () => {
let s = new $lex.Lex(code`
bbb:
    345
bbb:
345
ccc: {
    a: 3
    b: 0
}
ddd: [
    0
    8
]
b: 3 +
    5
b: 3 +
5
b: 3
+ 5
b: 3
    + 5
b: 3
+5
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "bbb", Colon, Num "345", Semicolon, NormalToken "bbb", Colon, Num "345", Semicolon, NormalToken "ccc", Colon, NormalLeftBrace, NormalToken "a", Colon, Num "3", Semicolon, NormalToken "b", Colon, Num "0", NormalRightBrace, Semicolon, NormalToken "ddd", Colon, NormalLeftBracket, Num "0", Semicolon, Num "8", NormalRightBracket, Semicolon, NormalToken "b", Colon, Num "3", Plus, Num "5", Semicolon, NormalToken "b", Colon, Num "3", Plus, Num "5", Semicolon, NormalToken "b", Colon, Num "3", Plus, Num "5", Semicolon, NormalToken "b", Colon, Num "3", Plus, Num "5", Semicolon, NormalToken "b", Colon, Num "3", Semicolon, Positive, Num "5"`);
}); // ============================================================

test(async () => {
let s = new $lex.Lex(code`
b.a: a
.b
a.b <>
    aaa(@a)
.c()
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "b", Dot, NormalToken "a", Colon, NormalToken "a", Dot, NormalToken "b", Semicolon, NormalToken "a", Dot, NormalToken "b", DiamondFunction, LeftChevron, NormalToken "aaa", CallLeftParenthesis, Arg, Dot, NormalToken "a", CallRightParenthesis, RightChevron, Dot, NormalToken "c", CallLeftParenthesis, CallRightParenthesis`);
}); // ============================================================

test(async () => {
let s = new $lex.Lex(code`
a: 3
as c
a: [
    x ->
        aaa(x)
    as c
    <>
    above as d
    4
]
a
export as b
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "a", Colon, Num "3", As, NormalToken "c", Semicolon, NormalToken "a", Colon, NormalLeftBracket, NormalToken "x", ArrowFunction, LeftChevron, NormalToken "aaa", CallLeftParenthesis, NormalToken "x", CallRightParenthesis, RightChevron, As, NormalToken "c", Semicolon, DiamondFunction, As, NormalToken "d", Semicolon, Num "4", NormalRightBracket, Semicolon, NormalToken "a", ExportAs, NormalToken "b"`);
}); // ============================================================

test(async () => {
let s = new $lex.Lex(code`
x: 2 as
a
x: 2
as
a
x
:
2
as
a
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "x", Colon, Num "2", As, NormalToken "a", Semicolon, NormalToken "x", Colon, Num "2", As, NormalToken "a", Semicolon, NormalToken "x", Colon, Num "2", As, NormalToken "a"`);
}); // ============================================================

test(async () => {
let s = new $lex.Lex(code`
a: {
    aaa: 1,
    bbb: 2
}
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "a", Colon, NormalLeftBrace, NormalToken "aaa", Colon, Num "1", Comma, NormalToken "bbb", Colon, Num "2", NormalRightBrace`);
}); // ============================================================

test(async () => {
let s = new $lex.Lex(code`
a: {
    aaa: 1
    ,
    bbb: 2
}
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "a", Colon, NormalLeftBrace, NormalToken "aaa", Colon, Num "1", Comma, NormalToken "bbb", Colon, Num "2", NormalRightBrace`);
}); // ============================================================

test(async () => {
let s = new $lex.Lex(code`
a:
    {
        b: 1
        c: {
            d:
                2
            e: 3
        }
        f:
            [
                4
                5
            ]
    }
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "a", Colon, NormalLeftBrace, NormalToken "b", Colon, Num "1", Semicolon, NormalToken "c", Colon, NormalLeftBrace, NormalToken "d", Colon, Num "2", Semicolon, NormalToken "e", Colon, Num "3", NormalRightBrace, Semicolon, NormalToken "f", Colon, NormalLeftBracket, Num "4", Semicolon, Num "5", NormalRightBracket, NormalRightBrace`);
}); // ============================================================

test(async () => {
let s = new $lex.Lex(code`
a:
    {
        "a": 3

        "b":
            "iii",
        "c":3+
            5,
        "d"

        :
            9
    }
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "a", Colon, NormalLeftBrace, InlineNormalString, PseudoCallLeftParenthesis, Str "a", PseudoCallRightParenthesis, Colon, Num "3", Semicolon, InlineNormalString, PseudoCallLeftParenthesis, Str "b", PseudoCallRightParenthesis, Colon, InlineNormalString, PseudoCallLeftParenthesis, Str "iii", PseudoCallRightParenthesis, Comma, InlineNormalString, PseudoCallLeftParenthesis, Str "c", PseudoCallRightParenthesis, Colon, Num "3", Plus, Num "5", Comma, InlineNormalString, PseudoCallLeftParenthesis, Str "d", PseudoCallRightParenthesis, Colon, Num "9", NormalRightBrace`);
}); // ============================================================

test(async () => {
let s = new $lex.Lex(code`
a(
    1,
    2
)
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "a", CallLeftParenthesis, Num "1", Comma, Num "2", CallRightParenthesis`);
}); // ============================================================

test(async () => {
let s = new $lex.Lex(code`
a(
    1
    2
)
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "a", CallLeftParenthesis, Num "1", Semicolon, Num "2", CallRightParenthesis`);
}); // ============================================================

test(async () => {
let s = new $lex.Lex(code`
(
    a,
    b
) -> 1
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalLeftParenthesis, NormalToken "a", Comma, NormalToken "b", NormalRightParenthesis, ArrowFunction, Num "1"`);
}); // ============================================================

test(async () => {
let s = new $lex.Lex(code`
(
    a
    b
) -> 1
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalLeftParenthesis, NormalToken "a", Semicolon, NormalToken "b", NormalRightParenthesis, ArrowFunction, Num "1"`);
}); // ============================================================
