export let printObject = function(obj, type, level) {
    return type.name + " {\n" +
    Object.keys(obj).map(key => {
        if (key.startsWith("_")) {
            return "";
        }
        else if (obj[key] === undefined) {
            return "";
        }
        else if (obj[key] === null) {
            return "    ".repeat(level + 1) + key + ": null\n";
        }
        else if (obj[key] === false) {
            return "    ".repeat(level + 1) + key + ": false\n";
        }
        else if (obj[key] === true) {
            return "    ".repeat(level + 1) + key + ": true\n";
        }
        else if (typeof obj[key] === "string") {
            return "    ".repeat(level + 1) + key + ": " + JSON.stringify(obj[key]) + "\n";
        }
        else if (typeof obj[key] === "number") {
            return "    ".repeat(level + 1) + key + ": " + obj[key].toString() + "\n";
        }
        else {
            return "    ".repeat(level + 1) + key + ": " + obj[key].toString(level + 1);
        }
    }).join("") +
    "    ".repeat(level) + "}\n";
};

// Array can't have undefined element.
export let printArray = function(arr, type, level) {
    return type.name + " [\n" +
        arr.map(element => {
            let s = null;
            if (element === null) {
                s = "null\n";
            }
            else if (element === false) {
                s = "false\n";
            }
            else if (element === true) {
                s = "true\n";
            }
            else if (typeof element === "string") {
                s = JSON.stringify(element) + "\n";
            }
            else if (typeof element === "number") {
                s = element.toString() + "\n";
            }
            else {
                s = element.toString(level + 1);
            }
            return "    ".repeat(level + 1) + s;
        }).join("") + "    ".repeat(level) + "]\n";
};

export let printAtom = function(thing) {
    if (thing.value === undefined) {
        return thing.constructor.name + "\n";
    }
    else {
        return thing.constructor.name + " " + JSON.stringify(thing.value) + "\n";
    }
};
