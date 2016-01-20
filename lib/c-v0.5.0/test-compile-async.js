import {test, testAsync, assert, code} from "./test-base.js";
import * as $api from "../test-locked-api.js";
import * as $libApi from "../locked-api.js";

let r;

test(() => {
r = $api.runCode(code`
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

testAsync(() => {
return $api.runCodeAsync(code`
promise: Promise((resolve, reject) ->
    setTimeout(-- resolve("successful!"), 0)
)
result'export: null
ended'export: false
do --
    result: promise'wait
    ended: true
`);
}).end(r => {
assert(r === "successful!");
}); // ============================================================

testAsync(() => {
return $api.runCodeAsync(code`
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
}).end(r => {
assert(r === true);
}); // ============================================================

testAsync(() => {
return $api.runCodeAsync(code`
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
}).end(r => {
assert(r[0] === "stage 1" && r[1] === "stage 2" && r[2] === "stage 3");
}); // ============================================================

testAsync(() => {
return $api.runCodeAsync(code`
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
}).end(r => {
assert(r === "successful!");
}); // ============================================================
