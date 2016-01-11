export let isNode = (
    typeof process === "object" &&
    typeof process.release === "object" &&
    process.release.name === "node"
) ? true : false;

export let nodeVersion = isNode ? process.versions.node : null;

export let fsPreset = {};
