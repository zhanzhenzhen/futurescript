import assert from "assert";
import pathMod from "path";
let $path = pathMod.posix;
import $fs from "fs";

// For Windows compatibility. Convert path to Unix style.
let slashPath = function(path) {
    if (typeof path === "string") {
        return path.replace(/\\/g, "/");
    }
    else {
        return path;
    }
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
let compile = async (arg1, arg2, maps, isLegacy) => {
    arg1 = slashPath(arg1);
    arg2 = slashPath(arg2);
    let $lockedApi = await import("./locked-api.mjs"); // use dynamic to not load while not compiling
    let level = maps ? $lockedApi.OutputLevel.sourceMap : $lockedApi.OutputLevel.compile;
    let readability = maps ? 1 : 0;
    let generateOutput = async input => {
        try {
            return await $lockedApi.generateOutput(input);
        }
        catch (ex) {
            if (ex instanceof $lockedApi.SyntaxError) {
                console.error("Syntax error:");
                if (input.path !== undefined) {
                    console.error(input.path);
                }
                console.error(ex.message);
            }
            else {
                console.error("Unknown error");
                if (input.path !== undefined) {
                    console.error(input.path);
                }
            }
            process.exit(1);
        }
    };
    let write = (targetPath, target) => {
        let code = target.code;
        $fs.writeFileSync(targetPath, code);
    };
    let stat = $fs.statSync(arg1);
    if (stat.isDirectory()) {
        if (arg2 === undefined) {
            Promise.all($fs.readdirSync(arg1).map(async item => {
                let path = $path.join(arg1, item);
                if (!$fs.statSync(path).isFile()) return;
                if ($path.extname(path) === ".fus") {
                    let output = await generateOutput(
                        {path: path, level: level, outputCodeReadability: readability}
                    );
                    let filename = $path.basename(path, ".fus") + (isLegacy ? ".js" : ".mjs");
                    let targetPath = $path.join(arg1, filename);
                    write(targetPath, output.targets[0]);
                }
            }));
        }
        else {
            mkdir(arg2);
            Promise.all($fs.readdirSync(arg1).map(async item => {
                let path = $path.join(arg1, item);
                if (!$fs.statSync(path).isFile()) return;
                if ($path.extname(path) === ".fus") {
                    let output = await generateOutput(
                        {path: path, level: level, outputCodeReadability: readability}
                    );
                    let filename = $path.basename(path, ".fus") + (isLegacy ? ".js" : ".mjs");
                    let targetPath = $path.join(arg2, filename);
                    write(targetPath, output.targets[0]);
                }
                else {
                    let targetPath = $path.join(arg2, item);
                    copyFile(path, targetPath);
                }
            }));
        }
    }
    else if (stat.isFile()) {
        let output = await generateOutput(
            {path: arg1, level: level, outputCodeReadability: readability}
        );
        let targetPath = arg2;
        if (targetPath === undefined) {
            let filename = $path.basename(arg1, ".fus") + (isLegacy ? ".js" : ".mjs");
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

if (args[0] === "compile" || args[0] === "c" || args[0] === "legacy-compile" || args[0] === "lc") {
    let argParts = separateFlags(args.slice(1));
    let maps = argParts[0].indexOf("--map") !== -1;
    compile(argParts[1][0], argParts[1][1], maps, args[0] === "legacy-compile" || args[0] === "lc");
}
else if (args[0] === "version" || args[0] === "v" || args[0] === "--version") {
    console.log(JSON.parse(
        $fs.readFileSync(new URL("../package.json", import.meta.url), "utf8")
    ).version);
}
else if (args[0] === "--help") {
    console.log(
        "Please visit \"https://www.npmjs.com/package/futurescript\" to see how to use this\n" +
        "command."
    );
}
else {
    throw new Error("Invalid command arguments.");
}
