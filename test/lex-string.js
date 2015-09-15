import * as $lex from "../lib/compile-lex-0";
import assert from "assert";

let s = null;

s = new $lex.Lex(`lemo 0.1.0
x: "abc"
x: "
    abc
"
`).toString()
console.log(s === 'NormalToken "x", Colon, InlineNormalString, CallLeftParenthesis, Str "abc", RightParenthesis, Semicolon, NormalToken "x", Colon, FormattedNormalString, CallLeftParenthesis, Str "abc", RightParenthesis');

s = new $lex.Lex(`lemo 0.1.0
--
    "
        abc
            def

    "
`).toString()
console.log(s === 'DashFunction, LeftChevron, FormattedNormalString, CallLeftParenthesis, Str "abc\\\\n    def\\\\n", RightParenthesis, RightChevron');
