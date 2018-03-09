import {test, assert, code} from "./test-base.mjs";
import * as $api from "../test-locked-api.mjs";
import * as $libApi from "../locked-api.mjs";

test(async () => {
let r = await $api.runCode(code`
a: 0
b: <>
    a: 1
c: 5 ifnull b()
export: a
`);
assert(r === 0);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: 0
b: <>
    a: 1
c: 5 ifvoid b()
export: a
`);
assert(r === 0);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
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
