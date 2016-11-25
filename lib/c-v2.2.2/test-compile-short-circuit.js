import {test, assert, code} from "./test-base.js";
import * as $api from "../test-locked-api.js";
import * as $libApi from "../locked-api.js";

let r;

test(() => {
r = $api.runCode(code`
a: 0
b: <>
    a: 1
c: 5 ifnull b()
export: a
`);
assert(r === 0);
}); // ============================================================
