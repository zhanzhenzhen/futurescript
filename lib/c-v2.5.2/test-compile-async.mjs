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

// This is to test that if there's a `try` block and this block contains `'wait`, will it
// be compiled to an async function and the last statement of the block be treated as the
// return value? This answer should be "no". It may be compiled to an async function, but
// even if so, the last statement of it must not be treated as the return value of that
// function, because JS is too smart that if an async function returns a promise then using
// `await` to call that function will "await" that promise, which is not what we want.
// We use some tricks to avoid that in the source code.
testEndless(async () => {
let r = await $api.runCodeEndless(code`
a: <>
    Promise((resolve, reject) ->
        setTimeout(--
            result.push "a"
            resolve()
        , 0)
    )
b: <>
    result.push "b"
result'export: []
ended'export: false
do --
    t:
        try
            b()'wait
            a()
        catch
            "error"
    b()'wait
    t'wait
    ended: true
`);
assert(
    r[0] === "b" &&
    r[1] === "b" &&
    r[2] === "a"
);
}); // ============================================================

testEndless(async () => {
let r = await $api.runCodeEndless(code`
a: <>
    Promise((resolve, reject) ->
        setTimeout(--
            result.push "a"
            resolve()
        , 0)
    )
b: <>
    result.push "b"
result'export: []
ended'export: false
do --
    t:
        if true
            b()'wait
            a()
        else
            "error"
    b()'wait
    t'wait
    ended: true
`);
assert(
    r[0] === "b" &&
    r[1] === "b" &&
    r[2] === "a"
);
}); // ============================================================

testEndless(async () => {
let r = await $api.runCodeEndless(code`
promise: Promise((resolve, reject) ->
    setTimeout(-- resolve("successful!"), 0)
)
result'export: null
ended'export: false
do --
    a: promise'wait
    b: a'wait
    result: [a, b]
    ended: true
`);
assert(
    r[0] === "successful!" &&
    r[1] === "successful!"
);
}); // ============================================================

testEndless(async () => {
let r = await $api.runCodeEndless(code`
promise: x ->
    Promise((resolve, reject) ->
        setTimeout(-- resolve(x), 0)
    )
result'export: []
ended'export: false
do --
    f: (i: 0) -> if i < 3
        result.push promise(i)'wait
        f(i + 1)'wait
    f()'wait
    result.push 100
    ended: true
`);
assert(
    r[0] === 0 &&
    r[1] === 1 &&
    r[2] === 2 &&
    r[3] === 100
);
}); // ============================================================

// Test the tricks for the last statement in `if` block. This is similar to the test
// of the last statement in `try` block.
testEndless(async () => {
let r = await $api.runCodeEndless(code`
promise: x ->
    Promise((resolve, reject) ->
        setTimeout(-- resolve(x), 0)
    )
result'export: []
ended'export: false
do --
    promise(0)'wait
    a:
        if true
            0'wait
            promise(1)
        else
            0'wait
            promise(2)
    result.push(a is Promise)
    result.push a'wait
    ended: true
`);
assert(
    r[0] === true &&
    r[1] === 1
);
}); // ============================================================

// If the block is a function block, then we will not use tricks. We should `await`
// that promise for the last statement.
testEndless(async () => {
let r = await $api.runCodeEndless(code`
promise: Promise((resolve, reject) ->
    setTimeout(-- resolve("successful!"), 0)
)
result'export: null
ended'export: false
a: --
    1'wait
    promise
b: --
    result: a()'wait
    ended: true
b()
`);
assert(r === "successful!");
}); // ============================================================

testEndless(async () => {
let r = await $api.runCodeEndless(code`
promise: x ->
    Promise((resolve, reject) ->
        setTimeout(-- resolve(x), 0)
    )
result'export: null
ended'export: false
do --
    result: 1 |> promise'wait
    ended: true
`);
assert(r === 1);
}); // ============================================================

testEndless(async () => {
let r = await $api.runCodeEndless(code`
promise: x ->
    Promise((resolve, reject) ->
        setTimeout(-- resolve(x), 0)
    )
result'export: null
ended'export: false
do --
    result: 1 |> promise()'wait
    ended: true
`);
assert(r === 1);
}); // ============================================================

testEndless(async () => {
let r = await $api.runCodeEndless(code`
promise: (x, y) ->
    Promise((resolve, reject) ->
        setTimeout(-- resolve[x, y], 0)
    )
result'export: null
ended'export: false
do --
    result: 2 |> promise(3)'wait
    ended: true
`);
assert(
    r[0] === 2 &&
    r[1] === 3
);
}); // ============================================================

testEndless(async () => {
let r = await $api.runCodeEndless(code`
A: x -> x + 1
result'export: null
ended'export: false
do --
    result: 2 |> nonew A()'wait
    ended: true
`);
assert(r === 3);
}); // ============================================================

// This is to ensure that `'wait` and `super` can coexist in the same async function.
// This implies that it compiles to the modern `async` and `await`,
// rather than to generator/yield which doesn't support the coexistence.
testEndless(async () => {
let r = await $api.runCodeEndless(code`
promise: Promise((resolve, reject) ->
    setTimeout(-- resolve(1), 0)
)
A: class
    foo: <> 2
B: class from A
    foo: <>
        promise'wait + super()
result'export: null
ended'export: false
do --
    result: B().foo()'wait
    ended: true
`);
assert(r === 3);
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
    A: class
        foo: --
            task()'wait
            void
    result.push "stage 1"
    a: A()
    a.foo()'wait
    result.push "stage 3"
    ended: true
result.push "stage 2"
`);
assert(
    r[0] === "stage 1" &&
    r[1] === "stage 2" &&
    r[2] === "stage 3"
);
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
    promiseOfA: class
        static: --
            result.push "stage 1"
            task()'wait
            result.push "stage 3"
        static foo: 100
    A: promiseOfA'wait
    result.push "stage 4"
    result.push (promiseOfA is Promise)
    result.push A.foo
    ended: true
result.push "stage 2"
`);
assert(
    r[0] === "stage 1" &&
    r[1] === "stage 2" &&
    r[2] === "stage 3" &&
    r[3] === "stage 4" &&
    r[4] === true &&
    r[5] === 100
);
}); // ============================================================
