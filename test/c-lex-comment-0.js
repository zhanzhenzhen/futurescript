import {test, assert} from "./c-base-0.js";
import * as $lex from "../lib/c-lex-0.js";

let s = null;

test(() => {
s = new $lex.Lex(`lemo 0.1.0



###
Long comment!
###

# Short comment!
abc() # abc

###
Footer!
###
`).toString();
assert(s === 'VersionDirective "lemo 0.1.0", FormattedComment "\\nLong comment!\\n", Semicolon, NormalToken "abc", CallLeftParenthesis, CallRightParenthesis');
}); // ============================================================

test(() => {
s = new $lex.Lex(`lemo 0.1.0
###
Long comment!
###
`).toString();
assert(s === 'VersionDirective "lemo 0.1.0", FormattedComment "\\nLong comment!\\n"');
}); // ============================================================
