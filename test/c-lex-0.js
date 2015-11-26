import * as $lex from "../lib/c-lex-0.js";
import assert from "assert";

let s = null;
let lex = null;
let lexPart = null;

s = new $lex.Lex(`lemo 0.1.0, node module
# Assignment:
number:   42
opposite: true

# Conditions:
number: -42 if opposite

# Functions:
square: <> @ * @

# Arrays:
list: [1, 2, 3, 4, 5]

# Objects:
math: {
    root:   Math.sqrt
    square: square
    cube:   <> @ * square @
}

# Existence:
alert "I knew it!" if elvis'ok

# Array comprehensions:
cubes: list.map <> math.cube @
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0, node module", NormalToken "number", Colon, Num "42", Semicolon, NormalToken "opposite", Colon, True, Semicolon, NormalToken "number", Colon, Negative, Num "42", If, NormalToken "opposite", Semicolon, NormalToken "square", Colon, DiamondFunction, Arg, Times, Arg, Semicolon, NormalToken "list", Colon, NormalLeftBracket, Num "1", Comma, Num "2", Comma, Num "3", Comma, Num "4", Comma, Num "5", RightBracket, Semicolon, NormalToken "math", Colon, NormalLeftBrace, NormalToken "root", Colon, NormalToken "Math", Dot, NormalToken "sqrt", Semicolon, NormalToken "square", Colon, NormalToken "square", Semicolon, NormalToken "cube", Colon, DiamondFunction, Arg, Times, NormalToken "square", Arg, RightBrace, Semicolon, NormalToken "alert", InlineNormalString, PseudoCallLeftParenthesis, Str "I knew it!", PseudoCallRightParenthesis, If, NormalToken "elvis", NormalVariant, NormalToken "ok", Semicolon, NormalToken "cubes", Colon, NormalToken "list", Dot, NormalToken "map", DiamondFunction, NormalToken "math", Dot, NormalToken "cube", Arg');

s = new $lex.Lex(`lemo 0.1.0
lib: import "lib"
{fun1, fun2 as f2}: import "lib2"
multiply'export: <> @0 * @1
mp: <>
    @0 * @1
above export as multiply2
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", NormalToken "lib", Colon, Import, InlineNormalString, PseudoCallLeftParenthesis, Str "lib", PseudoCallRightParenthesis, Semicolon, NormalLeftBrace, NormalToken "fun1", Comma, NormalToken "fun2", As, NormalToken "f2", RightBrace, Colon, Import, InlineNormalString, PseudoCallLeftParenthesis, Str "lib2", PseudoCallRightParenthesis, Semicolon, NormalToken "multiply", NormalVariant, NormalToken "export", Colon, DiamondFunction, Arg, Dot, NormalLeftParenthesis, Num "0", RightParenthesis, Times, Arg, Dot, NormalLeftParenthesis, Num "1", RightParenthesis, Semicolon, NormalToken "mp", Colon, DiamondFunction, LeftChevron, Arg, Dot, NormalLeftParenthesis, Num "0", RightParenthesis, Times, Arg, Dot, NormalLeftParenthesis, Num "1", RightParenthesis, RightChevron, ExportAs, NormalToken "multiply2"');

s = new $lex.Lex(`lemo 0.1.0
b.if: 1
b.if.a: 1
b: {if: 1}
b: class
    a: 1
    if: 2
    match'get: 3
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", NormalToken "b", Dot, NormalToken "if", Colon, Num "1", Semicolon, NormalToken "b", Dot, NormalToken "if", Dot, NormalToken "a", Colon, Num "1", Semicolon, NormalToken "b", Colon, NormalLeftBrace, NormalToken "if", Colon, Num "1", RightBrace, Semicolon, NormalToken "b", Colon, Class, LeftChevron, NormalToken "a", Colon, Num "1", Semicolon, NormalToken "if", Colon, Num "2", Semicolon, NormalToken "match", NormalVariant, NormalToken "get", Colon, Num "3", RightChevron');

s = new $lex.Lex(`lemo 0.1.0
if a > 100
    b: 456
    c: "hello world"
else
    b: 444
if a = 9 throw
b: match a
    1 ? 10
    2 ? 100
    |   0
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", If, NormalToken "a", GreaterThan, Num "100", LeftChevron, NormalToken "b", Colon, Num "456", Semicolon, NormalToken "c", Colon, InlineNormalString, PseudoCallLeftParenthesis, Str "hello world", PseudoCallRightParenthesis, RightChevron, Else, LeftChevron, NormalToken "b", Colon, Num "444", RightChevron, Semicolon, If, NormalToken "a", Equal, Num "9", Throw, Semicolon, NormalToken "b", Colon, Match, NormalToken "a", LeftChevron, Num "1", Then, Num "10", Semicolon, Num "2", Then, Num "100", Semicolon, Else, Num "0", RightChevron');

s = new $lex.Lex(`lemo 0.1.0
x: a + b * -b / 2.5 - b
x: -3 ** 4
x: 4** -3
x: 4+(-3)
x:-3
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", NormalToken "x", Colon, NormalToken "a", Plus, NormalToken "b", Times, Negative, NormalToken "b", Over, Num "2.5", Minus, NormalToken "b", Semicolon, NormalToken "x", Colon, Negative, Num "3", Power, Num "4", Semicolon, NormalToken "x", Colon, Num "4", Power, Negative, Num "3", Semicolon, NormalToken "x", Colon, Num "4", Plus, NormalLeftParenthesis, Negative, Num "3", RightParenthesis, Semicolon, NormalToken "x", Colon, Negative, Num "3"');

s = new $lex.Lex(`lemo 0.1.0
x: 1e3
x: 1e+3
x: 1e-3
x: 1e485
x: 3.685e-48-2
x: 0x4fe82
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", NormalToken "x", Colon, Num "1e3", Semicolon, NormalToken "x", Colon, Num "1e+3", Semicolon, NormalToken "x", Colon, Num "1e-3", Semicolon, NormalToken "x", Colon, Num "1e485", Semicolon, NormalToken "x", Colon, Num "3.685e-48", Minus, Num "2", Semicolon, NormalToken "x", Colon, Num "0x4fe82"');

s = new $lex.Lex(`lemo 0.1.0
A: class << aaa: 1 >>
A: class << aaa: x -> << x + 1 >>, bbb: 3 >>
if aaa << task1() >> else << task2() >> commonTask()
if aaa << task1() >> else << task2() >>; commonTask()
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", NormalToken "A", Colon, Class, LeftChevron, NormalToken "aaa", Colon, Num "1", RightChevron, Semicolon, NormalToken "A", Colon, Class, LeftChevron, NormalToken "aaa", Colon, NormalToken "x", ArrowFunction, LeftChevron, NormalToken "x", Plus, Num "1", RightChevron, Comma, NormalToken "bbb", Colon, Num "3", RightChevron, Semicolon, If, NormalToken "aaa", LeftChevron, NormalToken "task1", CallLeftParenthesis, RightParenthesis, RightChevron, Else, LeftChevron, NormalToken "task2", CallLeftParenthesis, RightParenthesis, RightChevron, Semicolon, NormalToken "commonTask", CallLeftParenthesis, RightParenthesis, Semicolon, If, NormalToken "aaa", LeftChevron, NormalToken "task1", CallLeftParenthesis, RightParenthesis, RightChevron, Else, LeftChevron, NormalToken "task2", CallLeftParenthesis, RightParenthesis, RightChevron, Semicolon, NormalToken "commonTask", CallLeftParenthesis, RightParenthesis');

s = new $lex.Lex(`lemo 0.1.0
@(b)
(a)(b)
a(b)
a (b)
a b
a[b]
a [b]
a{b:3}
a {b:3}
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", Arg, CallLeftParenthesis, NormalToken "b", RightParenthesis, Semicolon, NormalLeftParenthesis, NormalToken "a", RightParenthesis, CallLeftParenthesis, NormalToken "b", RightParenthesis, Semicolon, NormalToken "a", CallLeftParenthesis, NormalToken "b", RightParenthesis, Semicolon, NormalToken "a", NormalLeftParenthesis, NormalToken "b", RightParenthesis, Semicolon, NormalToken "a", NormalToken "b", Semicolon, NormalToken "a", CallLeftBracket, NormalToken "b", RightBracket, Semicolon, NormalToken "a", NormalLeftBracket, NormalToken "b", RightBracket, Semicolon, NormalToken "a", CallLeftBrace, NormalToken "b", Colon, Num "3", RightBrace, Semicolon, NormalToken "a", NormalLeftBrace, NormalToken "b", Colon, Num "3", RightBrace');

s = new $lex.Lex(`lemo 0.1.0
a.0: 1
a.(b): 1
a."b": 1
a."b c": 1
(0).a: 1
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", NormalToken "a", Dot, NormalLeftParenthesis, Num "0", RightParenthesis, Colon, Num "1", Semicolon, NormalToken "a", Dot, NormalLeftParenthesis, NormalToken "b", RightParenthesis, Colon, Num "1", Semicolon, NormalToken "a", Dot, NormalLeftParenthesis, InlineNormalString, PseudoCallLeftParenthesis, Str "b", PseudoCallRightParenthesis, RightParenthesis, Colon, Num "1", Semicolon, NormalToken "a", Dot, NormalLeftParenthesis, InlineNormalString, PseudoCallLeftParenthesis, Str "b c", PseudoCallRightParenthesis, RightParenthesis, Colon, Num "1", Semicolon, NormalLeftParenthesis, Num "0", RightParenthesis, Dot, NormalToken "a", Colon, Num "1"');

s = new $lex.Lex(`lemo 0.1.0
Abc: class from Ab
    aaa: <>
    bbb: 2
x: abc |> def :: ghi
a'ok.b'()
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", NormalToken "Abc", Colon, Class, NormalToken "from", NormalToken "Ab", LeftChevron, NormalToken "aaa", Colon, DiamondFunction, Semicolon, NormalToken "bbb", Colon, Num "2", RightChevron, Semicolon, NormalToken "x", Colon, NormalToken "abc", Pipe, NormalToken "def", FatDot, NormalToken "ghi", Semicolon, NormalToken "a", NormalVariant, NormalToken "ok", Dot, NormalToken "b", FunctionVariant, CallLeftParenthesis, RightParenthesis');

lex = new $lex.Lex(`lemo 0.1.0
if aaa
else
    xxx
if aaa
    xxx
else
if aaa
else
`);
s = lex.toString();
console.log(s === 'VersionDirective "lemo 0.1.0", If, NormalToken "aaa", Else, LeftChevron, NormalToken "xxx", RightChevron, Semicolon, If, NormalToken "aaa", LeftChevron, NormalToken "xxx", RightChevron, Else, Semicolon, If, NormalToken "aaa", Else');
lexPart = lex.part().changeTo(3, 4);
console.log(lexPart.startIndex === 3 && lexPart.endIndex === 4);
lexPart = lex.part().changeTo({startIndex: 3, endIndex: 4});
console.log(lexPart.startIndex === 3 && lexPart.endIndex === 4);

s = new $lex.Lex(`lemo 0.1.0
a: aaa /= 1
b: aaa not= 1
c: aaa not = 1
d: aaa not in bbb
e: aaa not is bbb
f: aaa isnt bbb
g: aaa is not bbb
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", NormalToken "a", Colon, NormalToken "aaa", NotEqual, Num "1", Semicolon, NormalToken "b", Colon, NormalToken "aaa", NotEqual, Num "1", Semicolon, NormalToken "c", Colon, NormalToken "aaa", NotEqual, Num "1", Semicolon, NormalToken "d", Colon, NormalToken "aaa", NotIn, NormalToken "bbb", Semicolon, NormalToken "e", Colon, NormalToken "aaa", Isnt, NormalToken "bbb", Semicolon, NormalToken "f", Colon, NormalToken "aaa", Isnt, NormalToken "bbb", Semicolon, NormalToken "g", Colon, NormalToken "aaa", Isnt, NormalToken "bbb"');

s = new $lex.Lex(`0.1.0 {
    radical
    node module
}
a: 1
`).toString();
console.log(s === 'VersionDirective "0.1.0 {\\n    radical\\n    node module\\n}", NormalToken "a", Colon, Num "1"');

s = new $lex.Lex(`lemo 0.1.0
a: 1`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", NormalToken "a", Colon, Num "1"');

s = new $lex.Lex(`lemo 0.1.0
a ifvoid: 1
b ifnull: 1
c: d ifnull 1
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", NormalToken "a", Ifvoid, Colon, Num "1", Semicolon, NormalToken "b", Ifnull, Colon, Num "1", Semicolon, NormalToken "c", Colon, NormalToken "d", Ifnull, Num "1"');

s = new $lex.Lex(`lemo 0.1.0
a: b.3.2
a: @0.1
a: b.0x2e+3
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", NormalToken "a", Colon, NormalToken "b", Dot, NormalLeftParenthesis, Num "3", RightParenthesis, Dot, NormalLeftParenthesis, Num "2", RightParenthesis, Semicolon, NormalToken "a", Colon, Arg, Dot, NormalLeftParenthesis, Num "0", RightParenthesis, Dot, NormalLeftParenthesis, Num "1", RightParenthesis, Semicolon, NormalToken "a", Colon, NormalToken "b", Dot, NormalLeftParenthesis, Num "0x2e", RightParenthesis, Plus, Num "3"');

s = new $lex.Lex(`lemo 0.1.0
try
    a
catch
    b
finally
    c
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", Try, LeftChevron, NormalToken "a", RightChevron, Catch, LeftChevron, NormalToken "b", RightChevron, Finally, LeftChevron, NormalToken "c", RightChevron');

s = new $lex.Lex(`lemo 0.1.0
if a
then b
`).toString();
console.log(s === 'VersionDirective "lemo 0.1.0", If, NormalToken "a", Then, NormalToken "b"');
