import * as $lex from "./compile-lex-0";
let code = `lemo 0.1.0
aaa'(1)
x: aaa /= bbb
$x: 1
`;
let lex = new $lex.Lex(code);
console.log(lex.toString());
