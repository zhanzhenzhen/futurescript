import {test, assert, code} from "./test-base.js";
import * as $api from "../test-locked-api.js";
import * as $libApi from "../locked-api.js";

test(async () => {
let r = $api.runCode(code`
a: 0
b: <>
    a: 1
c: 5 ifnull b()
export: a
`);
assert(r === 0);
}); // ============================================================

test(async () => {
let r = $api.runCode(code`
a: 0
b: <>
    a: 1
c: 5 ifvoid b()
export: a
`);
assert(r === 0);
}); // ============================================================

test(async () => {
let r = $api.runCode(code`
a: 0
b: 2
c: 1
d: <>
    a: 1
    3
c: b < c < d()
export: a
`);
assert(r === 0);
}); // ============================================================
