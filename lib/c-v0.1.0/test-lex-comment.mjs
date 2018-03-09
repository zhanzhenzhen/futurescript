import * as $api from "../test-locked-api.js";
import {test, assert, code} from "./test-base.js";
import * as $lex from "./lex.js";

test(() => {
let s = new $lex.Lex(code`



###
Long comment!
###

# Short comment!
abc() # abc

###
Footer!
###
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", FormattedComment "\nLong comment!\n", Semicolon, NormalToken "abc", CallLeftParenthesis, CallRightParenthesis`);
}); // ============================================================

test(() => {
let s = new $lex.Lex(code`
###
Long comment!
###
`).toString();
assert(s === String.raw`VersionDirective "fus ${$api.currentVersion}", FormattedComment "\nLong comment!\n"`);
}); // ============================================================
