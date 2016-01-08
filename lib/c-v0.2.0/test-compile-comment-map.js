import {test, assert, code} from "./test-base.js";
import * as $api from "../test-locked-api.js";
import * as $libApi from "../locked-api.js";

let r;

test(() => {
r = $libApi.generateOutput({code: code`
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
`, outputCodeReadability: 1}).targets[0].code;
assert(r === String.raw`"use strict";var text,a;/*2*/text=(("dog"));/*3*/a=(1);/*4*/(3);/*5*/([(4)]);/*6*/({b:(5)});/*7*/(("abc"));/*8*/(("abc"));/*9*/((true)?((()=>{/*10*/return (3);})()):((()=>{/*12*/return (4);})()));/*13*/(((console).log)((("haha"))));`);
}); // ============================================================
