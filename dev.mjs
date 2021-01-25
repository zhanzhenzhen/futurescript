import assert from "assert";
import pathMod from "path";
let $path = pathMod.posix;
import $cp from "child_process";
import $fs from "fs";

let cwdPackageInfo = JSON.parse($fs.readFileSync("package.json", {encoding: "utf8"}));
assert(cwdPackageInfo.name === "futurescript");

let validateVersion = x => assert(x.length <= 10 && x.search(/^\d+\.\d+\.\d+$/) !== -1);

validateVersion(cwdPackageInfo.version);

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
    r.map(m => m[0]).forEach(m => validateVersion(m));
    let filenames = r.map(m => m[1]);
    filenames.forEach(m => validatePermanentMjsFilename(m));
    assert(filenames.length === distinct(filenames).length);
    return r;
};

let validatePermanentMjsFilename = filename => assert(
    filename.length <= 60 &&
    filename.search(/^[a-z0-9]([a-z0-9\-]*[a-z0-9])?\.mjs$/) !== -1
);

let distinct = arr => {
    let r = [];
    arr.forEach(m => {
        if (!r.some(n => n === m)) {
            r.push(m);
        }
    });
    return r;
};

let makeSingleVersion = (version, targetDir, useSymlink = false) => {
    let copyOrLinkFile = (sourcePath, destPath) => {
        if (useSymlink) {
            $fs.symlinkSync($path.relative($path.dirname(destPath), sourcePath), destPath);
        }
        else {
            copyFile(sourcePath, destPath);
        }
    };
    let dirname = "c-v" + version;
    let sourceDir = $path.join(libDir, dirname);
    if (!$fs.statSync(sourceDir).isDirectory()) return;
    $fs.rmSync(targetDir, {recursive: true, force: true});
    mkdir(targetDir);
    let sourceRefPath = $path.join(sourceDir, "ref.json");
    let refList = readRefList(sourceRefPath);
    refList.forEach(item => {
        if (isPostinstall && item[1].startsWith("test-")) return;
        let sourcePath = $path.join(libDir, "c-v" + item[0], item[1]);
        let destPath = $path.join(targetDir, item[1]);
        copyOrLinkFile(sourcePath, destPath);
    });
};

let makeAllVersions = targetRootDir => {
    initTargetRootDir(targetRootDir);
    $fs.readdirSync(libDir).filter(m => m.startsWith("c-v")).forEach(dirname => {
        makeSingleVersion(dirname.match(/^c-v(.+)$/)[1], $path.join(targetRootDir, dirname));
    });
};

let initTargetRootDir = targetRootDir => {
    $fs.rmSync(targetRootDir, {recursive: true, force: true});
    mkdir(targetRootDir);
    $fs.readdirSync(libDir).filter(m => m.endsWith(".mjs")).forEach(filename => {
        copyFile($path.join(libDir, filename), $path.join(targetRootDir, filename));
    });
};

let args = process.argv.slice();
args.splice(0, 2); // strip "node" and the name of this file

let isPostinstall = args[0] === "postinstall";

if (
    args[0] === "c-current" || args[0] === "cc" ||
    args[0] === "make-all" ||
    args[0] === "test" || args[0] === "t"
) {
    let version = cwdPackageInfo.version;
    if (args[0] === "c-current" || args[0] === "cc") {
        let cCurrentDir = $path.join(packageDir, "c-current");
        makeSingleVersion(version, cCurrentDir, true);
    }
    else if (args[0] === "make-all") {
        makeAllVersions(defaultTargetRootDir);
    }
    else if (args[0] === "test" || args[0] === "t") {
        console.log("Making...");
        initTargetRootDir(defaultTargetRootDir);
        let targetVersionDir = $path.join(defaultTargetRootDir, "c-v" + version);
        makeSingleVersion(version, targetVersionDir);
        console.log("Linting...");
        $cp.execFileSync(
            $path.join(packageDir, "node_modules/.bin/eslint"),
            [
                $path.join(packageDir, "*.mjs"),
                $path.join(libDir, "*.mjs"),
                $path.join(targetVersionDir, "*.mjs")
            ],
            {stdio: ["pipe", process.stdout, process.stderr]}
        );
        console.log("Testing...");
        $cp.execFileSync(
            process.execPath,
            [
                "--experimental-json-modules",
                $path.join(targetVersionDir, "test-main.mjs")
            ],
            {stdio: ["pipe", process.stdout, process.stderr]}
        );
    }
}
else if (args[0] === "fork-version") {
    assert(args.length === 2 && args[1].length > 0);
    validateVersion(args[1]);
    assert(!$fs.existsSync("lib/c-v" + cwdPackageInfo.version));
    assert($fs.existsSync("lib/c-v" + args[1]));
    mkdir("lib/c-v" + cwdPackageInfo.version);
    copyFile("lib/c-v" + args[1] + "/ref.json", "lib/c-v" + cwdPackageInfo.version + "/ref.json");
}
else if (args[0] === "fork-file") {
    assert(args.length === 2 && args[1].length > 0);
    validatePermanentMjsFilename(args[1]);
    let refList = readRefList("lib/c-v" + cwdPackageInfo.version + "/ref.json");
    let sourceVersion = refList.find(m => m[1] === args[1])[0];
    let sourcePath = "lib/c-v" + sourceVersion + "/" + args[1];
    let destPath = "lib/c-v" + cwdPackageInfo.version + "/" + args[1];
    assert(!$fs.existsSync(destPath));
    copyFile(sourcePath, destPath);
}
else if (args[0] === "diff") {
    assert(args.length === 3);
    validateVersion(args[1]);
    validateVersion(args[2]);
    makeSingleVersion(args[1], "temp-diff-left");
    makeSingleVersion(args[2], "temp-diff-right");

    // Must use `try` because if the diff is more than one page it will give a non-zero exit code.
    try {
        $cp.execSync(
            "git diff --no-index -- temp-diff-left temp-diff-right",
            {stdio: [process.stdin, process.stdout, process.stderr]}
        );
    }
    catch (ex) {
    }
}
else if (args[0] === "version" || args[0] === "v" || args[0] === "--version") {
    console.log(cwdPackageInfo.version);
}
else if (isPostinstall) {
    makeAllVersions(defaultTargetRootDir);
}
else {
    throw new Error("Invalid command arguments.");
}
