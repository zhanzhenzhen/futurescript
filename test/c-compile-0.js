import {test, assert} from "./c-base-0.js";
import * as $lockedApi from "./locked-api.js";

let output;
let r;

test(() => {
r = $lockedApi.runCode(`lemo 0.1.0
a: 123
export: a
`);
assert(r === 123);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`lemo 0.1.0
a: 123 + 456 and 3
a: if 1 then 2 else 3
export: a
`);
assert(r === 2);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`lemo 0.1.0
a: x -> x + 1
export: a(2)
`);
assert(r === 3);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`lemo 0.1.0
a: 1
b: match a
    1 ? 10
    2 ? 100
    | 0
export: b
`);
assert(r === 10);
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`lemo 0.1.0
a: "aaa"
export: a
`);
assert(r === "aaa");
}); // ============================================================

test(() => {
r = $lockedApi.runCode(`lemo 0.1.0
message: ""

move: <>
    message: self + "\\(@0) --> \\(@1)\\n"

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

test(() => {
r = $lockedApi.runCode(`lemo 0.1.0, radical
message: ""

move: <>
    message: self + "\\(@0) --> \\(@1)\\n"

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

process.exit();

output = compile({code: `lemo 0.1.0, node module
console.log()
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, radical, node module
console.log()
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, radical, node module
if true then console.log("a")
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, radical, node module
a:
    try
        true
    catch b
        false
    finally
        null
console.log a
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, radical, node module
a:
    try
        true
    catch
        false
console.log a
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, radical, node module
throw Error("haha")
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, radical, node module
throw
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, radical, node module
try
    a: 1
catch
    throw
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
a: 1
b: match a
console.log b
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module, radical
statusCode: 404
message: match <> statusCode >= @
    600 ? "unsupported"
    500 ? "server error"
    400 ? "client error"
    300 ? "redirect"
    200 ? "success"
    100 ? "informational"
    |     "unsupported"
console.log message
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
day: "Sun"
action: match day
    "Sat", "Sun" ? "have a rest"
    |              "work"
console.log action
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
console.log 1 is Number
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
console.log 7 mod 3
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
a: {f: 5, g: 3}
delete a.f
console.log a
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
do --
    console.log("haha")
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
a: 2
a: self + 1
console.log a
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
a: (x, y) -> x + y
console.log a'[5, 6]
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
a: null
console.log a'ok
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
a: null
console.log a'ok.b'ok.c'ok.d
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
a: null
console.log a'ok()
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
a: null
b: a ifnull 1
console.log b
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
a: 1 as b
console.log b
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
console.log 2 ** 3
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
a: 3
plus: (x, y) -> x + y
console.log a |> plus(2)
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
console.log "aaa" + "
    bbb
" + v"ccc"
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
a: r"aaa"
b: r"aaa"gim
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
console.log "aaa\\nbbb"
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
a: r"
    aaa bbb # this is comment
"
console.log "this is aaabbbccc".search(a)
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
a: 1
b: 1
js"
    b = 2
"
console.log a + b
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
###
header comment
###
console.log "haha"
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
###
header comment*/
###
console.log "haha"
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
a: import "./a.js"
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
{a, b as c}: import "./a.js"
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0
a: import "./a.js"
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0
{a, b as c}: import "./a.js"
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0
a: 1
b: import "./b.js" + 5
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0
a: 1 export as aaa
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0
a'export: 1
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0
a: 1
export a
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0
export: 3 + 4
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0
a: <>
    b()
    pause
    c
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);
