import * as $tools from "../lib/compile-tools-0";

let r;

r = $tools.distinct([1,1,2,2,2,3,4]);
console.log(
    Array.isArray(r) && r.length === 4 &&
    r[0] === 1 &&
    r[1] === 2 &&
    r[2] === 3 &&
    r[3] === 4
);

r = $tools.findSortedNumber([1, 3, 5, 7, 9], 4);
console.log(r === 2);

r = $tools.findSortedNumber([1, 3, 5, 7, 9], 4, false);
console.log(r === 1);

r = $tools.findSortedNumber([0, 1, 3, 5, 7, 9], 7);
console.log(r === 4);

r = $tools.findSortedNumber([0, 1, 3, 5, 7, 9], 7, false);
console.log(r === 4);

r = $tools.findSortedNumber([0, 1, 3, 5, 7, 9], 0);
console.log(r === 0);

r = $tools.findSortedNumber([0, 1, 3, 5, 7, 9], 0, false);
console.log(r === 0);

r = $tools.findSortedNumber([0, 1, 3, 5, 7, 9], 9);
console.log(r === 5);

r = $tools.findSortedNumber([0, 1, 3, 5, 7, 9], 9, false);
console.log(r === 5);

r = $tools.findSortedNumber([1, 3, 5, 7, 9], 0);
console.log(r === 0);

r = $tools.findSortedNumber([1, 3, 5, 7, 9], 0, false);
console.log(r === null);

r = $tools.findSortedNumber([1, 3, 5, 7, 9], 10);
console.log(r === null);

r = $tools.findSortedNumber([1, 3, 5, 7, 9], 10, false);
console.log(r === 4);

r = $tools.findSortedNumber([1, 3, 3, 3, 5], 3);
console.log(r === 1);

r = $tools.findSortedNumber([1, 3, 3, 3, 5], 3, false);
console.log(r === 3);
