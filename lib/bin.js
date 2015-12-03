import assert from "assert";
import $path from "path";
import $esprima from "esprima";
import * as $lockedApi from "./locked-api.js";

// Seems JSON should not be loaded via `import` keyword, though Babel supports it.
let packageInfo = require("../package.json");

let latestVersion = packageInfo.version;

let args = process.argv.slice();
args.splice(0, 2); // strip "node" and the name of this file

if (args[0] === "-l") {
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
    read("c-v" + latestVersion + ".js", "lib");
    read("c-v" + latestVersion + ".js", "test");
    read("c.js", "lib");
    read("c.js", "test");
    read("bin.js", "lib");
    let pathsArr = Object.keys(paths).sort();
    pathsArr.forEach(path => {
        console.log(path);
    });
}
