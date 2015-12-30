import {test, assert} from "../c-v0.1.0/base.js";
import * as $lex from "../../lib/c-v0.1.0/lex.js";

let s = null;

test(() => {
s = new $lex.Lex(`fus 0.1.0, node modules
aaa(); bbb()
ccc()
`).toString();
assert(s === 'VersionDirective "fus 0.1.0, node modules", NormalToken "aaa", CallLeftParenthesis, CallRightParenthesis, Semicolon, NormalToken "bbb", CallLeftParenthesis, CallRightParenthesis, Semicolon, NormalToken "ccc", CallLeftParenthesis, CallRightParenthesis');
}); // ============================================================

test(() => {
s = new $lex.Lex(`fus 0.1.0, node modules
;;
;aaa();;; bbb();;
;   ccc(); ;
;
`).toString();
assert(s === 'VersionDirective "fus 0.1.0, node modules", NormalToken "aaa", CallLeftParenthesis, CallRightParenthesis, Semicolon, NormalToken "bbb", CallLeftParenthesis, CallRightParenthesis, Semicolon, NormalToken "ccc", CallLeftParenthesis, CallRightParenthesis');
}); // ============================================================

test(() => {
s = new $lex.Lex(`fus 0.1.0, node modules
<>
    ;
    aaa()
    ;
bbb()
`).toString();
assert(s === 'VersionDirective "fus 0.1.0, node modules", DiamondFunction, LeftChevron, NormalToken "aaa", CallLeftParenthesis, CallRightParenthesis, RightChevron, Semicolon, NormalToken "bbb", CallLeftParenthesis, CallRightParenthesis');
}); // ============================================================
