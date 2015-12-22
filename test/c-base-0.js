import * as $lockedApi from "./locked-api.js";
import * as $tools from "../lib/c-tools-0.js";

let index = 0;

export let test = function(fn) {
    try {
        fn();
    }
    catch (ex) {
        if (ex instanceof AssertError) {
            $lockedApi.print("false, " + index.toString());
        }
        else {
            $lockedApi.print("error, " + index.toString());
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

if (!$lockedApi.directoryExists("test/temp")) {
    $lockedApi.createDirectory("test/temp");
}
