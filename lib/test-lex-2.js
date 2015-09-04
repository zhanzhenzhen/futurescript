import * as $lex from "./compile-lex-0";
let code = `lemo 0.1.0
aaa'(1)
x: aaa /= bbb
`;
let lex = new $lex.Lex(code);
console.log(lex.toString());
