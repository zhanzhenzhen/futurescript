"use strict";

let $cp = require("child_process");
let $path = require("path").posix;

let args = process.argv.slice();
args.splice(0, 2); // strip "node" and the name of this file

let moduleDir = $path.dirname(module.filename);
$cp.execFileSync(
    process.execPath,
    [
        "--experimental-modules",
        "--no-warnings",
        $path.join(moduleDir, "dev.mjs"),
        ...args
    ],
    {stdio: "inherit"}
);
