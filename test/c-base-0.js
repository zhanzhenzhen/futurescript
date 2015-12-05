import * as $lockedApi from "./locked-api.js";

let index = 0;

export let test = function(fn) {
    try {
        fn();
    }
    catch (ex) {
        if (ex instanceof AssertError) {
            console.log("false, " + index.toString());
        }
        else {
            console.log("error, " + index.toString());
        }
    }
    index++;
};

export let assert = function(x) {
    if (x) {
    }
    else {
        throw new AssertError();
    }
};

// `errorType` is optional.
assert.throws = function(fn, errorType) {
    try {
        fn();
    }
    catch (ex) {
        if (errorType === undefined || ex instanceof errorType) {
            return;
        }
    }
    throw new AssertError();
};

class AssertError extends Error {}

if (!$lockedApi.directoryExists("test/temp")) {
    $lockedApi.createDirectory("test/temp");
}
