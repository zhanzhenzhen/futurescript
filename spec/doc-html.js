"use strict";

document.addEventListener("DOMContentLoaded", () => {
    Array.from(document.getElementsByTagName("pre")).forEach(pre => {
        Array.from(pre.childNodes).forEach(node => {
            let lines = node.textContent.split(/\r?\n/);
            lines = lines.filter((line, index) =>
                !((index === 0 || index === lines.length - 1) && line.trim() === "")
            );
            let minStartPosition = lines.length === 0 ? 0 : Math.min(
                ...lines.map(line => {
                    let pos = line.search(/\S/);
                    if (pos === -1) {
                        pos = 200;
                    }
                    return pos;
                })
            );
            let text = lines.map(m => m.substr(minStartPosition)).join("\n");
            if (text === "") {
                pre.removeChild(node);
            } else {
                node.textContent = text;
            }
        });
    });
});
