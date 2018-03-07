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
    let r = $tools.mergeSorted([[1, 3, 5], [2, 4]], x => x);
    assert(
        Array.isArray(r) && r.length === 5 &&
        r[0] === 1 &&
        r[1] === 2 &&
        r[2] === 3 &&
        r[3] === 4 &&
        r[4] === 5
    );
});

test(async () => {
    let r = $tools.mergeSorted([[1, 6, 6, 12], [1, 5, 12, 14, 15, 20]], x => x);
    assert(
        Array.isArray(r) && r.length === 10 &&
        r[0] === 1 &&
        r[1] === 1 &&
        r[2] === 5 &&
        r[3] === 6 &&
        r[4] === 6 &&
        r[5] === 12 &&
        r[6] === 12 &&
        r[7] === 14 &&
        r[8] === 15 &&
        r[9] === 20
    );
});

test(async () => {
    let r = $tools.mergeSorted([
        [{x: 1, y: 2}],
        [{x: -3, y: -5}, {x: 2, y: 0}]
    ], m => m.x);
    assert(
        Array.isArray(r) && r.length === 3 &&
        r[0] instanceof Object && r[0].x === -3 && r[0].y === -5 &&
        r[1] instanceof Object && r[1].x === 1 && r[1].y === 2 &&
        r[2] instanceof Object && r[2].x === 2 && r[2].y === 0
    );
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
