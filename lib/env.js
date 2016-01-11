export let isNode = (
    typeof process === "object" &&
    typeof process.release === "object" &&
    process.release.name === "node"
) ? true : false;

export let fsPreset = {};
