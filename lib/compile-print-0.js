export let printObject = function(obj, type, level) {
    let head = type === Object ? "{" : type.name + " {";
    return head + "\n" +
    Object.keys(obj).map(key =>
        obj[key] === undefined ?
        "" :
        "    ".repeat(level + 1) + key + ": " + obj[key].print(level + 1)
    ).join("") +
    "    ".repeat(level) + "}\n";
};

export let printArray = function(arr, type, level) {
    let head = type === Array ? "[" : type.name + " [";
    return head + "\n" +
    arr.map(element => "    ".repeat(level + 1) + element.print(level + 1)).join("") +
    "    ".repeat(level) + "]\n";
};
