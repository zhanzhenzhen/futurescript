import {test, assert, code} from "./test-base.js";
import * as $api from "../test-locked-api.js";
import * as $libApi from "../locked-api.js";

let r;

test(() => {
r = $libApi.generateOutput({code: code`
a: import "./a.js"
`}).targets[0].code;
assert(r === '"use strict";import a from "./a.js";');
}); // ============================================================

test(() => {
r = $libApi.generateOutput({code: code`, node modules
a: import "./a.js"
`}).targets[0].code;
assert(r === '"use strict";var a;a=require("./a.js");');
}); // ============================================================

test(() => {
r = $libApi.generateOutput({code: code`
{a, b as c}: import "./a.js"
`}).targets[0].code;
assert(r === '"use strict";import {a as a,b as c} from "./a.js";');
}); // ============================================================

test(() => {
r = $libApi.generateOutput({code: code`, node modules
{a, b as c}: import "./a.js"
`}).targets[0].code;
assert(r === '"use strict";var a,c;a=require("./a.js").a;c=require("./a.js").b;');
}); // ============================================================

test(() => {
r = $libApi.generateOutput({code: code`
a: 1
b: import "./b.js" + 5
`}).targets[0].code;
assert(r === '"use strict";import var_573300145710716007_0 from "./b.js";var a,b;a=(1);b=((var_573300145710716007_0)+(5));');
}); // ============================================================

test(() => {
r = $libApi.generateOutput({code: code`, node modules
a: 1
b: import "./b.js" + 5
`}).targets[0].code;
assert(r === '"use strict";var a,b;a=(1);b=((require("./b.js"))+(5));');
}); // ============================================================

test(() => {
r = $libApi.generateOutput({code: code`
a: 1 export as aaa
`}).targets[0].code;
assert(r === '"use strict";var var_573300145710716007_0;var a;a=(var_573300145710716007_0=(1));export {var_573300145710716007_0 as aaa};');
}); // ============================================================

test(() => {
r = $libApi.generateOutput({code: code`, node modules
a: 1 export as aaa
`}).targets[0].code;
assert(r === '"use strict";var a;a=(exports.aaa=(1));');
}); // ============================================================

test(() => {
r = $libApi.generateOutput({code: code`
a'export: 1
`}).targets[0].code;
assert(r === '"use strict";var a;a=(1);export {a as a};');
}); // ============================================================

test(() => {
r = $libApi.generateOutput({code: code`, node modules
a'export: 1
`}).targets[0].code;
assert(r === '"use strict";var a;exports.a=a=(1);');
}); // ============================================================

test(() => {
r = $libApi.generateOutput({code: code`
a: 1 as b'export
c'export: 2
d: 3
`}).targets[0].code;
assert(r === '"use strict";var a,b,c,d;a=(b=(1));c=(2);d=(3);export {b as b};export {c as c};');
}); // ============================================================

test(() => {
r = $libApi.generateOutput({code: code`, node modules
a: 1 as b'export
c'export: 2
d: 3
`}).targets[0].code;
assert(r === '"use strict";var a,b,c,d;a=(exports.b=b=(1));exports.c=c=(2);d=(3);');
}); // ============================================================

test(() => {
r = $libApi.generateOutput({code: code`
a: 1
export a
`}).targets[0].code;
assert(r === '"use strict";var a;a=(1);export {a as a};');
}); // ============================================================

test(() => {
r = $libApi.generateOutput({code: code`, node modules
a: 1
export a
`}).targets[0].code;
assert(r === '"use strict";var a;a=(1);exports.a=a;');
}); // ============================================================

test(() => {
r = $libApi.generateOutput({code: code`
a: 1
export a as b
`}).targets[0].code;
assert(r === '"use strict";var a;a=(1);export {a as b};');
}); // ============================================================

test(() => {
r = $libApi.generateOutput({code: code`, node modules
a: 1
export a as b
`}).targets[0].code;
assert(r === '"use strict";var a;a=(1);exports.b=a;');
}); // ============================================================

test(() => {
r = $libApi.generateOutput({code: code`
export: 3 + 4
`}).targets[0].code;
assert(r === '"use strict";export default ((3)+(4));');
}); // ============================================================

test(() => {
r = $libApi.generateOutput({code: code`, node modules
export: 3 + 4
`}).targets[0].code;
assert(r === '"use strict";module.exports=((3)+(4));');
}); // ============================================================

test(() => {
r = $libApi.generateOutput({code: code`
undefined'export: 1
a: 2 as instanceof'export
`}).targets[0].code;
assert(r === '"use strict";var a,var_573300145710716007_0,var_573300145710716007_1;var_573300145710716007_0=(1);a=(var_573300145710716007_1=(2));export {var_573300145710716007_0 as undefined};export {var_573300145710716007_1 as instanceof};');
}); // ============================================================

test(() => {
r = $libApi.generateOutput({code: code`, node modules
undefined'export: 1
a: 2 as instanceof'export
`}).targets[0].code;
assert(r === '"use strict";var a,var_573300145710716007_0,var_573300145710716007_1;exports.undefined=var_573300145710716007_0=(1);a=(exports.instanceof=var_573300145710716007_1=(2));');
}); // ============================================================

test(() => {
r = $libApi.generateOutput({code: code`
(..)'export: <> {contains: x -> true}
`}).targets[0].code;
assert(r === '"use strict";var dotDot_573300145710716007;dotDot_573300145710716007=(function fun_573300145710716007(){var arg_573300145710716007=arguments;return ((()=>{return ({contains:(function fun_573300145710716007(x){return ((()=>{return (true);})());})});})());});export {dotDot_573300145710716007 as dotDot_573300145710716007};');
}); // ============================================================

test(() => {
r = $libApi.generateOutput({code: code`, node modules
(..)'export: <> {contains: x -> true}
`}).targets[0].code;
assert(r === '"use strict";var dotDot_573300145710716007;exports.dotDot_573300145710716007=dotDot_573300145710716007=(function fun_573300145710716007(){var arg_573300145710716007=arguments;return ((()=>{return ({contains:(function fun_573300145710716007(x){return ((()=>{return (true);})());})});})());});');
}); // ============================================================
