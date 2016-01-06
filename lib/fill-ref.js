import $fs from "fs";
import $path from "path";

let copyFile = (source, dest) => {
    $fs.writeFileSync(dest, $fs.readFileSync(source));
};

let moduleDirName = $path.dirname(module.filename);
let targetDir = $path.join(moduleDirName, "../target");

$fs.readdirSync(targetDir).filter(m => m.startsWith("c-v")).forEach(item => {
    let path = $path.join(targetDir, item);
    if (!$fs.statSync(path).isDirectory()) return;
    let refPath = $path.join(path, "ref.json");
    let refList = JSON.parse($fs.readFileSync(refPath, {encoding: "utf8"}));
    refList.forEach(item => {
        let sourcePath = $path.join(targetDir, "c-v" + item[0], item[1]);
        let destPath = $path.join(path, item[1]);
        copyFile(sourcePath, destPath);
    });
});
