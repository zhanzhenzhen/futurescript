/*
To ensure that an expression will be evaluated only once. For example:

a().b ifvoid: 1

can't be compiled to:

if (a().b === undefined) {
    a().b = 1;
}

because `a()` is run twice.
*/

import {test, assert, code} from "./test-base.js";
import * as $api from "../test-locked-api.js";
import * as $libApi from "../locked-api.js";

let r;

test(() => {
r = $api.runCode(code`
i: 0
f: <>
    i: i + 1
    {}
f().a ifvoid: 10
export: i
`);
assert(r === 1);
}); // ============================================================

test(() => {
r = $api.runCode(code`
i: 0
f: <>
    i: i + 1
    {a: 10}
f().a: self + 1
export: i
`);
assert(r === 1);
}); // ============================================================

test(() => {
r = $api.runCode(code`
i: 0
f: <>
    i: i + 1
    {a: {b: 10}}
t: f().a'ok.b
export: i
`);
assert(r === 1);
}); // ============================================================
