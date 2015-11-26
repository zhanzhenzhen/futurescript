import * as $lex from "../lib/c-lex-0.js";
import assert from "assert";

let s = null;

s = new $lex.Lex(`lemo 0.1.0, node module
aaa(); bbb()
ccc()
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0, node module", NormalToken "aaa", CallLeftParenthesis, CallRightParenthesis, Semicolon, NormalToken "bbb", CallLeftParenthesis, CallRightParenthesis, Semicolon, NormalToken "ccc", CallLeftParenthesis, CallRightParenthesis');

s = new $lex.Lex(`lemo 0.1.0, node module
;;
;aaa();;; bbb();;
;   ccc(); ;
;
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0, node module", NormalToken "aaa", CallLeftParenthesis, CallRightParenthesis, Semicolon, NormalToken "bbb", CallLeftParenthesis, CallRightParenthesis, Semicolon, NormalToken "ccc", CallLeftParenthesis, CallRightParenthesis');

s = new $lex.Lex(`lemo 0.1.0, node module
<>
    ;
    aaa()
    ;
bbb()
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0, node module", DiamondFunction, LeftChevron, NormalToken "aaa", CallLeftParenthesis, CallRightParenthesis, RightChevron, Semicolon, NormalToken "bbb", CallLeftParenthesis, CallRightParenthesis');
