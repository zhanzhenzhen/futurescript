import * as $api from "../test-locked-api.js";
import {test, assert, code} from "./test-base.js";
import * as $lex from "./lex.js";

let s = null;
let lex = null;

test(() => {
s = new $lex.Lex(code`
a: {aaa, bbb, ccc}
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "a", Colon, NormalLeftBrace, NormalToken "aaa", Colon, True, Comma, NormalToken "bbb", Colon, True, Comma, NormalToken "ccc", Colon, True, NormalRightBrace`);
}); // ============================================================

test(() => {
s = new $lex.Lex(code`
a: {aaa bbb ccc}
`).toString();
console.log(s);
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", NormalToken "a", Colon, NormalLeftBrace, InlineNormalString, PseudoCallLeftParenthesis, Str "", PseudoCallRightParenthesis, Colon, NormalToken "aaa", Comma, NormalToken "bbb", Colon, NormalToken "ccc", NormalRightBrace`);
}); // ============================================================
