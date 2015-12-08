import assert from "assert";
import $path from "path";
import $cp from "child_process";
import $fs from "fs";
import $esprima from "esprima";
import * as $babel from "babel";
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

// `arg1` is source. The optional `arg2` is destination. `maps` is also optional
// defaulting to false.
let compile = (arg1, arg2, maps = false) => {
    let level = maps ? $lockedApi.OutputLevel.sourceMap : $lockedApi.OutputLevel.compile;
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
        if (maps) {
            let inSourceMap = JSON.parse(target.sourceMap);
            inSourceMap.file = "unknown"; // in Babel, input sourcemap must have `file`
            let babelOutput = $babel.transform(target.code, {
                inputSourceMap: inSourceMap
            });

            // Delete the Babel-generated useless `file` and `sourcesContent`.
            delete babelOutput.map.file;
            delete babelOutput.map.sourcesContent;

            let mapPath = targetPath + ".map";
            let code = babelOutput.code + "\n//# sourceMappingURL=" + $path.basename(mapPath);
            $fs.writeFileSync(targetPath, code);
            $fs.writeFileSync(mapPath, JSON.stringify(babelOutput.map));
        }
        else {
            let babelOutput = $babel.transform(target.code);
            $fs.writeFileSync(targetPath, babelOutput.code);
        }
    };
    let stat = $fs.statSync(arg1);
    if (stat.isDirectory()) {
        if (arg2 === undefined) {
            $fs.readdirSync(arg1).forEach(item => {
                let path = $path.join(arg1, item);
                if (!$fs.statSync(path).isFile()) return;
                if ($path.extname(path) === ".lemo") {
                    let output = generateOutput({path: path, level: level});
                    let filename = $path.basename(path, ".lemo") + ".js";
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
                if ($path.extname(path) === ".lemo") {
                    let output = generateOutput({path: path, level: level});
                    let filename = $path.basename(path, ".lemo") + ".js";
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
        let output = generateOutput({path: arg1, level: level});
        let targetPath = arg2;
        if (targetPath === undefined) {
            let filename = $path.basename(arg1, ".lemo") + ".js";
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
    compile(args[1], args[2]);
}
else if (args[0] === "map-compile" || args[0] === "m") {
    compile(args[1], args[2], true);
}
else if (
    args[0] === "list" || args[0] === "l" ||
    args[0] === "build" || args[0] === "b" ||
    args[0] === "test" || args[0] === "t"
) {
    assert($fs.existsSync("lib"));
    assert($fs.existsSync("test"));
    let cwdPackageInfo = require($path.join(process.cwd(), "package.json"));
    assert(cwdPackageInfo.name === "lemo");
    let cwdVersion = cwdPackageInfo.version;
    if (args[0] === "list" || args[0] === "l") {
        let paths = {};
        let read = (filename, workingDir) => {
            assert(filename.search(/[^0-9A-Za-z.+-]|\.\./) === -1);
            assert(!filename.startsWith("."));
            assert(!filename.endsWith("."));
            let path = $path.join(workingDir, filename);
            if (paths[path]) return; // avoid cyclic problem
            paths[path] = true;
            let code = $lockedApi.readTextFile(path);
            let tree = $esprima.parse(code, {sourceType: "module"});
            tree.body.filter(m =>
                m.type === "ImportDeclaration" &&
                m.source.type === "Literal" && m.source.value.startsWith("./")
            ).forEach(statement => {
                read(statement.source.value.substr(2), workingDir);
            });
        };
        read("c-v" + cwdVersion + ".js", "lib");
        read("c-v" + cwdVersion + ".js", "test");
        read("bin.js", "lib");
        let pathsArr = Object.keys(paths).sort();
        pathsArr.forEach(path => {
            console.log(path);
        });
    }
    else if (args[0] === "build" || args[0] === "b") {
        let moduleDirName = $path.dirname(module.filename);
        process.stdout.write($cp.execFileSync(
            process.execPath,
            [
                $path.join(moduleDirName, "../node_modules/babel/bin/babel.js"),
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
                $path.join(moduleDirName, "../node_modules/babel/bin/babel-node.js"),
                "test/c-v" + cwdVersion + ".js"
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
