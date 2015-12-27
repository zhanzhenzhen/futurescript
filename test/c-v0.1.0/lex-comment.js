import {test, assert} from "../c-v0.1.0/base.js";
import * as $lex from "../../lib/c-v0.1.0/lex.js";

let s = null;

test(() => {
s = new $lex.Lex(`fus 0.1.0



###
Long comment!
###

# Short comment!
abc() # abc

###
Footer!
###
`).toString();
assert(s === 'VersionDirective "fus 0.1.0", FormattedComment "\\nLong comment!\\n", Semicolon, NormalToken "abc", CallLeftParenthesis, CallRightParenthesis');
}); // ============================================================

test(() => {
s = new $lex.Lex(`fus 0.1.0
###
Long comment!
###
`).toString();
assert(s === 'VersionDirective "fus 0.1.0", FormattedComment "\\nLong comment!\\n"');
}); // ============================================================
