import * as $api from "../test-locked-api.js";
import {test, assert, code} from "./test-base.js";
import * as $lex from "./lex.js";

let s = null;
let lex = null;

test(() => {
s = new $lex.Lex(code`
a: {aaa, bbb, ccc}
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "a", Colon, NormalLeftBrace, NormalToken "aaa", Colon, True, Comma, NormalToken "bbb", Colon, True, Comma, NormalToken "ccc", Colon, True, NormalRightBrace`);
}); // ============================================================

test(() => {
s = new $lex.Lex(code`
a: {aaa bbb ccc}
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "a", Colon, NormalLeftBrace, InlineNormalString, PseudoCallLeftParenthesis, Str "", PseudoCallRightParenthesis, Colon, NormalToken "aaa", Comma, NormalToken "bbb", Colon, NormalToken "ccc", NormalRightBrace`);
}); // ============================================================

test(() => {
s = new $lex.Lex(code`
a{aaa false x -> true}
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "a", CallLeftBrace, InlineNormalString, PseudoCallLeftParenthesis, Str "", PseudoCallRightParenthesis, Colon, NormalToken "aaa", Comma, NormalToken "false", Colon, NormalToken "x", ArrowFunction, True, CallRightBrace`);
}); // ============================================================

test(() => {
s = new $lex.Lex(code`
<> a{fun fun <> fun fun}
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", DiamondFunction, NormalToken "a", CallLeftBrace, InlineNormalString, PseudoCallLeftParenthesis, Str "", PseudoCallRightParenthesis, Colon, Fun, Comma, NormalToken "fun", Colon, DiamondFunction, Fun, Fun, CallRightBrace`);
}); // ============================================================

test(() => {
s = new $lex.Lex(code`
{a}
{a b}
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalLeftBrace, NormalToken "a", Colon, True, NormalRightBrace, Semicolon, NormalLeftBrace, NormalToken "a", Colon, NormalToken "b", NormalRightBrace`);
}); // ============================================================

test(() => {
s = new $lex.Lex(code`
{is a + 1 isnt b |> c.d}
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalLeftBrace, NormalToken "is", Colon, NormalToken "a", Plus, Num "1", Comma, NormalToken "isnt", Colon, NormalToken "b", Pipe, NormalToken "c", Dot, NormalToken "d", NormalRightBrace`);
}); // ============================================================

test(() => {
s = new $lex.Lex(code`
{
    a
    b
    c
}
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalLeftBrace, NormalToken "a", Colon, True, Semicolon, NormalToken "b", Colon, True, Semicolon, NormalToken "c", Colon, True, NormalRightBrace`);
}); // ============================================================

test(() => {
s = new $lex.Lex(code`
repeat{1 to 5 for i ->
    a(i)
}
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "repeat", CallLeftBrace, InlineNormalString, PseudoCallLeftParenthesis, Str "", PseudoCallRightParenthesis, Colon, Num "1", Comma, NormalToken "to", Colon, Num "5", Comma, NormalToken "for", Colon, NormalToken "i", ArrowFunction, LeftChevron, NormalToken "a", CallLeftParenthesis, NormalToken "i", CallRightParenthesis, RightChevron, CallRightBrace`);
}); // ============================================================

test(() => {
s = new $lex.Lex(code`
{a b(1) c d[2] e f{g}}
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalLeftBrace, NormalToken "a", Colon, NormalToken "b", CallLeftParenthesis, Num "1", CallRightParenthesis, Comma, NormalToken "c", Colon, NormalToken "d", CallLeftBracket, Num "2", CallRightBracket, Comma, NormalToken "e", Colon, NormalToken "f", CallLeftBrace, NormalToken "g", Colon, True, CallRightBrace, NormalRightBrace`);
}); // ============================================================
