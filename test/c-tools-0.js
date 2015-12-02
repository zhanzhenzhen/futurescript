import {test, assert} from "./c-base-0.js";
import * as $tools from "../lib/c-tools-0.js";

let r;

test(() => {
    r = $tools.distinct([1,1,2,2,2,3,4]);
    assert(
        Array.isArray(r) && r.length === 4 &&
        r[0] === 1 &&
        r[1] === 2 &&
        r[2] === 3 &&
        r[3] === 4
    );
});

test(() => {
    r = $tools.findSortedNumber([1, 3, 5, 7, 9], 4);
    assert(r === 2);
});

test(() => {
    r = $tools.findSortedNumber([1, 3, 5, 7, 9], 4, false);
    assert(r === 1);
});

test(() => {
    r = $tools.findSortedNumber([0, 1, 3, 5, 7, 9], 7);
    assert(r === 4);
});

test(() => {
    r = $tools.findSortedNumber([0, 1, 3, 5, 7, 9], 7, false);
    assert(r === 4);
});

test(() => {
    r = $tools.findSortedNumber([0, 1, 3, 5, 7, 9], 0);
    assert(r === 0);
});

test(() => {
    r = $tools.findSortedNumber([0, 1, 3, 5, 7, 9], 0, false);
    assert(r === 0);
});

test(() => {
    r = $tools.findSortedNumber([0, 1, 3, 5, 7, 9], 9);
    assert(r === 5);
});

test(() => {
    r = $tools.findSortedNumber([0, 1, 3, 5, 7, 9], 9, false);
    assert(r === 5);
});

test(() => {
    r = $tools.findSortedNumber([1, 3, 5, 7, 9], 0);
    assert(r === 0);
});

test(() => {
    r = $tools.findSortedNumber([1, 3, 5, 7, 9], 0, false);
    assert(r === null);
});

test(() => {
    r = $tools.findSortedNumber([1, 3, 5, 7, 9], 10);
    assert(r === null);
});

test(() => {
    r = $tools.findSortedNumber([1, 3, 5, 7, 9], 10, false);
    assert(r === 4);
});

test(() => {
    r = $tools.findSortedNumber([1, 3, 3, 3, 5], 3);
    assert(r === 1);
});

test(() => {
    r = $tools.findSortedNumber([1, 3, 3, 3, 5], 3, false);
    assert(r === 3);
});
