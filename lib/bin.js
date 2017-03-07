// For now, this file can't use ES6 features that's only in Babel, because it should be
// able to run without transform.

"use strict";

let assert = require("assert");
let $path = require("path").posix;
let $cp = require("child_process");
let $fs = require("fs");

let packageInfo = require("../package.json");

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

let build = ({isRelease = false, includesEs5 = false, validate = false, watch = false, filters = []}) => {
    console.log('build:', isRelease ? 'release' : '', includesEs5 ? 'es5' : '', filters.length ? filters : '')

    let rm = require("rimraf");
    rm.sync("target");

    let src = "lib" // + '/*' + filters.join('|')
    let dest = "target"

    let flags = []
    if (watch) {
        flags.push('--watch')
    }
    flags = flags.concat("--plugins", "transform-es2015-modules-commonjs,transform-es2015-destructuring,transform-es2015-parameters")

    let buildCmd = [
        "node_modules/babel-cli/bin/babel.js",
        src
    ].concat(flags).concat([
        "-d",
        dest
    ])


    console.log(buildCmd)

    process.stdout.write($cp.execFileSync(
        process.execPath,
        buildCmd
    ));

    function assertVersion(item) {
        let version = item.substring(3);
        if (filters && !filters.includes(version)) {
            console.log('skip assert', version);
            return;
        }

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
            console.log('assert', refList, m);
            assert(refList.indexOf(m) !== -1);
        });

        let destPath = $path.join("target", item, "ref.json");
        copyFile(sourcePath, destPath);
    }

    if (validate) {
        $fs.readdirSync("lib").filter(m => m.startsWith("c-v")).forEach(item => {
            assertVersion(item);
        });
    }

    if (includesEs5) {
        // ES5 target can only be built using Babel 5.x, because Babel 6 has bugs in class plug-in.
        rm.sync("es5-target");
        process.stdout.write($cp.execFileSync(
            process.execPath,
            [
                "node_modules/babel/bin/babel.js",
                "-d",
                "es5-target",
                "target"
            ]
        ));

        function compileVersionES5(item) {
            let version = item.substring(2);
            if (filters && !filters.includes(version)) return;

            mkdir($path.join("es5-target", item)); // in case the dir doesn't exist because of no change

            let sourcePath = $path.join("target", item, "ref.json");
            let destPath = $path.join("es5-target", item, "ref.json");
            copyFile(sourcePath, destPath);
        }


        $fs.readdirSync("target").filter(m => m.startsWith("c-v")).forEach(item => {
            compileVersionES5(item);
        });
    }
};

let fillRef = ({isPostinstall = false, includesEs5 = false, filters = []}) => {

    function fillRefDir(dirname) {
        let version = item.substring(3);
        if (filters && !filters.includes(version)) {
            console.log('skip fillRef', version);
            return;
        }

        let path = $path.join(targetDir, dirname);
        if (!$fs.statSync(path).isDirectory()) return;
        let refPath = $path.join(path, "ref.json");
        let refList = JSON.parse($fs.readFileSync(refPath, {encoding: "utf8"}));
        refList.forEach(item => {
            if (isPostinstall && item[1].startsWith("test-")) return;
            let sourcePath = $path.join(targetDir, "c-v" + item[0], item[1]);
            let destPath = $path.join(path, item[1]);
            if ("c-v" + item[0] !== dirname) {
                assert(!$fs.existsSync(destPath));
                copyFile(sourcePath, destPath);
            }
        });
    }


    let fill = targetDir => {
        $fs.readdirSync(targetDir).filter(m => m.startsWith("c-v")).forEach(dirname => {
            fillRefDir(dirname);
        });
    };

    if (isPostinstall) {
        let moduleDirName = $path.dirname(slashPath(module.filename));
        fill($path.join(moduleDirName, "../target"));
        if (includesEs5) {
            fill($path.join(moduleDirName, "../es5-target"));
        }
    }
    else {
        fill("target");
        if (includesEs5) {
            fill("es5-target");
        }
    }
};

let args = process.argv.slice();
args.splice(0, 2); // strip "node" and the name of this file

// Trying to get filters part
// This will allow us to only compile or build a single version, to make for faster tests etc.
let argParts = separateFlags(args.slice(1));
console.log('argParts', argParts)

let filters = [];
let watch = false;

if (argParts[1]) {
    argParts[1].forEach(item => {
        if (!item) return;
        let filtersIndx = item.indexOf('--filters');
        if (filtersIndx >= 0) {
            filters = item.substring(filtersIndx + '--filters:'.length).split(/\s+:\s+/);
        }
    })

     argParts[1].forEach(item => {
        if (!item) return;
        if (item.indexOf("--watch") !== -1) {
            watch = true;
        }
    })
}

if (filters.length) {
    console.log('processing:', filters.join(', '))
}

if (args[0] === "compile" || args[0] === "c") {
    let argParts = separateFlags(args.slice(1));
    let maps = false;

     argParts[1].forEach(item => {
        if (!item) return;
        if (item.indexOf("--map") !== -1) {
            maps = true;
        }
    })

    if (maps) {
        console.log('create source map');
    }

    compile(argParts[1][0], argParts[1][1], maps);
}
else if (
    args[0] === "c-current" || args[0] === "cc" ||
    args[0] === "build" ||
    args[0] === "build-release" ||
    args[0] === "fill" ||
    args[0] === "build-fill" || args[0] === "bf" ||
    args[0] === "test" || args[0] === "t" ||
    args[0] === "build-test" || args[0] === "bt" ||
    args[0] === "build-test-including-es5" || args[0] === "bt5"
) {

    let validate = false;

     argParts[1].forEach(item => {
        if (!item) return;
        if (item.indexOf("--check") !== -1) {
            validate = true;
        }
    })


    let moduleDirName = $path.dirname(slashPath(module.filename));
    let libDir = $path.join(moduleDirName, "../lib");
    assert($fs.existsSync(libDir)); // so the installed `fus` command can't be used to build, test, etc.

    assert($fs.existsSync("lib"));

    let cwdPackageInfo = require($path.join(slashPath(process.cwd()), "package.json"));
    assert(cwdPackageInfo.name === "futurescript");

    let buildOpts = { filters, watch, validate }
    let fillOpts = { filters }

    let cwdVersion = cwdPackageInfo.version;
    if (args[0] === "c-current" || args[0] === "cc") {
        let rm = require("rimraf");
        rm.sync("c-current");
        mkdir("c-current");
        let versionPath = "lib/c-v" + cwdVersion;
        let refPath = $path.join(versionPath, "ref.json");
        let refList = JSON.parse($fs.readFileSync(refPath, {encoding: "utf8"}));
        refList.forEach(item => {
            let sourcePath = $path.join("../lib/c-v" + item[0], item[1]);
            let destPath = $path.join("c-current", item[1]);
            $fs.symlinkSync(sourcePath, destPath);
        });
    }
    else if (args[0] === "build") {
        build(buildOpts);
    }
    else if (args[0] === "build-release") {
        build({isRelease: true, filters, watch});
    }
    else if (args[0] === "fill") {
        fillRef(fillOpts);
    }
    else if (args[0] === "build-fill" || args[0] === "bf") {
        build(buildOpts);
        fillRef(fillOpts);
    }
    else if (args[0] === "build-test" || args[0] === "bt") {
        build(buildOpts);
        fillRef(fillOpts);
        process.stdout.write($cp.execFileSync(
            process.execPath,
            [
                "target/c-v" + cwdVersion + "/test-main.js"
            ]
        ));
    }
    else if (args[0] === "build-test-including-es5" || args[0] === "bt5") {
        build({includesEs5: true, filters, watch});
        fillRef({includesEs5: true, filters});
        process.stdout.write($cp.execFileSync(
            process.execPath,
            [
                "target/c-v" + cwdVersion + "/test-main.js"
            ]
        ));
        process.stdout.write($cp.execFileSync(
            process.execPath,
            [
                "es5-target/c-v" + cwdVersion + "/test-main.js"
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
else if (args[0] === "--help") {
    console.log(
        "Please visit \"https://www.npmjs.com/package/futurescript\" to see how to use this\n" +
        "command."
    );
}
else if (args[0] === "postinstall") {
    fillRef({isPostinstall: true, filters, watch });
}
else {
    throw new Error("Invalid command arguments.");
}
