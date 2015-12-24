(function() {
    // "China" things. There are still some old browsers, particularly in China.
    // So if it's IE 6-8 and language is Chinese, then show an alert.
    if (
        typeof navigator.userAgent === "string" &&
        navigator.userAgent.search(/[^a-zA-Z0-9]MSIE (6|7|8)\.0[^a-zA-Z0-9]/) !== -1 && (
            (
                typeof navigator.browserLanguage === "string" &&
                navigator.browserLanguage.search(/^zh(-.*)?$/) !== -1
            ) ||
            (
                typeof navigator.userLanguage === "string" &&
                navigator.userLanguage.search(/^zh(-.*)?$/) !== -1
            )
        )
    ) {
        alert("对不起，该网站不兼容老旧的浏览器内核（IE 6-8），请换一个新点儿的浏览器内核试试。");
    }
    // equivalent to ES6 `Array.from`
    var arrayFrom = function(arrayLike) {
        var len = arrayLike.length;
        var r = [];
        for (var i = 0; i < len; i++) {
            r.push(arrayLike[i]);
        }
        return r;
    };
    window.setLang = function(newLang, langs) {
        langs.forEach(function(lang) {
            if (lang !== newLang) {
                arrayFrom(document.getElementsByClassName(lang)).forEach(function(element) {
                    var parentChildren = arrayFrom(element.parentElement.children);
                    if (
                        element.parentElement.getElementsByClassName(newLang).length > 0 ||
                        parentChildren.indexOf(element) > 0
                    ) {
                        element.style.display = "none";
                    }
                });
            }
        });
        arrayFrom(document.getElementsByClassName(newLang)).forEach(function(element) {
            element.style.display = "";
        });
    };
    document.addEventListener("DOMContentLoaded", function() {
        arrayFrom(document.getElementsByTagName("pre")).forEach(function(pre) {
            arrayFrom(pre.childNodes).forEach(function(node) {
                var lines = node.textContent.split(/\r?\n/);
                lines = lines.filter(function(line, index) {
                    if ((index === 0 || index === lines.length - 1) && line.trim() === "") {
                        return false;
                    } else {
                        return true;
                    }
                });
                var minStartPosition = lines.length === 0 ? 0 : Math.min.apply(
                    Math,
                    lines.map(function(line) {
                        var pos = line.search(/\S/);
                        if (pos === -1) {
                            pos = 200;
                        }
                        return pos;
                    })
                );
                var text = lines.map(function(line) {
                    return line.substr(minStartPosition);
                }).join("\n");
                if (text === "") {
                    pre.removeChild(node);
                } else {
                    node.textContent = text;
                }
            });
        });
    });
}).call(this);
