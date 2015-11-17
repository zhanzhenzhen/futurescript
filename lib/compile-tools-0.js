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
