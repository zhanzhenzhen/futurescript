import compile from "./compile.js";
console.log(compile({code: `lemo 0.1.0

a: 123 # store a
if a > 100
    b: 456
    c: "hello world"
console.log(a + b * b / 2.5)
[2, "abc"]
`, path: "abc.lemo"}));
