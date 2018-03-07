import * as $api from "../test-locked-api.js";
import * as $tools from "./tools.js";

let cursor = 0;

// This promise is to ensure tests go one by one.
let promise = Promise.resolve();

export let test = function(fn) {
    let index = cursor;
    cursor++;
    promise = promise.then(async () => {
        let result = null;
        try {
            result = await fn();
        }
        catch (ex) {
            if (ex instanceof AssertError) {
                $api.printLine("false, " + index.toString());
            }
            else {
                $api.printLine("error, " + index.toString());
            }
        }
    });
};

export let testAsync = function(fn) {
    test(fn);
    $api.endlessPlusOne();
};

export let assert = function(x) {
    if (x) {
    }
    else {
        throw new AssertError();
    }
};

// `ruler` is optional.
// If it's `Error` class, or a class derived from `Error`, then it acts like a class.
// If not so, then it acts like a validation function. The exception will be passed to
// the function as the first argument.
assert.throws = function(fn, ruler) {
    try {
        fn();
    }
    catch (ex) {
        if (
            ruler === undefined ||
            (
                $tools.classIsClass(ruler, Error) ?
                ex instanceof ruler :
                ruler(ex)
            )
        ) {
            return;
        }
    }
    throw new AssertError();
};

class AssertError extends Error {}

export let code = function(s) {
    return "fus " + $api.currentVersion + s.raw[0];
};

if (!$api.directoryExists($api.tempDirectory)) {
    $api.createDirectory($api.tempDirectory);
}
