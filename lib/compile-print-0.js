export let printObject = function(obj, type, level) {
    return type.name + " {\n" +
    Object.keys(obj).map(key =>
        obj[key] === undefined ?
        "" :
        "    ".repeat(level + 1) + key + ": " + obj[key].print(level + 1)
    ).join("") +
    "    ".repeat(level) + "}\n";
};

export let printArray = function(arr, type, level) {
    return type.name + " [\n" +
    arr.map(element => "    ".repeat(level + 1) + element.print(level + 1)).join("") +
    "    ".repeat(level) + "]\n";
};

export let printAtom = function(thing) {
    if (thing.value === undefined) {
        return thing.constructor.name + "\n";
    }
    else {
        return thing.constructor.name + " " + JSON.stringify(thing.value) + "\n";
    }
};
