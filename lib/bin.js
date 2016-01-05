import assert from "assert";
import $path from "path";
import $cp from "child_process";
import $fs from "fs";
import $esprima from "esprima";
import * as $babel from "babel-core";
import * as $lockedApi from "./locked-api.js";

// Seems JSON should not be loaded via `import` keyword, though Babel supports it.
let packageInfo = require("../package.json");

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

// `arg1` is source. The optional `arg2` is destination. `maps` and `noShim` are also optional
// defaulting to false.
let compile = (arg1, arg2, maps = false, noShim = false) => {
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
        if (noShim) {
            code = target.code;
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

let args = process.argv.slice();
args.splice(0, 2); // strip "node" and the name of this file

if (args[0] === "compile" || args[0] === "c") {
    argParts = separateFlags(args);
    let noShim = argParts[0].indexOf("--no-shim") !== -1;
    let maps = argParts[0].indexOf("--map") !== -1;
    compile(argParts[1][0], argParts[1][1], maps, noShim);
}
else if (
    args[0] === "list" || args[0] === "l" ||
    args[0] === "build" || args[0] === "b" ||
    args[0] === "test" || args[0] === "t"
) {
    assert($fs.existsSync("lib"));
    assert($fs.existsSync("test"));
    let cwdPackageInfo = require($path.join(process.cwd(), "package.json"));
    assert(cwdPackageInfo.name === "futurescript");
    let cwdVersion = cwdPackageInfo.version;
    if (args[0] === "list" || args[0] === "l") {
        let paths = {};
        let read = (path) => {
            path = $path.resolve(path);
            if (paths[path]) return; // avoid cyclic problem
            paths[path] = true;
            let dir = $path.dirname(path);
            let code = $lockedApi.readTextFile(path);
            let tree = $esprima.parse(code, {sourceType: "module"});
            tree.body.filter(m =>
                (
                    m.type === "ImportDeclaration" ||
                    m.type === "ExportAllDeclaration" ||
                    m.type === "ExportNamedDeclaration"
                ) &&
                m.source !== null &&
                m.source.type === "Literal" &&
                (
                    m.source.value.startsWith("./") ||
                    m.source.value.startsWith("../")
                )
            ).forEach(statement => {
                read($path.join(dir, statement.source.value));
            });
        };
        read("lib/c-v" + cwdVersion + "/main.js");
        read("test/c-v" + cwdVersion + "/main.js");
        read("lib/bin.js");
        let pathsArr = Object.keys(paths).sort();
        pathsArr.forEach(path => {
            console.log($path.relative(process.cwd(), path));
        });
    }
    else if (args[0] === "build" || args[0] === "b") {
        let moduleDirName = $path.dirname(module.filename);
        process.stdout.write($cp.execFileSync(
            process.execPath,
            [
                $path.join(moduleDirName, "../node_modules/babel-cli/bin/babel.js"),
                "-d",
                "target",
                "lib"
            ]
        ));
    }
    else {
        let moduleDirName = $path.dirname(module.filename);
        process.stdout.write($cp.execFileSync(
            process.execPath,
            [
                $path.join(moduleDirName, "../node_modules/babel-cli/bin/babel-node.js"),
                "test/c-v" + cwdVersion + "/main.js"
            ]
        ));
    }
}
else if (args[0] === "version" || args[0] === "v" || args[0] === "--version") {
    console.log(packageInfo.version);
}
else {
    throw new Error("Invalid command arguments.");
}
