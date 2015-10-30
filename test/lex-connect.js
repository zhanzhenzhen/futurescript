import * as $lex from "../lib/compile-lex-0";
import assert from "assert";

let s = null;

s = new $lex.Lex(`lemo 0.1.0
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
console.log(s === 'NormalToken "bbb", Colon, Num "345", Semicolon, NormalToken "bbb", Colon, Num "345", Semicolon, NormalToken "ccc", Colon, NormalLeftBrace, NormalToken "a", Colon, Num "3", Semicolon, NormalToken "b", Colon, Num "0", RightBrace, Semicolon, NormalToken "ddd", Colon, NormalLeftBracket, Num "0", Semicolon, Num "8", RightBracket, Semicolon, NormalToken "b", Colon, Num "3", Plus, Num "5", Semicolon, NormalToken "b", Colon, Num "3", Plus, Num "5", Semicolon, NormalToken "b", Colon, Num "3", Plus, Num "5", Semicolon, NormalToken "b", Colon, Num "3", Plus, Num "5", Semicolon, NormalToken "b", Colon, Num "3", Semicolon, Positive, Num "5"');

s = new $lex.Lex(`lemo 0.1.0
b.a: a
.b
a.b <>
    aaa(@a)
.c()
`).toString();
console.log(s === 'NormalToken "b", Dot, NormalToken "a", Colon, NormalToken "a", Dot, NormalToken "b", Semicolon, NormalToken "a", Dot, NormalToken "b", DiamondFunction, LeftChevron, NormalToken "aaa", CallLeftParenthesis, Arg, Dot, NormalToken "a", RightParenthesis, RightChevron, Dot, NormalToken "c", CallLeftParenthesis, RightParenthesis');

s = new $lex.Lex(`lemo 0.1.0
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
console.log(s === 'NormalToken "a", Colon, Num "3", As, NormalToken "c", Semicolon, NormalToken "a", Colon, NormalLeftBracket, NormalToken "x", ArrowFunction, LeftChevron, NormalToken "aaa", CallLeftParenthesis, NormalToken "x", RightParenthesis, RightChevron, As, NormalToken "c", Semicolon, DiamondFunction, As, NormalToken "d", Semicolon, Num "4", RightBracket, Semicolon, NormalToken "a", ExportAs, NormalToken "b"');

s = new $lex.Lex(`lemo 0.1.0
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
console.log(s === 'NormalToken "x", Colon, Num "2", As, NormalToken "a", Semicolon, NormalToken "x", Colon, Num "2", As, NormalToken "a", Semicolon, NormalToken "x", Colon, Num "2", As, NormalToken "a"');

s = new $lex.Lex(`lemo 0.1.0
a: {
    aaa: 1,
    bbb: 2
}
`).toString();
console.log(s === 'NormalToken "a", Colon, NormalLeftBrace, NormalToken "aaa", Colon, Num "1", Comma, NormalToken "bbb", Colon, Num "2", RightBrace');

s = new $lex.Lex(`lemo 0.1.0
a: {
    aaa: 1
    ,
    bbb: 2
}
`).toString();
console.log(s === 'NormalToken "a", Colon, NormalLeftBrace, NormalToken "aaa", Colon, Num "1", Comma, NormalToken "bbb", Colon, Num "2", RightBrace');
