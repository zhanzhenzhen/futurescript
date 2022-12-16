"use strict";

let $cp = require("child_process");
let $path = require("path").posix;

let args = process.argv.slice();
args.splice(0, 2); // strip "node" and the name of this file

let slashPath = p => typeof p === "string" ? p.replace(/\\/g, "/") : p;

let moduleDir = $path.dirname(slashPath(module.filename));
try {
    $cp.execFileSync(
        process.execPath,
        [
            $path.join(moduleDir, "dev.mjs"),
            ...args
        ],
        {stdio: "inherit"}
    );
}
catch (ex) {
    process.exit(ex.status);
}
