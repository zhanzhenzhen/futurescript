export let includes = function(arr, element) {
    return arr.indexOf(element) !== -1;
};

export let distinct = function(arr) {
    let r = [];
    arr.forEach(m => {
        if (!r.some(n => n === m)) {
            r.push(m);
        }
    });
    return r;
};

// If smallest=true, find the smallest index where num<=arr[index].
// Otherwise, find the largest index where num>=arr[index].
// The array must be sorted in ascending order.
// For example, findSortedNumber([1, 3, 5, 7, 9], 4) should return 2.
// findSortedNumber([1, 3, 5, 7, 9], 4, false) should return 1.
export let findSortedNumber = function(arr, num, smallest = true) {
    if (
        arr.length === 0 ||
        (smallest && num > arr[arr.length - 1]) ||
        (!smallest && num < arr[0])
    ) {
        return null;
    }
    let left = 0;
    let right = arr.length - 1;
    while (right - left > 1) {
        let mid = Math.floor((left + right) / 2);
        if (smallest) {
            if (arr[mid] < num) {
                left = mid;
            }
            else {
                right = mid;
            }
        }
        else {
            if (arr[mid] > num) {
                right = mid;
            }
            else {
                left = mid;
            }
        }
    }
    if (smallest) {
        return num <= arr[left] ? left : right;
    }
    else {
        return num >= arr[right] ? right : left;
    }
};

// Similar to `instanceof`, but tests class rather than its instance.
export let classIsClass = function(thisClass, superClass) {
    return typeof thisClass === "function" && (
        thisClass === superClass || thisClass.prototype instanceof superClass
    );
};

// Similar to `instanceof`, but the second argument is an array of classes rather than a class.
// If any class in the array matches, then return true.
// Note, that because `instanceof` is a JS keyword, we have to use a different variable
// name `instanceOf` and later export it as the desired `instanceof`. This is legal.
let instanceOf = function(obj, arr) {
    return arr.some(m => obj instanceof m);
};
export {instanceOf as instanceof};

// Shrink the string by 1 character on both left and right. Useful in stripping enclosed `"`.
export let shrinkString = function(s) {
    return s.substr(1, s.length - 2);
};

export let asyncForEach = function(arr, callback) {
    let promise = Promise.resolve();
    arr.forEach((element, index) => {
        promise = promise.then(value => callback(element, index));
    });

    // `forEach` returns undefined so in its async form we also need to return undefined.
    return promise.then(() => undefined);
};
