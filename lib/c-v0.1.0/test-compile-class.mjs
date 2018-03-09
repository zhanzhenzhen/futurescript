import {test, assert, code} from "./test-base.mjs";
import * as $api from "../test-locked-api.mjs";
import * as $libApi from "../locked-api.mjs";

test(async () => {
let r = await $api.runCode(code`
A: class
    static abc: x -> x + 1
export: A.abc(2)
`);
assert(r === 3);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
val: null
A: class
    static abc: <> Me._a: 3
    static def: <>
        Me._a: self + 1
        val: Me._a
A.abc()
A.def()
export: val
`);
assert(r === 4);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
val: null
A: class
    static _a: 1
    static abc: <> val: Me._a
A.abc()
export: val
`);
assert(r === 1);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
val: null
A: class
    new: <> val: me._a
    _a: 1
A()
export: val
`);
assert(r === 1);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
A: class
    static a: <>
        b: (x) -> x + 1
        b(2)
export: A.a()
`);
assert(r === 3);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
Aaa: class
    static: --
        Me.init: true
export: Aaa.init
`);
assert(r === true);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
A: class
    new: x ->
        me.data: x
    dataPlus: x ->
        me.data + x
B: class from A
    new: <>
        super(3)
    dataPlus: <> super 5
b: new B()
export: [b.data, b.dataPlus()]
`);
assert(r[0] === 3 && r[1] === 8);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
A: class
    new: x ->
        me.data: x
B: class from A
    new: <>
        super'(@)
b: new B(5)
export: b.data
`);
assert(r === 5);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
A: class
    "a a": -- 1
export: A()."a a"()
`);
assert(r === 1);
}); // ============================================================

test(async () => {
let r = await $api.runCode(code`
Animal: class
    name'get: <>
        me._name.toUpperCase()
    name'set: <>
        me._name: @0
animal: Animal()
animal.name: "aaa"
export: animal.name
`);
assert(r === "AAA");
}); // ============================================================
