import {test, testEndless, assert, code} from "./test-base.mjs";
import * as $api from "../test-locked-api.mjs";
import * as $libApi from "../locked-api.mjs";

test(async () => {
let r = await $api.runCode(code`
promise: Promise((resolve, reject) ->
    setTimeout(-- resolve("successful!"), 0)
)
a: --
    promise'wait
    void
export: a() is Promise
`);
assert(r === true);
}); // ============================================================

testEndless(async () => {
let r = await $api.runCodeEndless(code`
promise: Promise((resolve, reject) ->
    setTimeout(-- resolve("successful!"), 0)
)
result'export: null
ended'export: false
do --
    result: promise'wait
    ended: true
`);
assert(r === "successful!");
}); // ============================================================

testEndless(async () => {
let r = await $api.runCodeEndless(code`
promise: Promise((resolve, reject) ->
    setTimeout(-- resolve("successful!"), 0)
)
result'export: null
ended'export: false
a: {}
a.b: --
    promise'wait
    result: me = a
    ended: true
a.b()
`);
assert(r === true);
}); // ============================================================

testEndless(async () => {
let r = await $api.runCodeEndless(code`
promise: Promise((resolve, reject) ->
    setTimeout(-- resolve("successful!"), 0)
)
result'export: []
ended'export: false
do --
    task: --
        result.push "stage 1"
        promise'wait
        result.push "stage 3"
        ended: true
    task()
    result.push "stage 2"
`);
assert(r[0] === "stage 1" && r[1] === "stage 2" && r[2] === "stage 3");
}); // ============================================================

testEndless(async () => {
let r = await $api.runCodeEndless(code`
promise: Promise((resolve, reject) ->
    setTimeout(-- resolve("successful!"), 0)
)
result'export: null
ended'export: false
a: --
    promise'wait
b: --
    result: a()'wait
    ended: true
b()
`);
assert(r === "successful!");
}); // ============================================================

testEndless(async () => {
let r = await $api.runCodeEndless(code`
task: <>
    Promise((resolve, reject) ->
        setTimeout(-- resolve("successful!"), 0)
    )
result'export: []
ended'export: false
do --
    (do --
        result.push "stage 1"
        task()'wait
        result.push "stage 3"
        task()'wait
        result.push "stage 4"
    )'wait
    result.push "stage 5"
    ended: true
result.push "stage 2"
`);
assert(
    r[0] === "stage 1" &&
    r[1] === "stage 2" &&
    r[2] === "stage 3" &&
    r[3] === "stage 4" &&
    r[4] === "stage 5"
);
}); // ============================================================

// This is to test async function in nested function structure.
// We use the try-catch expression, which can't be optimized to be functionless,
// to make sure there will be a nested function in generated JS.
testEndless(async () => {
let r = await $api.runCodeEndless(code`
promise: Promise((resolve, reject) ->
    setTimeout(-- resolve("successful!"), 0)
)
result'export: null
ended'export: false
do --
    a:
        try
            result: promise'wait
            ended: true
            1
        catch
            ended: true
            2
`);
assert(r === "successful!");
}); // ============================================================

testEndless(async () => {
let r = await $api.runCodeEndless(code`
promise: Promise((resolve, reject) ->
    setTimeout(-- reject(Error("fail!")), 0)
)
result'export: null
ended'export: false
do --
    try
        promise'wait
    catch ex
        result: ex.message
        ended: true
`);
assert(r === "fail!");
}); // ============================================================

testEndless(async () => {
let r = await $api.runCodeEndless(code`
promise: Promise((resolve, reject) ->
    setTimeout(-- reject(Error("fail!")), 0)
)
result'export: null
ended'export: false
a: --
    promise'wait
b: --
    try
        result: a()'wait
    catch ex
        result: ex.message
        ended: true
b()
`);
assert(r === "fail!");
}); // ============================================================
