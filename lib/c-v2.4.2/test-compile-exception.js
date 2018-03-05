import {test, assert, code} from "./test-base.js";
import * as $api from "../test-locked-api.js";
import * as $libApi from "../locked-api.js";

test(async () => {
let r = $api.runCode(code`
a:
    try
        abc()
        true
    catch
        false
export: a
`);
assert(r === false);
}); // ============================================================

test(async () => {
let r = $api.runCode(code`
a:
    try
        true
    catch b
        false
    finally
        null
export: a
`);
assert(r === true);
}); // ============================================================

test(async () => {
let r = $api.runCode(code`
a:
    try
        true
    catch
        false
export: a
`);
assert(r === true);
}); // ============================================================

test(async () => {
let r = $api.runCode(code`
a: 1
try
    try
        abc()
    finally
        a: a + 3
catch
    a: a * 3
export: a
`);
assert(r === 4);
}); // ============================================================

test(async () => {
let r = $api.runCode(code`
a: []
try
    try
        abc()
    catch
        a.push 1
        throw
    finally
        a.push 2
catch
    a.push 3
export: a
`);
assert(r[0] === 1 && r[1] === 2 && r[2] === 3);
}); // ============================================================

test(async () => {
assert.throws(() => {
let r = $api.runCode(code`
throw Error("haha")
`);
},
e => e instanceof Error && e.message === "haha"
);
}); // ============================================================

test(async () => {
assert.throws(() => {
let r = $api.runCode(code`
throw
`);
},
e => e === undefined
);
}); // ============================================================

test(async () => {
let r = $api.runCode(code`
try
    a: 1
catch
    throw
export: a
`);
assert(r === 1);
}); // ============================================================

test(async () => {
let r = $api.runCode(code`
a:
    try
        try
            throw 1
        catch
            throw
    catch ex
        ex + 2
export: a
`);
assert(r === 3);
}); // ============================================================
