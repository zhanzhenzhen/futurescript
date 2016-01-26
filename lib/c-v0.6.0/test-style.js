import {test, assert, code} from "./test-base.js";
import * as $lex from "./lex.js";
import * as $style from "./style.js";

let lex, style;

//test(() => {
lex = new $lex.Lex(code`, node modules
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
`);
style = $style.generateStyles(lex);
console.log(lex.raw);
console.log(style);
//}); // ============================================================
