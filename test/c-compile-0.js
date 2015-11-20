import compile from "../lib/c";

let output;

output = compile({code: `lemo 0.1.0, node module
a: 123
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
a: 123 + 456 and 3
a: if 1 then 2 else 3
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
a: x -> x + 1
console.log a(2)
`, path: "aaa/abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
a: 1
b: match a
    1 ? 10
    2 ? 100
    | 0
console.log b
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
a: "aaa"
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, node module
move: <>
    console.log "\\(@0) --> \\(@1)"

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
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

output = compile({code: `lemo 0.1.0, radical, node module
move: <>
    console.log "\\(@0) --> \\(@1)"

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
`, path: "abc.lemo", sourceMapEnabled: true});
console.log(output);

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
