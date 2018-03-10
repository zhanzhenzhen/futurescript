#!/usr/bin/env node --experimental-modules --no-warnings

"use strict";

import assert from "assert";
import pathMod from "path";
let $path = pathMod.posix;
import $cp from "child_process";
import $fs from "fs";
import rm from "rimraf";

let cwdPackageInfo = JSON.parse($fs.readFileSync("package.json", {encoding: "utf8"}));
assert(cwdPackageInfo.name === "futurescript");

let packageDir = process.cwd();
let libDir = $path.join(packageDir, "lib");
let defaultTargetRootDir = $path.join(packageDir, "target");

let mkdir = name => {
    if (!$fs.existsSync(name)) {
        $fs.mkdirSync(name);
    }
};

let copyFile = (source, dest) => {
    $fs.writeFileSync(dest, $fs.readFileSync(source));
};

let readRefList = path => {
    let r = JSON.parse($fs.readFileSync(path, {encoding: "utf8"}));
    let filenames = r.map(m => m[1]);
    assert(filenames.length === distinct(filenames).length);
    return r;
};

let distinct = arr => {
    let r = [];
    arr.forEach(m => {
        if (!r.some(n => n === m)) {
            r.push(m);
        }
    });
    return r;
};

let makeSingleVersion = (version, targetDir) => {
    let dirname = "c-v" + version;
    let sourceDir = $path.join(libDir, dirname);
    if (!$fs.statSync(sourceDir).isDirectory()) return;
    rm.sync(targetDir);
    mkdir(targetDir);
    let sourceRefPath = $path.join(sourceDir, "ref.json");
    let targetRefPath = $path.join(targetDir, "ref.json");
    copyFile(sourceRefPath, targetRefPath);
    let refList = readRefList(sourceRefPath);
    refList.forEach(item => {
        let sourcePath = $path.join(libDir, "c-v" + item[0], item[1]);
        let destPath = $path.join(targetDir, item[1]);
        copyFile(sourcePath, destPath);
    });
};

let makeAllVersions = targetRootDir => {
    initTargetRootDir(targetRootDir);
    $fs.readdirSync(libDir).filter(m => m.startsWith("c-v")).forEach(dirname => {
        makeSingleVersion(dirname.match(/^c-v(.+)$/)[1], $path.join(targetRootDir, dirname));
    });
};

let initTargetRootDir = targetRootDir => {
    rm.sync(targetRootDir);
    mkdir(targetRootDir);
    copyFile($path.join(libDir, "env.mjs"), $path.join(targetRootDir, "env.mjs"));
    copyFile($path.join(libDir, "locked-api.mjs"), $path.join(targetRootDir, "locked-api.mjs"));
    copyFile($path.join(libDir, "test-locked-api.mjs"), $path.join(targetRootDir, "test-locked-api.mjs"));
};

let args = process.argv.slice();
args.splice(0, 2); // strip "node" and the name of this file

if (
    args[0] === "c-current" || args[0] === "cc" ||
    args[0] === "make-all" ||
    args[0] === "test" || args[0] === "t"
) {
    let version = cwdPackageInfo.version;
    if (args[0] === "c-current" || args[0] === "cc") {
        let cCurrentDir = $path.join(packageDir, "c-current");
        makeSingleVersion(version, cCurrentDir);
    }
    else if (args[0] === "make-all") {
        makeAllVersions(defaultTargetRootDir);
    }
    else if (args[0] === "test" || args[0] === "t") {
        initTargetRootDir(defaultTargetRootDir);
        let targetVersionDir = $path.join(defaultTargetRootDir, "c-v" + version);
        makeSingleVersion(version, targetVersionDir);
        process.stdout.write($cp.execFileSync(
            process.execPath,
            [
                "--experimental-modules",
                "--no-warnings",
                $path.join(targetVersionDir, "test-main.mjs")
            ]
        ));
    }
}
else if (args[0] === "version" || args[0] === "v" || args[0] === "--version") {
    console.log(cwdPackageInfo.version);
}
else if (args[0] === "postinstall") {
    makeAllVersions(defaultTargetRootDir);
}
else {
    throw new Error("Invalid command arguments.");
}
