import {test, assert, code} from "./test-base.js";
import * as $api from "../test-locked-api.js";
import * as $libApi from "../locked-api.js";

let r;

test(() => {
r = $api.runCode(code`
x: ~>... [
  getX,
  getY
]`);
assert(r === 4);
});
// ============================================================

// test(() => {
// r = $api.runCode(code`
// x: ~>... [
//   ~>|| [
//     getNav,
//     ~>1 [
//       getAd adnet.klikHaus,
//       getAd adnet.inUFace
//     ],
//     ~>:o [
//       rescue
//     ]
//   ]
// ]`);
// assert(r === 3);
// });
// ============================================================

