export let test = function(fn) {
    try {
        fn();
    }
    catch (ex) {
        if (ex instanceof AssertError) {
            console.log("false");
        }
        else {
            console.log("error");
        }
    }
};

export let assert = function(x) {
    if (x) {
    }
    else {
        throw new AssertError();
    }
};

class AssertError extends Error {}
