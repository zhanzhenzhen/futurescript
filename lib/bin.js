"use strict";

let assert = require("assert");
let $path = require("path").posix;
let $cp = require("child_process");
let $fs = require("fs");
let rm = require("rimraf");

let packageInfo = require("../package.json");

let libDir = $path.dirname(slashPath(module.filename));
let packageDir = $path.join(libDir, "..");
let defaultTargetRootDir = $path.join(libDir, "../target");

let mkdir = name => {
    if (!$fs.existsSync(name)) {
        $fs.mkdirSync(name);
    }
};

let copyFile = (source, dest) => {
    $fs.writeFileSync(dest, $fs.readFileSync(source));
};

// For Windows compatibility. Convert path to Unix style.
let slashPath = function(path) {
    if (typeof path === "string") {
        return path.replace(/\\/g, "/");
    }
    else {
        return path;
    }
};

let separateFlags = args => {
    let index = args.findIndex(m => !m.startsWith("-"));
    if (index === -1) {
        return [[], args.slice()];
    }
    else {
        return [args.slice(0, index), args.slice(index)];
    }
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

// `arg1` is source. The optional `arg2` is destination.
let compile = (arg1, arg2, maps) => {
    arg1 = slashPath(arg1);
    arg2 = slashPath(arg2);
    let $lockedApi = require("./locked-api.js");
    let level = maps ? $lockedApi.OutputLevel.sourceMap : $lockedApi.OutputLevel.compile;
    let readability = maps ? 1 : 0;
    let generateOutput = (input) => {
        try {
            return $lockedApi.generateOutput(input);
        }
        catch (ex) {
            if (ex instanceof $lockedApi.SyntaxError) {
                console.error("Syntax error:");
                if (input.path !== undefined) {
                    console.error(input.path);
                }
                console.error(ex.message);
                process.exit(1);
            }
            else {
                throw ex;
            }
        }
    };
    let write = (targetPath, target) => {
        let code = target.code;
        $fs.writeFileSync(targetPath, code);
    };
    let stat = $fs.statSync(arg1);
    if (stat.isDirectory()) {
        if (arg2 === undefined) {
            $fs.readdirSync(arg1).forEach(item => {
                let path = $path.join(arg1, item);
                if (!$fs.statSync(path).isFile()) return;
                if ($path.extname(path) === ".fus") {
                    let output = generateOutput(
                        {path: path, level: level, outputCodeReadability: readability}
                    );
                    let filename = $path.basename(path, ".fus") + ".js";
                    let targetPath = $path.join(arg1, filename);
                    write(targetPath, output.targets[0]);
                }
            });
        }
        else {
            mkdir(arg2);
            $fs.readdirSync(arg1).forEach(item => {
                let path = $path.join(arg1, item);
                if (!$fs.statSync(path).isFile()) return;
                if ($path.extname(path) === ".fus") {
                    let output = generateOutput(
                        {path: path, level: level, outputCodeReadability: readability}
                    );
                    let filename = $path.basename(path, ".fus") + ".js";
                    let targetPath = $path.join(arg2, filename);
                    write(targetPath, output.targets[0]);
                }
                else {
                    let targetPath = $path.join(arg2, item);
                    copyFile(path, targetPath);
                }
            });
        }
    }
    else if (stat.isFile()) {
        let output = generateOutput(
            {path: arg1, level: level, outputCodeReadability: readability}
        );
        let targetPath = arg2;
        if (targetPath === undefined) {
            let filename = $path.basename(arg1, ".fus") + ".js";
            targetPath = $path.join($path.dirname(arg1), filename);
        }
        write(targetPath, output.targets[0]);
    }
    else {
        throw new Error("Not a file or directory.");
    }
};

let makeSingleVersion = (version, targetDir) => {
    let dirname = "c-v" + version;
    let sourceDir = $path.join(libDir, dirname);
    if (!$fs.statSync(sourceDir).isDirectory()) return;
    rm.sync(targetDir);
    mkdir(targetDir);
    let sourceRefPath = $path.join(sourceDir, "ref.json");
    let targetRefPath = $path.join(sourceDir, "ref.json");
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
    copyFile($path.join(libDir, "env.js"), $path.join(targetRootDir, "env.js"));
    copyFile($path.join(libDir, "locked-api.js"), $path.join(targetRootDir, "locked-api.js"));
    copyFile($path.join(libDir, "test-locked-api.js"), $path.join(targetRootDir, "test-locked-api.js"));
};

let args = process.argv.slice();
args.splice(0, 2); // strip "node" and the name of this file

if (args[0] === "compile" || args[0] === "c") {
    let argParts = separateFlags(args.slice(1));
    let maps = argParts[0].indexOf("--map") !== -1;
    compile(argParts[1][0], argParts[1][1], maps);
}
else if (
    args[0] === "c-current" || args[0] === "cc" ||
    args[0] === "make-all" ||
    args[0] === "test" || args[0] === "t" ||
) {
    // Make sure these development tools commands can't be used in an installed package.
    // Installed package doesn't have "test-locked-api.js".
    assert($fs.existsSync($path.join(libDir, "test-locked-api.js")));

    let version = packageInfo.version;
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
                $path.join(targetVersionDir, "test-main.js")
            ]
        ));
    }
}
else if (args[0] === "version" || args[0] === "v" || args[0] === "--version") {
    console.log(packageInfo.version);
}
else if (args[0] === "--help") {
    console.log(
        "Please visit \"https://www.npmjs.com/package/futurescript\" to see how to use this\n" +
        "command."
    );
}
else if (args[0] === "postinstall") {
    makeAllVersions(defaultTargetRootDir);
}
else {
    throw new Error("Invalid command arguments.");
}
