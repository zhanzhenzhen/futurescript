import * as $api from "../test-locked-api.js";
import {test, assert} from "./test-base.js";
import * as $lex from "./lex.js";
import * as $style from "./style.js";

let lex, styles;

// Because we want to test the accurate positions, we must make version line fixed-length.
let code = function(s) {
    return "fus " + " ".repeat(10 - $api.currentVersion.length) + $api.currentVersion + s.raw[0];
};

test(async () => {
let lex = new $lex.Lex(code`, node modules
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
let styles = $style.generateStyles(lex);
assert(JSON.stringify(styles) === "[[0,0],[29,3],[42,0],[72,3],[85,0],[98,1],[100,0],[111,3],[123,0],[132,4],[134,0],[142,3],[151,0],[175,3],[185,0],[247,4],[249,0],[266,3],[278,0],[286,2],[296,0],[298,1],[300,0],[306,1],[309,0],[311,3],[334,0],[351,4],[353,0]]");
}); // ============================================================
