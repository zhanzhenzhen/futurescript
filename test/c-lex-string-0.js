import * as $lex from "../lib/c-lex-0.js";
import assert from "assert";

let s = null;

s = new $lex.Lex(`lemo 0.1.0
x: "abc"
x: "
    abc
"
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", NormalToken "x", Colon, InlineNormalString, PseudoCallLeftParenthesis, Str "abc", PseudoCallRightParenthesis, Semicolon, NormalToken "x", Colon, FormattedNormalString, PseudoCallLeftParenthesis, Str "abc", PseudoCallRightParenthesis');

s = new $lex.Lex(`lemo 0.1.0
x: "abc \\n\\" def"
x: "
    abc \\n\\" def
"
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", NormalToken "x", Colon, InlineNormalString, PseudoCallLeftParenthesis, Str "abc \\\\n\\\\\\" def", PseudoCallRightParenthesis, Semicolon, NormalToken "x", Colon, FormattedNormalString, PseudoCallLeftParenthesis, Str "abc \\\\n\\\\\\" def", PseudoCallRightParenthesis');

s = new $lex.Lex(`lemo 0.1.0
x: "abc \\(def) ghi"
x: "
    abc \\(def) ghi
"
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", NormalToken "x", Colon, InlineNormalString, PseudoCallLeftParenthesis, Str "abc ", Plus, NormalLeftParenthesis, NormalToken "def", NormalRightParenthesis, Plus, Str " ghi", PseudoCallRightParenthesis, Semicolon, NormalToken "x", Colon, FormattedNormalString, PseudoCallLeftParenthesis, Str "abc ", Plus, NormalLeftParenthesis, NormalToken "def", NormalRightParenthesis, Plus, Str " ghi", PseudoCallRightParenthesis');

s = new $lex.Lex(`lemo 0.1.0
--
    "abc \\
            def"
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", DashFunction, LeftChevron, InlineNormalString, PseudoCallLeftParenthesis, Str "abc         def", PseudoCallRightParenthesis, RightChevron');

s = new $lex.Lex(`lemo 0.1.0
x: "
        aaa
            bbb
            ccc
    ddd
        eee
"
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", NormalToken "x", Colon, FormattedNormalString, PseudoCallLeftParenthesis, Str "    aaa\\\\n        bbb\\\\n        ccc\\\\nddd\\\\n    eee", PseudoCallRightParenthesis');

// Each last line of the first 5 strings should be treated as empty. But the last line of the 6th string should be treated as not empty. These 6 strings only have differences (of the number of spaces) in their last lines.
s = new $lex.Lex(`lemo 0.1.0
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
console.log(s === 'VersionDirective "lemo 0.1.0", DashFunction, LeftChevron, FormattedNormalString, PseudoCallLeftParenthesis, Str "abc\\\\n    def\\\\n", PseudoCallRightParenthesis, Semicolon, FormattedNormalString, PseudoCallLeftParenthesis, Str "abc\\\\n    def\\\\n", PseudoCallRightParenthesis, Semicolon, FormattedNormalString, PseudoCallLeftParenthesis, Str "abc\\\\n    def\\\\n", PseudoCallRightParenthesis, Semicolon, FormattedNormalString, PseudoCallLeftParenthesis, Str "abc\\\\n    def\\\\n", PseudoCallRightParenthesis, Semicolon, FormattedNormalString, PseudoCallLeftParenthesis, Str "abc\\\\n    def\\\\n", PseudoCallRightParenthesis, Semicolon, FormattedNormalString, PseudoCallLeftParenthesis, Str "abc\\\\n    def\\\\n    ", PseudoCallRightParenthesis, RightChevron');

s = new $lex.Lex(`lemo 0.1.0
x: v"C:\\Windows"
x: v"
    C:\\Windows\\
    aaa \\(bbb)
"
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", NormalToken "x", Colon, InlineVerbatimString, PseudoCallLeftParenthesis, Str "C:\\\\Windows", PseudoCallRightParenthesis, Semicolon, NormalToken "x", Colon, FormattedVerbatimString, PseudoCallLeftParenthesis, Str "C:\\\\Windows\\\\\\\\naaa \\\\(bbb)", PseudoCallRightParenthesis');

s = new $lex.Lex(`lemo 0.1.0
x: "aaaaaaa\\
bbbbbbb"
x: "
    a
    b\\
    c
"
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", NormalToken "x", Colon, InlineNormalString, PseudoCallLeftParenthesis, Str "aaaaaaabbbbbbb", PseudoCallRightParenthesis, Semicolon, NormalToken "x", Colon, FormattedNormalString, PseudoCallLeftParenthesis, Str "a\\\\nbc", PseudoCallRightParenthesis');

s = new $lex.Lex(`lemo 0.1.0
x: r"hello \\(\\\"world\\\"\\)#(a.b() + c)"
x: r"
    hello \\x20
    world #(a) # a
"
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", NormalToken "x", Colon, InlineRegex, PseudoCallLeftParenthesis, Str "hello \\\\(\\\\\\"world\\\\\\"\\\\)", Plus, NormalLeftParenthesis, NormalToken "a", Dot, NormalToken "b", CallLeftParenthesis, CallRightParenthesis, Plus, NormalToken "c", NormalRightParenthesis, Plus, Str "", PseudoCallRightParenthesis, Semicolon, NormalToken "x", Colon, FormattedRegex, PseudoCallLeftParenthesis, Str "hello \\\\x20\\\\nworld ", Plus, NormalLeftParenthesis, NormalToken "a", NormalRightParenthesis, Plus, Str " # a", PseudoCallRightParenthesis');

s = new $lex.Lex(`lemo 0.1.0
x: js"var a = 'asdf\\(asdf)';"
x: js"
    var a = "asdf\\(asdf)\\
    ggg";
"
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", NormalToken "x", Colon, InlineJs, PseudoCallLeftParenthesis, Str "var a = \'asdf\\\\(asdf)\';", PseudoCallRightParenthesis, Semicolon, NormalToken "x", Colon, FormattedJs, PseudoCallLeftParenthesis, Str "var a = \\"asdf\\\\(asdf)\\\\\\\\nggg\\";", PseudoCallRightParenthesis');

s = new $lex.Lex(`lemo 0.1.0
x: "\\(abc)aaa"
x: "aaa\\(abc)"
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", NormalToken "x", Colon, InlineNormalString, PseudoCallLeftParenthesis, Str "", Plus, NormalLeftParenthesis, NormalToken "abc", NormalRightParenthesis, Plus, Str "aaa", PseudoCallRightParenthesis, Semicolon, NormalToken "x", Colon, InlineNormalString, PseudoCallLeftParenthesis, Str "aaa", Plus, NormalLeftParenthesis, NormalToken "abc", NormalRightParenthesis, Plus, Str "", PseudoCallRightParenthesis');

s = new $lex.Lex(`lemo 0.1.0
x: "aaa \\((abc + 1).toString()) bbb"
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", NormalToken "x", Colon, InlineNormalString, PseudoCallLeftParenthesis, Str "aaa ", Plus, NormalLeftParenthesis, NormalLeftParenthesis, NormalToken "abc", Plus, Num "1", NormalRightParenthesis, Dot, NormalToken "toString", CallLeftParenthesis, CallRightParenthesis, NormalRightParenthesis, Plus, Str " bbb", PseudoCallRightParenthesis');

s = new $lex.Lex(`lemo 0.1.0
x: r"aaa"gim
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", NormalToken "x", Colon, InlineRegex, PseudoCallLeftParenthesis, Str "aaa", Comma, PostQuote "gim", PseudoCallRightParenthesis');
