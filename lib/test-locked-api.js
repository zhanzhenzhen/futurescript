import $fs from "fs";
import pathMod from "path";
let $path = pathMod.posix;
import * as $libLockedApi from "./locked-api.mjs";

export {currentVersion} from "../package.json";

let slashPath = function(path) {
    if (typeof path === "string") {
        return path.replace(/\\/g, "/");
    }
    else {
        return path;
    }
};

let moduleDirName = $path.dirname(slashPath(module.filename));
export let tempDirectory = $path.basename(moduleDirName) + "/temp";

// Currently we don't support `utf16BeBom` because Node.js doesn't support it.
export let TextEncoding = {
    utf8: 0,
    utf8Bom: 1,
    utf16BeBom: 2,
    utf16LeBom: 3
};

export let writeTextFile = function(path, text, encoding = TextEncoding.utf8) {
    let bytes = null;
    if (encoding === TextEncoding.utf8) {
        bytes = new Buffer(text, "utf8");
    }
    else if (encoding === TextEncoding.utf8Bom) {
        let rawBytes = new Buffer(text, "utf8");
        bytes = new Buffer(rawBytes.length + 3);
        bytes[0] = 0xEF;
        bytes[1] = 0xBB;
        bytes[2] = 0xBF;
        rawBytes.copy(bytes, 3);
    }
    else if (encoding === TextEncoding.utf16LeBom) {
        let rawBytes = new Buffer(text, "utf16le");
        bytes = new Buffer(rawBytes.length + 2);
        bytes[0] = 0xFF;
        bytes[1] = 0xFE;
        rawBytes.copy(bytes, 2);
    }
    else {
        throw new Error("Encoding not supported.");
    }
    $fs.writeFileSync(path, bytes);
};

export let directoryExists = function(path) {
    return $fs.existsSync(path) && $fs.statSync(path).isDirectory();
};

export let createDirectory = function(path) {
    $fs.mkdirSync(path);
};

let runCodeCursor = 0;
let endlessList = [];
let internalRunCode = async function(code, isEndless = false) {
    let runCodeIndex = runCodeCursor;
    runCodeCursor++;
    let output = await $libLockedApi.generateOutput({code: code});

    // Must use this kind of filename. Filename can't be fixed, because `import`
    // will just load the content with a certain file path for the first time.
    // Also, `import` can't be used in VM (TODO: Really? It's not `require` so maybe it can).
    let jsFilename = "code-" + runCodeIndex + ".mjs";

    writeTextFile(tempDirectory + "/" + jsFilename, output.targets[0].code);
    let testModule = await import("./temp/" + jsFilename);
    if (isEndless) {
        return new Promise((resolve, reject) => {
            endlessList.push({module: testModule, resolve: resolve, resolved: false});
        });
    }
    else {
        let r = testModule.default;
        if (r !== undefined) {
            r = JSON.parse(JSON.stringify(r)); // to make sure it's JSON
        }
        return r;
    }
};

export let runCode = async function(code) {
    return await internalRunCode(code);
};

// The `code` must have two exports: `result`, `ended`.
// Once `ended` is set to true, the test will be treated as ended, and
// the `result` will be treated as the output.
export let runCodeEndless = async function(code) {
    return await internalRunCode(code, true);
};

// `setInterval` is dangerous if the CPU time is longer than the interval. So I wrote this.
// TODO: This is from my old code. Some looks not good. Needs improve.
let setSafeInterval = null;
let clearSafeInterval = null;
(() => {
    setSafeInterval = (code, delay) => internalSetInterval(code, delay);
    clearSafeInterval = id => {
        intervalStates[id] = false;
        return undefined;
    };
    let nextIntervalID = 0;
    let intervalStates = [];
    let internalSetInterval = (code, delay, id) => {
        setTimeout(() => {
            if (intervalStates[id]) {
                code();
                internalSetInterval(code, delay, id);
            }
        }, delay);
        if (id === undefined) {
            id = nextIntervalID;
            intervalStates[id] = true;
            nextIntervalID++;
        }
        return id;
    };
})();

let endlessCount = 0;

// This function must be called synchronously so that all of them are done before the
// first test starts and before the timer starts, because knowing the total number of
// endless tests is a must in the timer. If you call them asynchronously, the order
// can't be assured.
export let endlessPlusOne = function() {
    endlessCount++;
};

let endlessTimer = setSafeInterval(() => {
    endlessList.filter(m => !m.resolved && m.module.ended).forEach(m => {
        m.resolve(JSON.parse(JSON.stringify(m.module.result))); // to make sure it's JSON
        m.resolved = true;
    });
    if (endlessList.length === endlessCount && endlessList.every(m => m.resolved)) {
        clearSafeInterval(endlessTimer);
    }
}, 100);

export let printLine = function(str) {
    console.log(str);
};
