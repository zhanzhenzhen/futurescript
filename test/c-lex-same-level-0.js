import {test, assert} from "./c-base-0.js";
import * as $lex from "../lib/c-lex-0.js";

let s = null;

test(() => {
s = new $lex.Lex(`lemo 0.1.0, node module
aaa(); bbb()
ccc()
`).toString();
assert(s === 'VersionDirective "lemo 0.1.0, node module", NormalToken "aaa", CallLeftParenthesis, CallRightParenthesis, Semicolon, NormalToken "bbb", CallLeftParenthesis, CallRightParenthesis, Semicolon, NormalToken "ccc", CallLeftParenthesis, CallRightParenthesis');
}); // ============================================================

test(() => {
s = new $lex.Lex(`lemo 0.1.0, node module
;;
;aaa();;; bbb();;
;   ccc(); ;
;
`).toString();
assert(s === 'VersionDirective "lemo 0.1.0, node module", NormalToken "aaa", CallLeftParenthesis, CallRightParenthesis, Semicolon, NormalToken "bbb", CallLeftParenthesis, CallRightParenthesis, Semicolon, NormalToken "ccc", CallLeftParenthesis, CallRightParenthesis');
}); // ============================================================

test(() => {
s = new $lex.Lex(`lemo 0.1.0, node module
<>
    ;
    aaa()
    ;
bbb()
`).toString();
assert(s === 'VersionDirective "lemo 0.1.0, node module", DiamondFunction, LeftChevron, NormalToken "aaa", CallLeftParenthesis, CallRightParenthesis, RightChevron, Semicolon, NormalToken "bbb", CallLeftParenthesis, CallRightParenthesis');
}); // ============================================================
