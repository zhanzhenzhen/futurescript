import * as $lex from "../lib/compile-lex-0";
import assert from "assert";

let s = null;

s = new $lex.Lex(`lemo 0.1.0
x: "abc"
x: "
    abc
"
`).toString();
console.log(s === 'NormalToken "x", Colon, InlineNormalString, CallLeftParenthesis, Str "abc", RightParenthesis, Semicolon, NormalToken "x", Colon, FormattedNormalString, CallLeftParenthesis, Str "abc", RightParenthesis');

s = new $lex.Lex(`lemo 0.1.0
x: "abc \\n\\" def"
x: "
    abc \\n\\" def
"
`).toString();
console.log(s === 'NormalToken "x", Colon, InlineNormalString, CallLeftParenthesis, Str "abc \\\\n\\\\\\" def", RightParenthesis, Semicolon, NormalToken "x", Colon, FormattedNormalString, CallLeftParenthesis, Str "abc \\\\n\\\\\\" def", RightParenthesis');

s = new $lex.Lex(`lemo 0.1.0
x: "abc \\(def) ghi"
x: "
    abc \\(def) ghi
"
`).toString();
console.log(s === 'NormalToken "x", Colon, InlineNormalString, CallLeftParenthesis, Str "abc ", Plus, NormalToken "def", Plus, Str " ghi", RightParenthesis, Semicolon, NormalToken "x", Colon, FormattedNormalString, CallLeftParenthesis, Str "abc ", Plus, NormalToken "def", Plus, Str " ghi", RightParenthesis');

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
console.log(s === 'DashFunction, LeftChevron, FormattedNormalString, CallLeftParenthesis, Str "abc\\\\n    def\\\\n", RightParenthesis, Semicolon, FormattedNormalString, CallLeftParenthesis, Str "abc\\\\n    def\\\\n", RightParenthesis, Semicolon, FormattedNormalString, CallLeftParenthesis, Str "abc\\\\n    def\\\\n", RightParenthesis, Semicolon, FormattedNormalString, CallLeftParenthesis, Str "abc\\\\n    def\\\\n", RightParenthesis, Semicolon, FormattedNormalString, CallLeftParenthesis, Str "abc\\\\n    def\\\\n", RightParenthesis, Semicolon, FormattedNormalString, CallLeftParenthesis, Str "abc\\\\n    def\\\\n    ", RightParenthesis, RightChevron');

s = new $lex.Lex(`lemo 0.1.0
x: v"C:\\Windows"
x: v"
    C:\\Windows\\
    aaa \\(bbb)
"
`).toString();
console.log(s === 'NormalToken "x", Colon, InlineVerbatimString, CallLeftParenthesis, Str "C:\\\\Windows", RightParenthesis, Semicolon, NormalToken "x", Colon, FormattedVerbatimString, CallLeftParenthesis, Str "C:\\\\Windows\\\\\\\\naaa \\\\(bbb)", RightParenthesis');

s = new $lex.Lex(`lemo 0.1.0
x: "aaaaaaa\\
bbbbbbb"
x: "
    a
    b\\
    c
"
`).toString();
console.log(s === 'NormalToken "x", Colon, InlineNormalString, CallLeftParenthesis, Str "aaaaaaabbbbbbb", RightParenthesis, Semicolon, NormalToken "x", Colon, FormattedNormalString, CallLeftParenthesis, Str "a\\\\nbc", RightParenthesis');

s = new $lex.Lex(`lemo 0.1.0
x: r"hello \\(\\\"world\\\"\\)#(a.b())"
x: r"
    hello \\x20
    world #(a) # a
"
`).toString();
console.log(s === 'NormalToken "x", Colon, InlineRegex, CallLeftParenthesis, Str "hello \\\\(\\\\\\"world\\\\\\"\\\\)", Plus, NormalToken "a", Dot, NormalToken "b", CallLeftParenthesis, RightParenthesis, Plus, Str "", RightParenthesis, Semicolon, NormalToken "x", Colon, FormattedRegex, CallLeftParenthesis, Str "hello \\\\x20\\\\nworld ", Plus, NormalToken "a", Plus, Str " # a", RightParenthesis');
