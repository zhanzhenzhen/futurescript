import {test, assert, code} from "./test-base.mjs";
import * as $api from "../test-locked-api.mjs";
import * as $libApi from "../locked-api.mjs";

test(async () => {
let r = (await $libApi.generateOutput({code: code`
text: "dog"
a: 1
(3)
[4]
{b: 5}
"abc"
v"abc"
if true
    3
else
    4
console.log("haha")
`, outputCodeReadability: 1})).targets[0].code;
assert(r === String.raw`"use strict";var text,a;/*2*/text=(("dog"));/*3*/a=(1);/*4*/(3);/*5*/([(4)]);/*6*/({b:(5)});/*7*/(("abc"));/*8*/(("abc"));/*9*/((true)?((()=>{/*10*/return (3);})()):((()=>{/*12*/return (4);})()));/*13*/(((console).log)((("haha"))));`);
}); // ============================================================
