import * as $api from "../test-locked-api.js";
import {test, assert, code} from "./test-base.js";
import * as $lex from "./lex.js";

let s = null;

test(async () => {
let s = new $lex.Lex(code`
x: "abc"
x: "
    abc
"
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "x", Colon, InlineNormalString, PseudoCallLeftParenthesis, Str "abc", PseudoCallRightParenthesis, Semicolon, NormalToken "x", Colon, FormattedNormalString, PseudoCallLeftParenthesis, Str "abc", PseudoCallRightParenthesis`);
}); // ============================================================

test(async () => {
let s = new $lex.Lex(code`
x: "abc \n\" def"
x: "
    abc \n\" def
"
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "x", Colon, InlineNormalString, PseudoCallLeftParenthesis, Str "abc \\n\\\" def", PseudoCallRightParenthesis, Semicolon, NormalToken "x", Colon, FormattedNormalString, PseudoCallLeftParenthesis, Str "abc \\n\\\" def", PseudoCallRightParenthesis`);
}); // ============================================================

test(async () => {
let s = new $lex.Lex(code`
x: "abc \(def) ghi"
x: "
    abc \(def) ghi
"
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "x", Colon, InlineNormalString, PseudoCallLeftParenthesis, Str "abc ", Plus, NormalLeftParenthesis, NormalToken "def", NormalRightParenthesis, Plus, Str " ghi", PseudoCallRightParenthesis, Semicolon, NormalToken "x", Colon, FormattedNormalString, PseudoCallLeftParenthesis, Str "abc ", Plus, NormalLeftParenthesis, NormalToken "def", NormalRightParenthesis, Plus, Str " ghi", PseudoCallRightParenthesis`);
}); // ============================================================

test(async () => {
let s = new $lex.Lex(code`
--
    "abc \
            def"
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", DashFunction, LeftChevron, InlineNormalString, PseudoCallLeftParenthesis, Str "abc         def", PseudoCallRightParenthesis, RightChevron`);
}); // ============================================================

test(async () => {
let s = new $lex.Lex(code`
x: "
        aaa
            bbb
            ccc
    ddd
        eee
"
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "x", Colon, FormattedNormalString, PseudoCallLeftParenthesis, Str "    aaa\n        bbb\n        ccc\nddd\n    eee", PseudoCallRightParenthesis`);
}); // ============================================================

test(async () => {
// Each last line of the first 5 strings should be treated as empty. But the last line of the 6th string should be treated as not empty. These 6 strings only have differences (of the number of spaces) in their last lines.
let s = new $lex.Lex(code`
--
    "
        abc
            def

    "

    "
        abc
            def
 
    "

    "
        abc
            def
    
    "

    "
        abc
            def
     
    "

    "
        abc
            def
        
    "

    "
        abc
            def
            
    "
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", DashFunction, LeftChevron, FormattedNormalString, PseudoCallLeftParenthesis, Str "abc\n    def\n", PseudoCallRightParenthesis, Semicolon, FormattedNormalString, PseudoCallLeftParenthesis, Str "abc\n    def\n", PseudoCallRightParenthesis, Semicolon, FormattedNormalString, PseudoCallLeftParenthesis, Str "abc\n    def\n", PseudoCallRightParenthesis, Semicolon, FormattedNormalString, PseudoCallLeftParenthesis, Str "abc\n    def\n", PseudoCallRightParenthesis, Semicolon, FormattedNormalString, PseudoCallLeftParenthesis, Str "abc\n    def\n", PseudoCallRightParenthesis, Semicolon, FormattedNormalString, PseudoCallLeftParenthesis, Str "abc\n    def\n    ", PseudoCallRightParenthesis, RightChevron`);
}); // ============================================================

test(async () => {
let s = new $lex.Lex(code`
x: v"C:\Windows"
x: v"
    C:\Windows\
    aaa \(bbb)
"
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "x", Colon, InlineVerbatimString, PseudoCallLeftParenthesis, Str "C:\\Windows", PseudoCallRightParenthesis, Semicolon, NormalToken "x", Colon, FormattedVerbatimString, PseudoCallLeftParenthesis, Str "C:\\Windows\\\naaa \\(bbb)", PseudoCallRightParenthesis`);
}); // ============================================================

test(async () => {
let s = new $lex.Lex(code`
x: "
    a\nb
    c
"
x: v"
    a\nb
    c
"
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "x", Colon, FormattedNormalString, PseudoCallLeftParenthesis, Str "a\\nb\nc", PseudoCallRightParenthesis, Semicolon, NormalToken "x", Colon, FormattedVerbatimString, PseudoCallLeftParenthesis, Str "a\\nb\nc", PseudoCallRightParenthesis`);
}); // ============================================================

test(async () => {
let s = new $lex.Lex(code`
x: "aaaaaaa\
bbbbbbb"
x: "
    a
    b\
    c
"
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "x", Colon, InlineNormalString, PseudoCallLeftParenthesis, Str "aaaaaaabbbbbbb", PseudoCallRightParenthesis, Semicolon, NormalToken "x", Colon, FormattedNormalString, PseudoCallLeftParenthesis, Str "a\nbc", PseudoCallRightParenthesis`);
}); // ============================================================

test(async () => {
let s = new $lex.Lex(code`
x: r"hello \(\"world\"\)#(a.b() + c)"
x: r"
    hello \x20
    world #(a) # a
"
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "x", Colon, InlineRegex, PseudoCallLeftParenthesis, Str "hello \\(\\\"world\\\"\\)", Plus, NormalLeftParenthesis, NormalToken "a", Dot, NormalToken "b", CallLeftParenthesis, CallRightParenthesis, Plus, NormalToken "c", NormalRightParenthesis, Plus, Str "", PseudoCallRightParenthesis, Semicolon, NormalToken "x", Colon, FormattedRegex, PseudoCallLeftParenthesis, Str "hello \\x20\nworld ", Plus, NormalLeftParenthesis, NormalToken "a", NormalRightParenthesis, Plus, Str " # a", PseudoCallRightParenthesis`);
}); // ============================================================

test(async () => {
let s = new $lex.Lex(code`
x: js"var a = 'asdf\(asdf)';"
x: js"
    var a = "asdf\(asdf)\
    ggg";
"
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "x", Colon, InlineJs, PseudoCallLeftParenthesis, Str "var a = 'asdf\\(asdf)';", PseudoCallRightParenthesis, Semicolon, NormalToken "x", Colon, FormattedJs, PseudoCallLeftParenthesis, Str "var a = \"asdf\\(asdf)\\\nggg\";", PseudoCallRightParenthesis`);
}); // ============================================================

test(async () => {
let s = new $lex.Lex(code`
x: "\(abc)aaa"
x: "aaa\(abc)"
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "x", Colon, InlineNormalString, PseudoCallLeftParenthesis, Str "", Plus, NormalLeftParenthesis, NormalToken "abc", NormalRightParenthesis, Plus, Str "aaa", PseudoCallRightParenthesis, Semicolon, NormalToken "x", Colon, InlineNormalString, PseudoCallLeftParenthesis, Str "aaa", Plus, NormalLeftParenthesis, NormalToken "abc", NormalRightParenthesis, Plus, Str "", PseudoCallRightParenthesis`);
}); // ============================================================

test(async () => {
let s = new $lex.Lex(code`
x: "aaa \((abc + 1).toString()) bbb"
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "x", Colon, InlineNormalString, PseudoCallLeftParenthesis, Str "aaa ", Plus, NormalLeftParenthesis, NormalLeftParenthesis, NormalToken "abc", Plus, Num "1", NormalRightParenthesis, Dot, NormalToken "toString", CallLeftParenthesis, CallRightParenthesis, NormalRightParenthesis, Plus, Str " bbb", PseudoCallRightParenthesis`);
}); // ============================================================

test(async () => {
let s = new $lex.Lex(code`
x: r"aaa"gim
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "x", Colon, InlineRegex, PseudoCallLeftParenthesis, Str "aaa", Comma, PostQuote "gim", PseudoCallRightParenthesis`);
}); // ============================================================

test(async () => {
let s = new $lex.Lex(code`
x: ""
x: "
    \x20
"
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "x", Colon, InlineNormalString, PseudoCallLeftParenthesis, Str "", PseudoCallRightParenthesis, Semicolon, NormalToken "x", Colon, FormattedNormalString, PseudoCallLeftParenthesis, Str "\\x20", PseudoCallRightParenthesis`);
}); // ============================================================

test(async () => {
assert.throws(() =>
{
let lex = new $lex.Lex(code`
x: "
    abc
x: 1
`);
},
e =>
    e instanceof $lex.PunctuationPairError &&
    e.rawStart[0] === 1 && e.rawStart[1] === 2 &&
    e.rawEnd[0] === 3 && e.rawEnd[1] === 4
);
}); // ============================================================

test(async () => {
let s = new $lex.Lex(code`
x: "\\"
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "x", Colon, InlineNormalString, PseudoCallLeftParenthesis, Str "\\\\", PseudoCallRightParenthesis`);
}); // ============================================================
