import {test, assert, code} from "./test-base.mjs";
import * as $api from "../test-locked-api.mjs";
import * as $libApi from "../locked-api.mjs";

test(async () => {
let r = await $api.runCode(code`
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
let r = await $api.runCode(code`
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
let r = await $api.runCode(code`
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
let r = await $api.runCode(code`
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
let r = await $api.runCode(code`
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
await assert.throws(async () => {
let r = await $api.runCode(code`
throw Error("haha")
`);
},
e => e instanceof Error && e.message === "haha"
);
}); // ============================================================

test(async () => {
await assert.throws(async () => {
let r = await $api.runCode(code`
throw
`);
},
e => e === undefined
);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
try
    a: 1
catch
    throw
export: a
`);
assert(r === 1);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
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

// This test ensures that a "catch variable" is different from a JS "catch variable".
// Ours is treated as a function variable that is declared at the top of the function.
// So ours is not a `catch`-scope variable. This behavior looks bad, but it gives
// better consistency, for it sustains the behavior that every variable inside a function,
// if not inside an inner function, is accessible throughout the whole function scope.
// It has drawbacks, but the drawbacks are the same as that of a "normal variable".
test(async () => {
let r = await $api.runCode(code`
err1: null
err2: null
try
    a()
catch ex
    err1: ex
    try
        a()
    catch ex
        err2: ex
    r: [ex = err1, ex = err2]
export: r
`);
assert(r[0] === false && r[1] === true);
}); // ============================================================
