import compile from "./compile.js";
compile({code: `lemo 0.1.0

a: 123 # store a
if a > 100
    b: 456
    c: "hello world"
else
    b: 444
if a = 9 throw
console.log(a + b * -b / 2.5 - b)
aaa: x -> [2, "abc"]
`, path: "abc.lemo"});
