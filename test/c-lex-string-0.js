import {test, assert} from "./c-base-0.js";
import * as $lex from "../lib/c-lex-0.js";

let s = null;
let lex = null;

test(() => {
s = new $lex.Lex(`fus 0.1.0
x: "abc"
x: "
    abc
"
`).toString();
assert(s === 'VersionDirective "fus 0.1.0", NormalToken "x", Colon, InlineNormalString, PseudoCallLeftParenthesis, Str "abc", PseudoCallRightParenthesis, Semicolon, NormalToken "x", Colon, FormattedNormalString, PseudoCallLeftParenthesis, Str "abc", PseudoCallRightParenthesis');
}); // ============================================================

test(() => {
s = new $lex.Lex(`fus 0.1.0
x: "abc \\n\\" def"
x: "
    abc \\n\\" def
"
`).toString();
assert(s === 'VersionDirective "fus 0.1.0", NormalToken "x", Colon, InlineNormalString, PseudoCallLeftParenthesis, Str "abc \\\\n\\\\\\" def", PseudoCallRightParenthesis, Semicolon, NormalToken "x", Colon, FormattedNormalString, PseudoCallLeftParenthesis, Str "abc \\\\n\\\\\\" def", PseudoCallRightParenthesis');
}); // ============================================================

test(() => {
s = new $lex.Lex(`fus 0.1.0
x: "abc \\(def) ghi"
x: "
    abc \\(def) ghi
"
`).toString();
assert(s === 'VersionDirective "fus 0.1.0", NormalToken "x", Colon, InlineNormalString, PseudoCallLeftParenthesis, Str "abc ", Plus, NormalLeftParenthesis, NormalToken "def", NormalRightParenthesis, Plus, Str " ghi", PseudoCallRightParenthesis, Semicolon, NormalToken "x", Colon, FormattedNormalString, PseudoCallLeftParenthesis, Str "abc ", Plus, NormalLeftParenthesis, NormalToken "def", NormalRightParenthesis, Plus, Str " ghi", PseudoCallRightParenthesis');
}); // ============================================================

test(() => {
s = new $lex.Lex(`fus 0.1.0
--
    "abc \\
            def"
`).toString();
assert(s === 'VersionDirective "fus 0.1.0", DashFunction, LeftChevron, InlineNormalString, PseudoCallLeftParenthesis, Str "abc         def", PseudoCallRightParenthesis, RightChevron');
}); // ============================================================

test(() => {
s = new $lex.Lex(`fus 0.1.0
x: "
        aaa
            bbb
            ccc
    ddd
        eee
"
`).toString();
assert(s === 'VersionDirective "fus 0.1.0", NormalToken "x", Colon, FormattedNormalString, PseudoCallLeftParenthesis, Str "    aaa\\\\n        bbb\\\\n        ccc\\\\nddd\\\\n    eee", PseudoCallRightParenthesis');
}); // ============================================================

test(() => {
// Each last line of the first 5 strings should be treated as empty. But the last line of the 6th string should be treated as not empty. These 6 strings only have differences (of the number of spaces) in their last lines.
s = new $lex.Lex(`fus 0.1.0
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
assert(s === 'VersionDirective "fus 0.1.0", DashFunction, LeftChevron, FormattedNormalString, PseudoCallLeftParenthesis, Str "abc\\\\n    def\\\\n", PseudoCallRightParenthesis, Semicolon, FormattedNormalString, PseudoCallLeftParenthesis, Str "abc\\\\n    def\\\\n", PseudoCallRightParenthesis, Semicolon, FormattedNormalString, PseudoCallLeftParenthesis, Str "abc\\\\n    def\\\\n", PseudoCallRightParenthesis, Semicolon, FormattedNormalString, PseudoCallLeftParenthesis, Str "abc\\\\n    def\\\\n", PseudoCallRightParenthesis, Semicolon, FormattedNormalString, PseudoCallLeftParenthesis, Str "abc\\\\n    def\\\\n", PseudoCallRightParenthesis, Semicolon, FormattedNormalString, PseudoCallLeftParenthesis, Str "abc\\\\n    def\\\\n    ", PseudoCallRightParenthesis, RightChevron');
}); // ============================================================

test(() => {
s = new $lex.Lex(`fus 0.1.0
x: v"C:\\Windows"
x: v"
    C:\\Windows\\
    aaa \\(bbb)
"
`).toString();
assert(s === 'VersionDirective "fus 0.1.0", NormalToken "x", Colon, InlineVerbatimString, PseudoCallLeftParenthesis, Str "C:\\\\Windows", PseudoCallRightParenthesis, Semicolon, NormalToken "x", Colon, FormattedVerbatimString, PseudoCallLeftParenthesis, Str "C:\\\\Windows\\\\\\\\naaa \\\\(bbb)", PseudoCallRightParenthesis');
}); // ============================================================

test(() => {
s = new $lex.Lex(`fus 0.1.0
x: "aaaaaaa\\
bbbbbbb"
x: "
    a
    b\\
    c
"
`).toString();
assert(s === 'VersionDirective "fus 0.1.0", NormalToken "x", Colon, InlineNormalString, PseudoCallLeftParenthesis, Str "aaaaaaabbbbbbb", PseudoCallRightParenthesis, Semicolon, NormalToken "x", Colon, FormattedNormalString, PseudoCallLeftParenthesis, Str "a\\\\nbc", PseudoCallRightParenthesis');
}); // ============================================================

test(() => {
s = new $lex.Lex(`fus 0.1.0
x: r"hello \\(\\\"world\\\"\\)#(a.b() + c)"
x: r"
    hello \\x20
    world #(a) # a
"
`).toString();
assert(s === 'VersionDirective "fus 0.1.0", NormalToken "x", Colon, InlineRegex, PseudoCallLeftParenthesis, Str "hello \\\\(\\\\\\"world\\\\\\"\\\\)", Plus, NormalLeftParenthesis, NormalToken "a", Dot, NormalToken "b", CallLeftParenthesis, CallRightParenthesis, Plus, NormalToken "c", NormalRightParenthesis, Plus, Str "", PseudoCallRightParenthesis, Semicolon, NormalToken "x", Colon, FormattedRegex, PseudoCallLeftParenthesis, Str "hello \\\\x20\\\\nworld ", Plus, NormalLeftParenthesis, NormalToken "a", NormalRightParenthesis, Plus, Str " # a", PseudoCallRightParenthesis');
}); // ============================================================

test(() => {
s = new $lex.Lex(`fus 0.1.0
x: js"var a = 'asdf\\(asdf)';"
x: js"
    var a = "asdf\\(asdf)\\
    ggg";
"
`).toString();
assert(s === 'VersionDirective "fus 0.1.0", NormalToken "x", Colon, InlineJs, PseudoCallLeftParenthesis, Str "var a = \'asdf\\\\(asdf)\';", PseudoCallRightParenthesis, Semicolon, NormalToken "x", Colon, FormattedJs, PseudoCallLeftParenthesis, Str "var a = \\"asdf\\\\(asdf)\\\\\\\\nggg\\";", PseudoCallRightParenthesis');
}); // ============================================================

test(() => {
s = new $lex.Lex(`fus 0.1.0
x: "\\(abc)aaa"
x: "aaa\\(abc)"
`).toString();
assert(s === 'VersionDirective "fus 0.1.0", NormalToken "x", Colon, InlineNormalString, PseudoCallLeftParenthesis, Str "", Plus, NormalLeftParenthesis, NormalToken "abc", NormalRightParenthesis, Plus, Str "aaa", PseudoCallRightParenthesis, Semicolon, NormalToken "x", Colon, InlineNormalString, PseudoCallLeftParenthesis, Str "aaa", Plus, NormalLeftParenthesis, NormalToken "abc", NormalRightParenthesis, Plus, Str "", PseudoCallRightParenthesis');
}); // ============================================================

test(() => {
s = new $lex.Lex(`fus 0.1.0
x: "aaa \\((abc + 1).toString()) bbb"
`).toString();
assert(s === 'VersionDirective "fus 0.1.0", NormalToken "x", Colon, InlineNormalString, PseudoCallLeftParenthesis, Str "aaa ", Plus, NormalLeftParenthesis, NormalLeftParenthesis, NormalToken "abc", Plus, Num "1", NormalRightParenthesis, Dot, NormalToken "toString", CallLeftParenthesis, CallRightParenthesis, NormalRightParenthesis, Plus, Str " bbb", PseudoCallRightParenthesis');
}); // ============================================================

test(() => {
s = new $lex.Lex(`fus 0.1.0
x: r"aaa"gim
`).toString();
assert(s === 'VersionDirective "fus 0.1.0", NormalToken "x", Colon, InlineRegex, PseudoCallLeftParenthesis, Str "aaa", Comma, PostQuote "gim", PseudoCallRightParenthesis');
}); // ============================================================

test(() => {
s = new $lex.Lex(`fus 0.1.0
x: ""
x: "
    \\x20
"
`).toString();
assert(s === 'VersionDirective "fus 0.1.0", NormalToken "x", Colon, InlineNormalString, PseudoCallLeftParenthesis, Str "", PseudoCallRightParenthesis, Semicolon, NormalToken "x", Colon, FormattedNormalString, PseudoCallLeftParenthesis, Str "\\\\x20", PseudoCallRightParenthesis');
}); // ============================================================

test(() => {
assert.throws(() =>
{
lex = new $lex.Lex(`fus 0.1.0
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
