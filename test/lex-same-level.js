import * as $lex from "../lib/compile-lex-0";
import assert from "assert";

let s = null;

s = new $lex.Lex(`lemo 0.1.0, node module
aaa(); bbb()
ccc()
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0, node module", NormalToken "aaa", CallLeftParenthesis, RightParenthesis, Semicolon, NormalToken "bbb", CallLeftParenthesis, RightParenthesis, Semicolon, NormalToken "ccc", CallLeftParenthesis, RightParenthesis');

s = new $lex.Lex(`lemo 0.1.0, node module
;;
;aaa();;; bbb();;
;   ccc(); ;
;
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0, node module", NormalToken "aaa", CallLeftParenthesis, RightParenthesis, Semicolon, NormalToken "bbb", CallLeftParenthesis, RightParenthesis, Semicolon, NormalToken "ccc", CallLeftParenthesis, RightParenthesis');

s = new $lex.Lex(`lemo 0.1.0, node module
<>
    ;
    aaa()
    ;
bbb()
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0, node module", DiamondFunction, LeftChevron, NormalToken "aaa", CallLeftParenthesis, RightParenthesis, RightChevron, Semicolon, NormalToken "bbb", CallLeftParenthesis, RightParenthesis');
