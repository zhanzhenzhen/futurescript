import * as $api from "../test-locked-api.mjs";
import {test, assert, code} from "./test-base.mjs";
import * as $lex from "./lex.mjs";

test(() => {
let s = new $lex.Lex(code`, node modules
aaa(); bbb()
ccc()
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}, node modules", NormalToken "aaa", CallLeftParenthesis, CallRightParenthesis, Semicolon, NormalToken "bbb", CallLeftParenthesis, CallRightParenthesis, Semicolon, NormalToken "ccc", CallLeftParenthesis, CallRightParenthesis`);
}); // ============================================================

test(() => {
let s = new $lex.Lex(code`, node modules
;;
;aaa();;; bbb();;
;   ccc(); ;
;
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}, node modules", NormalToken "aaa", CallLeftParenthesis, CallRightParenthesis, Semicolon, NormalToken "bbb", CallLeftParenthesis, CallRightParenthesis, Semicolon, NormalToken "ccc", CallLeftParenthesis, CallRightParenthesis`);
}); // ============================================================

test(() => {
let s = new $lex.Lex(code`, node modules
<>
    ;
    aaa()
    ;
bbb()
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}, node modules", DiamondFunction, LeftChevron, NormalToken "aaa", CallLeftParenthesis, CallRightParenthesis, RightChevron, Semicolon, NormalToken "bbb", CallLeftParenthesis, CallRightParenthesis`);
}); // ============================================================
