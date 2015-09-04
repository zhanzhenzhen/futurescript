import * as $lex from "./compile-lex-0";
let code = `lemo 0.1.0

a: 123 # store a
if a > 100
    b: 456
    c: "hello world"
else
    b: 444
if a = 9 throw
console.log(a + b * -b / 2.5 - b)
aaa: x -> [2, "abc"]
bbb:
    345
ccc: {
    a: 3
    b: 0
}
b: 3 +
    5
b: 3 +
5
b: 3
+ 5
b.if: 1
b.if.a: 1
b: {if: 1}
class
    a: 1
    if: 2
b: match a
    1 ? 10
    2 ? 100
    |   0
b.a: a
.b
a.b <>
    aaa()
.c()
`;
let lex = new $lex.Lex(code);
console.log(lex.toString());
