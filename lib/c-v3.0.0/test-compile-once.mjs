/*
To ensure that an expression will be evaluated only once. For example:

a().b ifvoid: 1

can't be compiled to:

if (a().b === undefined) {
    a().b = 1;
}

because `a()` is run twice.
*/

import {test, assert, code} from "./test-base.mjs";
import * as $api from "../test-locked-api.mjs";
import * as $libApi from "../locked-api.mjs";

test(async () => {
let r = await $api.runCode(code`
i: 0
f: <>
    i: i + 1
    {}
f().a ifvoid: 10
export: i
`);
assert(r === 1);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
i: 0
f: <>
    i: i + 1
    {a: 10}
f().a: self + 1
export: i
`);
assert(r === 1);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
A: class
    new: <>
        me._k: 0
    k'get: <>
        me._k: me._k + 1
        me._k
a: A()
arr: [100, 200, 300]
arr.(a.k): self + 1
export: arr
`);
assert(
    r[0] === 100 &&
    r[1] === 201 &&
    r[2] === 300
);
}); // ============================================================
