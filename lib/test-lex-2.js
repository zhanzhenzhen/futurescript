import * as $lex from "./compile-lex-0";
let code = `lemo 0.1.0
aaa'(1)
zip: lottery.winner'ok.address'ok.zipcode
x: aaa /= bbb
$x: 1
x: "abc \\(a) def"
x: "a
    a"
x: <>
    "a
        a"
`;
let lex = new $lex.Lex(code);
console.log(lex.toString());
