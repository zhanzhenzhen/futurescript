import {test, testEndless, assert, code} from "./test-base.mjs";
import * as $api from "../test-locked-api.mjs";
import * as $libApi from "../locked-api.mjs";

test(async () => {
let r = await $api.runCode(code`
a: 123
export: a
`);
assert(r === 123);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: 123 + 456 and 3
a: if 1 then 2 else 3
export: a
`);
assert(r === 2);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: x -> x + 1
export: a(2)
`);
assert(r === 3);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: 1
b: match a
    1 ? 10
    2 ? 100
    | 0
export: b
`);
assert(r === 10);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: "aaa"
export: a
`);
assert(r === "aaa");
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
message: ""

move: <>
    message: self + "\(@0) --> \(@1)\n"

hanoi: <>
    if @0.count = 1
        move(@0.from, @0.to)
    else
        fun{
            count: @0.count - 1
            from: @0.from
            auxiliary: @0.to
            to: @0.auxiliary
        }
        move(@0.from, @0.to)
        fun{
            count: @0.count - 1
            from: @0.auxiliary
            auxiliary: @0.from
            to: @0.to
        }

hanoi{
    count: 3
    from: 0
    auxiliary: 1
    to: 2
}

export: message
`);
assert(r === `0 --> 2
0 --> 1
2 --> 1
0 --> 2
1 --> 0
1 --> 2
0 --> 2
`);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`, radical
message: ""

move: <>
    message: self + "\(@0) --> \(@1)\n"

hanoi: <>
    if @count = 1
        move[@from, @to]
    else
        fun{
            count: @count - 1
            from: @from
            auxiliary: @to
            to: @auxiliary
        }
        move[@from, @to]
        fun{
            count: @count - 1
            from: @auxiliary
            auxiliary: @from
            to: @to
        }

hanoi{
    count: 3
    from: 0
    auxiliary: 1
    to: 2
}

export: message
`);
assert(r === `0 --> 2
0 --> 1
2 --> 1
0 --> 2
1 --> 0
1 --> 2
0 --> 2
`);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
if true then a: ("a")
export: a
`);
assert(r === "a");
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: 1
b: match a
export: b = void
`);
assert(r === true);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`, radical
statusCode: 404
message: match <> statusCode >= @
    600 ? "unsupported"
    500 ? "server error"
    400 ? "client error"
    300 ? "redirect"
    200 ? "success"
    100 ? "informational"
    |     "unsupported"
export: message
`);
assert(r === "client error");
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
day: "Sun"
action: match day
    "Sat", "Sun" ? "have a rest"
    |              "work"
export: action
`);
assert(r === "have a rest");
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
export: 1 is Number
`);
assert(r === true);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
export: 7 mod 3
`);
assert(r === 1);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: {f: 5, g: 3}
delete a.f
export: a.f = void
`);
assert(r === true);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
export: do --
    a: "haha"
    a
`);
assert(r === "haha");
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: 2
a: self + 1
export: a
`);
assert(r === 3);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: (x, y) -> x + y
export: a'[5, 6]
`);
assert(r === 11);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: null
export: a'ok
`);
assert(r === false);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: null
b: a ifnull 1
export: b
`);
assert(r === 1);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: 1 as b
export: b
`);
assert(r === 1);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
export: 2 ** 3
`);
assert(r === 8);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: 3
plus: (x, y) -> x + y
export: a |> plus(2)
`);
assert(r === 5);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: 3
y: x -> x + 1
export: a |> y
`);
assert(r === 4);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: 3
y: x -> x + 1
export: a |> y()
`);
assert(r === 4);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: 3
Y: class
    new: x ->
        me.value: x + 1
b: a |> Y()
export: b.value
`);
assert(r === 4);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: 3
Y: class
    new: x ->
        me.value: x + 1
b: a |> Y
export: b.value
`);
assert(r === 4);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: [1, 2]
..: <> {
    contains: (x, y) -> x.indexOf(y) ≠ -1
    count: x -> x.length
    combine: (x, y...) -> x.concat(y)
}
export: [a..contains(2), a..contains(3), a..count(), a..combine(3, 4), a..combine(3, 4)..count()]
`);
assert(
    r[0] === true && r[1] === false && r[2] === 2 &&
    r[3][0] === 1 && r[3][1] === 2 && r[3][2] === 3 && r[3][3] === 4 &&
    r[4] === 4
);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
lib1: {
    count: x -> x.length
}
lib2: {
    count: x -> Object.keys(x).length
}
..: x ->
    if x is Array
        lib1
    else
        lib2
a: [0, 0]
b: {a: 0, b: 0}
export: [a..count(), b..count()]
`);
assert(r[0] === 2 && r[1] === 2);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
export: "aaa" + "
    bbb
" + v"ccc"
`);
assert(r === "aaabbbccc");
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
export: "
    a"a\"a
"
`);
assert(r === "a\"a\"a");
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: r"aaa"
b: r"aaa"gim
export: [
    a.source
    [a.global, a.ignoreCase, a.multiline]
    b.source
    [b.global, b.ignoreCase, b.multiline]
]
`);
assert(
    r[0] === "aaa" &&
    r[1][0] === false && r[1][1] === false && r[1][2] === false &&
    r[2] === "aaa" &&
    r[3][0] === true && r[3][1] === true && r[3][2] === true
);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
export: "aaa\nbbb"
`);
assert(r === "aaa\nbbb");
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: r"
    aaa bbb # this is comment
"
export: "this is aaabbbccc".search(a)
`);
assert(r === 8);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: r"
    a"a
    \n
    b
"
export: "a\"a\nb".search(a)
`);
assert(r === 0);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: r"a\"a\nb"
export: "a\"a\nb".search(a)
`);
assert(r === 0);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: 1
b: 1
js"
    b = 2
"
export: a + b
`);
assert(r === 3);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: 1
js"
    (function(){
        a = 2;
    })()
"
export: a
`);
assert(r === 2);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: "
    Hello
    World\(1+2)\n
    !
"
export: a
`);
assert(r === "Hello\nWorld3\n\n!");
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: v"
    Hello
    World\(1+2)\n
    !
"
export: a
`);
assert(r === "Hello\nWorld\\(1+2)\\n\n!");
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
###
header comment
###
export: "haha"
`);
assert(r === "haha");
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
###
header comment*/
###
export: "haha"
`);
assert(r === "haha");
}); // ============================================================

test(async () => {
let r = (await $libApi.generateOutput({code: code`
a()
pause
b()
`})).targets[0].code;
assert(r === '"use strict";((a)());debugger;((b)());');
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
undefined: 5
export: undefined
`);
assert(r === 5);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: {
    "aaa": 1
}
export: a
`);
assert(r.aaa === 1);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: null
a ifnull: 1
b: 9
b ifnull: 1
export: [a, b]
`);
assert(r[0] === 1 && r[1] === 9);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
[a, b]: [1, 2]
export: [a, b]
`);
assert(r[0] === 1 && r[1] === 2);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: [x, y] -> x + y
export: a[2, 3]
`);
assert(r === 5);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: (x: 1, y: 2) -> x + y
export: a(4) * a()
`);
assert(r === 18);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: [x: 1, y: 2] -> x + y
export: a[4] * a[]
`);
assert(r === 18);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: (x, y...) -> x + y.0 + y.1
export: a(1, 2, 3)
`);
assert(r === 6);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: (x, y, z) -> x + y + z
b: [2, 3]
export: a(1, b...)
`);
assert(r === 6);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
x: [3, 4]
..: <> {
    add3: (a, b, c, d) -> a + b + c + d
}
export: (1)..add3(2, x...)
`);
assert(r === 10);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`, manual new
A: x -> x + 1
export: A(1)
`);
assert(r === 2);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
Symbol()
`);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
export: 3 < 4 ≤ 5
`);
assert(r === true);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
export: 7 > 4 > 5
`);
assert(r === false);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: <> fun
export: a() = a
`);
assert(r === true);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: x -> fun
export: a() = a
`);
assert(r === true);
}); // ============================================================

// This is to ensure that `fun` refers to the correct function.
// Even after another function's `fun` is called, the original
// function's later `fun` (for example in an async logic) should
// still refer to the original function.
testEndless(async () => {
let r = await $api.runCodeEndless(code`
r: []
result'export: null
ended'export: false
a: <>
    b: <>
        r.push(fun)
        if r.length = 1
            setTimeout(fun, 1)
        else if r.length = 3
            result: [r.0 = r.1, r.1 = r.2, r.0 = r.2]
            ended: true
    b
a()()
a()()
`);
assert(
    r[0] === false &&
    r[1] === false &&
    r[2] === true
);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: <> me
b: {}
export: b = a.call(b)
`);
assert(r === true);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: x -> me
b: {}
export: b = a.call(b)
`);
assert(r === true);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: -- me
b: {}
export: b = a.call(b)
`);
assert(r === true);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: <> me
export: a() = void
`);
assert(r === true);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: x -> me
export: a() = void
`);
assert(r === true);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: -- me
export: a() = void
`);
assert(r === true);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
a: <>
    b: --
        [@0, fun = a]
    b()
export: a(3)
`);
assert(
    r[0] === 3 &&
    r[1] === true
);
}); // ============================================================
