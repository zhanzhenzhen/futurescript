import * as $lex from "../lib/c-lex-0.js";
import assert from "assert";

let s = null;

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
console.log(s === 'VersionDirective "lemo 0.1.0", FormattedComment "\\nLong comment!\\n", Semicolon, NormalToken "abc", CallLeftParenthesis, CallRightParenthesis');

s = new $lex.Lex(`lemo 0.1.0
###
Long comment!
###
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", FormattedComment "\\nLong comment!\\n"');
