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

let build = isRelease => {
    rm.sync("target");
    process.stdout.write($cp.execFileSync(
        process.execPath,
        [
            "node_modules/babel-cli/bin/babel.js",
            "--plugins",
            "transform-es2015-modules-commonjs,transform-es2015-destructuring,transform-es2015-parameters",
            "-d",
            "target",
            "lib"
        ]
    ));
    $fs.readdirSync("lib").filter(m => m.startsWith("c-v")).forEach(item => {
        mkdir($path.join("target", item)); // in case the dir doesn't exist because of no change

        // TODO: "Compile then delete" is ugly and expensive.
        if (isRelease) {
            rm.sync($path.join("target", item, "test-*"));
        }

        let sourcePath = $path.join("lib", item, "ref.json");
        let refList = JSON.parse($fs.readFileSync(sourcePath, {encoding: "utf8"}))
        .filter(m => "c-v" + m[0] === item).map(m => m[1]);
        let versionPath = $path.join("lib", item);
        $fs.readdirSync(versionPath).filter(m => m !== "ref.json").forEach(m => {
            assert(refList.indexOf(m) !== -1);
        });
        let destPath = $path.join("target", item, "ref.json");
        copyFile(sourcePath, destPath);
    });
};

let makeSingleVersion = (version, targetDir) => {
    let dirname = "c-v" + version;
    let sourceDir = $path.join(libDir, dirname);
    if (!$fs.statSync(sourceDir).isDirectory()) return;
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

let makeAllVersions = targetDir => {
    $fs.readdirSync(libDir).filter(m => m.startsWith("c-v")).forEach(dirname => {
        makeSingleVersion(dirname.match(/^c-v(.+)$/)[1], $path.join(targetDir, dirname));
    });
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
    args[0] === "fill" ||
    args[0] === "test" || args[0] === "t" ||
) {
    // Make sure these development tools commands can't be used in an installed package.
    // Installed package doesn't have "test-locked-api.js".
    assert($fs.existsSync($path.join(libDir, "test-locked-api.js")));

    let version = packageInfo.version;
    if (args[0] === "c-current" || args[0] === "cc") {
        rm.sync("c-current");
        mkdir("c-current");
        let versionPath = "lib/c-v" + version;
        let refPath = $path.join(versionPath, "ref.json");
        let refList = JSON.parse($fs.readFileSync(refPath, {encoding: "utf8"}));
        refList.forEach(item => {
            let sourcePath = $path.join("../lib/c-v" + item[0], item[1]);
            let destPath = $path.join("c-current", item[1]);
            $fs.symlinkSync(sourcePath, destPath);
        });
    }
    else if (args[0] === "fill") {
        rm.sync(defaultTargetRootDir);
        makeAllVersions(defaultTargetRootDir);
    }
    else if (args[0] === "test" || args[0] === "t") {
        rm.sync(defaultTargetRootDir);
        makeSingleVersion(version, $path.join(defaultTargetRootDir, "c-v" + version));
        process.stdout.write($cp.execFileSync(
            process.execPath,
            [
                "target/c-v" + version + "/test-main.js"
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
