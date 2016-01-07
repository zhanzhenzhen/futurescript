import {test, assert, code} from "./test-base.js";
import * as $lex from "./lex.js";

let s = null;

test(() => {
s = new $lex.Lex(code`



###
Long comment!
###

# Short comment!
abc() # abc

###
Footer!
###
`).toString();
assert(s === String.raw`VersionDirective "fus 0.1.0", FormattedComment "\nLong comment!\n", Semicolon, NormalToken "abc", CallLeftParenthesis, CallRightParenthesis`);
}); // ============================================================

test(() => {
s = new $lex.Lex(code`
###
Long comment!
###
`).toString();
assert(s === String.raw`VersionDirective "fus 0.1.0", FormattedComment "\nLong comment!\n"`);
}); // ============================================================
