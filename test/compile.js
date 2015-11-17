import compile from "../lib/compile";

let output;

output = compile({code: `lemo 0.1.0, node module
a: 123
`, path: "abc.lemo"});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
a: 123 + 456 and 3
a: if 1 then 2 else 3
`, path: "abc.lemo"});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
a: x -> x + 1
console.log a(2)
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);
