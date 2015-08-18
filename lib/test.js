import compile from "./compile.js";
console.log(compile({code: `lemo 0.1.0

a: 123
if a = 123
    b: 456
console.log(a)
`, path: "abc.lemo"}));
