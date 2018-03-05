import * as $api from "../test-locked-api.js";
import {test, assert, code} from "./test-base.js";
import * as $lex from "./lex.js";

test(async () => {
let s = new $lex.Lex(code`, node modules
aaa(); bbb()
ccc()
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}, node modules", NormalToken "aaa", CallLeftParenthesis, CallRightParenthesis, Semicolon, NormalToken "bbb", CallLeftParenthesis, CallRightParenthesis, Semicolon, NormalToken "ccc", CallLeftParenthesis, CallRightParenthesis`);
}); // ============================================================

test(async () => {
let s = new $lex.Lex(code`, node modules
;;
;aaa();;; bbb();;
;   ccc(); ;
;
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}, node modules", NormalToken "aaa", CallLeftParenthesis, CallRightParenthesis, Semicolon, NormalToken "bbb", CallLeftParenthesis, CallRightParenthesis, Semicolon, NormalToken "ccc", CallLeftParenthesis, CallRightParenthesis`);
}); // ============================================================

test(async () => {
let s = new $lex.Lex(code`, node modules
<>
    ;
    aaa()
    ;
bbb()
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}, node modules", DiamondFunction, LeftChevron, NormalToken "aaa", CallLeftParenthesis, CallRightParenthesis, RightChevron, Semicolon, NormalToken "bbb", CallLeftParenthesis, CallRightParenthesis`);
}); // ============================================================
