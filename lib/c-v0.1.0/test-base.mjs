import * as $api from "../test-locked-api.mjs";
import * as $tools from "./tools.mjs";

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

// `testEndless` and test locked API's `runCodeEndless` must be used together.
// Endless doesn't mean it never ends. It means it by default never ends.
// When a certain condition is met, it will end. See comment in `runCodeEndless`.
// `testEndless` and `runCodeEndless` provides another way of testing asynchronous things.
// It's uglier than ES async functions, but can do more.
export let testEndless = function(fn) {
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

// This function can be called with or without `await`.
// Similarly, `fn` can be an async function or a normal function.
// `ruler` is optional.
// If it's `Error` class, or a class derived from `Error`, then it acts like a class.
// If not so, then it acts like a validation function. The exception will be passed to
// the function as the first argument.
assert.throws = async function(fn, ruler) {
    try {
        await fn();
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
