import * as $lex from "./compile-lex-0";
let code = `lemo 0.1.0

aaa: x -> [2, "abc"]
b: null-5
`;
let lex = new $lex.Lex(code);
console.log(lex.toString());
