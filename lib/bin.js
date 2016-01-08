// For now, this file can't use ES6 features that's only in Babel, because it should be
// able to run without transform.

"use strict";

let assert = require("assert");
let $path = require("path");
let $cp = require("child_process");
let $fs = require("fs");
let $esprima = require("esprima");
let rm = require("rimraf");
let $babel = require("babel-core");

let packageInfo = require("../package.json");

let Shim = {
    no: 0,
    node: 1,
    heavy: 2
};

let mkdir = name => {
    if (!$fs.existsSync(name)) {
        $fs.mkdirSync(name);
    }
};

let copyFile = (source, dest) => {
    $fs.writeFileSync(dest, $fs.readFileSync(source));
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

// `arg1` is source. The optional `arg2` is destination.
let compile = (arg1, arg2, maps, shim) => {
    let $lockedApi = require("./locked-api.js");
    let level = maps ? $lockedApi.OutputLevel.sourceMap : $lockedApi.OutputLevel.compile;
    let readability = maps ? 1 : 0;
    let generateOutput = (input) => {
        try {
            return $lockedApi.generateOutput(input);
        }
        catch (ex) {
            if (ex instanceof $lockedApi.SyntaxError) {
                console.log("Syntax error:");
                if (input.path !== undefined) {
                    console.log(input.path);
                }
                console.log(ex.message);
                process.exit(1);
            }
            else {
                throw ex;
            }
        }
    };
    let write = (targetPath, target) => {
        let code = null;
        if (shim === Shim.no) {
            code = target.code;
        }
        else if (shim === Shim.node) {
            let babelOutput = $babel.transform(target.code, {
                plugins: [
                    "transform-es2015-modules-commonjs",
                    "transform-es2015-destructuring",
                    "transform-es2015-parameters"
                ]
            });
            code = babelOutput.code;
        }
        else {
            let babelOutput = $babel.transform(target.code, {presets: ["es2015"]});
            code = babelOutput.code;
        }
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

let build = (isRelease) => {
    rm.sync("target");
    process.stdout.write($cp.execFileSync(
        process.execPath,
        [
            "node_modules/babel-cli/bin/babel.js",
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
        let destPath = $path.join("target", item, "ref.json");
        copyFile(sourcePath, destPath);
    });
};

let fillRef = (isPostinstall) => {
    let targetDir = null;

    if (isPostinstall) {
        let moduleDirName = $path.dirname(module.filename);
        targetDir = $path.join(moduleDirName, "../target");
    }
    else {
        targetDir = "target";
    }

    $fs.readdirSync(targetDir).filter(m => m.startsWith("c-v")).forEach(item => {
        let path = $path.join(targetDir, item);
        if (!$fs.statSync(path).isDirectory()) return;
        let refPath = $path.join(path, "ref.json");
        let refList = JSON.parse($fs.readFileSync(refPath, {encoding: "utf8"}));
        refList.forEach(item => {
            if (isPostinstall && item[1].startsWith("test-")) return;
            let sourcePath = $path.join(targetDir, "c-v" + item[0], item[1]);
            let destPath = $path.join(path, item[1]);
            assert(!$fs.existsSync(destPath));
            copyFile(sourcePath, destPath);
        });
    });
};

let args = process.argv.slice();
args.splice(0, 2); // strip "node" and the name of this file

if (args[0] === "compile" || args[0] === "c") {
    let argParts = separateFlags(args.slice(1));
    let shim = Shim.node;
    if (argParts[0].indexOf("--no-shim") !== -1) {
        shim = Shim.no;
    }
    else if (argParts[0].indexOf("--heavy-shim") !== -1) {
        shim = Shim.heavy;
    }
    let maps = argParts[0].indexOf("--map") !== -1;
    compile(argParts[1][0], argParts[1][1], maps, shim);
}
else if (
    args[0] === "build" ||
    args[0] === "build-release" ||
    args[0] === "fill" ||
    args[0] === "build-fill" || args[0] === "bf" ||
    args[0] === "test" || args[0] === "t" ||
    args[0] === "build-test" || args[0] === "bt"
) {
    let moduleDirName = $path.dirname(module.filename);
    let libDir = $path.join(moduleDirName, "../lib");
    assert($fs.existsSync(libDir)); // so the installed `fus` command can't be used to build, test, etc.

    assert($fs.existsSync("lib"));

    let cwdPackageInfo = require($path.join(process.cwd(), "package.json"));
    assert(cwdPackageInfo.name === "futurescript");

    let cwdVersion = cwdPackageInfo.version;
    if (args[0] === "build") {
        build(false);
    }
    else if (args[0] === "build-release") {
        build(true);
    }
    else if (args[0] === "fill") {
        fillRef(false);
    }
    else if (args[0] === "build-fill" || args[0] === "bf") {
        build(false);
        fillRef(false);
    }
    else if (args[0] === "build-test" || args[0] === "bt") {
        build(false);
        fillRef(false);
        process.stdout.write($cp.execFileSync(
            process.execPath,
            [
                "target/c-v" + cwdVersion + "/test-main.js"
            ]
        ));
    }
    else if (args[0] === "test" || args[0] === "t") {
        process.stdout.write($cp.execFileSync(
            process.execPath,
            [
                "target/c-v" + cwdVersion + "/test-main.js"
            ]
        ));
    }
}
else if (args[0] === "version" || args[0] === "v" || args[0] === "--version") {
    console.log(packageInfo.version);
}
else if (args[0] === "postinstall") {
    fillRef(true);
}
else {
    throw new Error("Invalid command arguments.");
}
