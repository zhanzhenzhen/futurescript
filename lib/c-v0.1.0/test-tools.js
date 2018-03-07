import {test, assert} from "./test-base.js";
import * as $tools from "./tools.js";

test(async () => {
    let r = $tools.distinct([1,1,2,2,2,3,4]);
    assert(
        Array.isArray(r) && r.length === 4 &&
        r[0] === 1 &&
        r[1] === 2 &&
        r[2] === 3 &&
        r[3] === 4
    );
});

test(async () => {
    let r = $tools.findSortedNumber([1, 3, 5, 7, 9], 4);
    assert(r === 2);
});

test(async () => {
    let r = $tools.findSortedNumber([1, 3, 5, 7, 9], 4, false);
    assert(r === 1);
});

test(async () => {
    let r = $tools.findSortedNumber([0, 1, 3, 5, 7, 9], 7);
    assert(r === 4);
});

test(async () => {
    let r = $tools.findSortedNumber([0, 1, 3, 5, 7, 9], 7, false);
    assert(r === 4);
});

test(async () => {
    let r = $tools.findSortedNumber([0, 1, 3, 5, 7, 9], 0);
    assert(r === 0);
});

test(async () => {
    let r = $tools.findSortedNumber([0, 1, 3, 5, 7, 9], 0, false);
    assert(r === 0);
});

test(async () => {
    let r = $tools.findSortedNumber([0, 1, 3, 5, 7, 9], 9);
    assert(r === 5);
});

test(async () => {
    let r = $tools.findSortedNumber([0, 1, 3, 5, 7, 9], 9, false);
    assert(r === 5);
});

test(async () => {
    let r = $tools.findSortedNumber([1, 3, 5, 7, 9], 0);
    assert(r === 0);
});

test(async () => {
    let r = $tools.findSortedNumber([1, 3, 5, 7, 9], 0, false);
    assert(r === null);
});

test(async () => {
    let r = $tools.findSortedNumber([1, 3, 5, 7, 9], 10);
    assert(r === null);
});

test(async () => {
    let r = $tools.findSortedNumber([1, 3, 5, 7, 9], 10, false);
    assert(r === 4);
});

test(async () => {
    let r = $tools.findSortedNumber([1, 3, 3, 3, 5], 3);
    assert(r === 1);
});

test(async () => {
    let r = $tools.findSortedNumber([1, 3, 3, 3, 5], 3, false);
    assert(r === 3);
});

test(async () => {
    let delay = ms => new Promise((resolve, reject) =>
        setTimeout(() => {
            resolve();
        }, ms);
    );
    let r = 0;
    let oldTime = new Date();
    let ret = await $tools.asyncForEach([1, 2, 3], element =>
        await delay(50);
        r = r + element;
    );
    let actualMs = new Date() - oldTime;
    assert(r === 6);
    assert(ret === undefined);
    assert(150 <= actualMs && actualMs <= 190);
});
