import * as $lex from "../lib/compile-lex-0";
import assert from "assert";

let s = null;

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
console.log(s === 'NormalToken "number", Colon, Num "42", Semicolon, NormalToken "opposite", Colon, True, Semicolon, NormalToken "number", Colon, Negative, Num "42", If, NormalToken "opposite", Semicolon, NormalToken "square", Colon, DiamondFunction, Arg, Times, Arg, Semicolon, NormalToken "list", Colon, LeftBracket, Num "1", Comma, Num "2", Comma, Num "3", Comma, Num "4", Comma, Num "5", RightBracket, Semicolon, NormalToken "math", Colon, LeftBrace, NormalToken "root", Colon, NormalToken "Math", Dot, NormalToken "sqrt", Semicolon, NormalToken "square", Colon, NormalToken "square", Semicolon, NormalToken "cube", Colon, DiamondFunction, Arg, Times, NormalToken "square", Arg, RightBrace, Semicolon, NormalToken "alert", InlineNormalString, CallLeftParenthesis, Str "I knew it!", RightParenthesis, If, NormalToken "elvis", NormalVariant, NormalToken "ok", Semicolon, NormalToken "cubes", Colon, NormalToken "list", Dot, NormalToken "map", DiamondFunction, NormalToken "math", Dot, NormalToken "cube", Arg');

s = new $lex.Lex(`lemo 0.1.0
lib: import "lib"
{fun1, fun2 as f2}: import "lib2"
multiply'export: <> @0 * @1
mp: <>
    @0 * @1
above export as multiply2
`).toString();
console.log(s === 'NormalToken "lib", Colon, Import, InlineNormalString, CallLeftParenthesis, Str "lib", RightParenthesis, Semicolon, LeftBrace, NormalToken "fun1", Comma, NormalToken "fun2", As, NormalToken "f2", RightBrace, Colon, Import, InlineNormalString, CallLeftParenthesis, Str "lib2", RightParenthesis, Semicolon, NormalToken "multiply", NormalVariant, NormalToken "export", Colon, DiamondFunction, Arg, Num "0", Times, Arg, Num "1", Semicolon, NormalToken "mp", Colon, DiamondFunction, LeftChevron, Arg, Num "0", Times, Arg, Num "1", RightChevron, Semicolon, Above, Export, As, NormalToken "multiply2"');

s = new $lex.Lex(`lemo 0.1.0
b.if: 1
b.if.a: 1
b: {if: 1}
`).toString();
console.log(s === 'NormalToken "b", Dot, NormalToken "if", Colon, Num "1", Semicolon, NormalToken "b", Dot, NormalToken "if", Dot, NormalToken "a", Colon, Num "1", Semicolon, NormalToken "b", Colon, LeftBrace, NormalToken "if", Colon, Num "1", RightBrace');
