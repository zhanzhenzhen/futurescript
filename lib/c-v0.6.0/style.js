import * as $tools from "./tools.js";
import * as $lex from "./lex.js";

export let generateStyles = lex => {
    let r = [];
    for (let i = 0; i <= lex.count(); i++) {
        let token = lex.at(i);
        if (token.rawStartIndex !== undefined) {
            let style = tokenStyle(token);
            if (style !== 0) {
                let last = r[r.length - 1];
                if (r.length === 0 && token.rawStartIndex > 0) {
                    r.push([0, token.rawStartIndex - 1, 0]);
                }
                else if (r.length > 0 && token.rawStartIndex - last[1] >= 2) {
                    r.push([last[1] + 1, token.rawStartIndex - 1, 0]);
                }
                r.push([token.rawStartIndex, token.rawEndIndex, style]);
            }
        }
    }

    let last = r[r.length - 1];
    if (last === undefined) {
        if (lex.raw.length > 0) {
            r.push([0, lex.raw.length - 1, 0]);
        }
    }
    else if (last[1] < lex.raw.length - 1) {
        r.push([last[1] + 1, lex.raw.length - 1, 0]);
    }
    r = r.map(m => [m[0], m[2]]);

    let result = [];
    r.forEach(m => {
        let last = result[result.length - 1];
        if (last === undefined || m[0] !== last[0]) {
            result.push(m);
        }
    });
    return result;
};

let tokenStyle = token => {
    if ($tools.instanceof(token, [
        $lex.Above,
        $lex.And,
        $lex.As,
        $lex.Catch,
        $lex.Delete,
        $lex.Do,
        $lex.Else,
        $lex.Export,
        $lex.ExportAs,
        $lex.Finally,
        $lex.If,
        $lex.Ifnull,
        $lex.Ifvoid,
        $lex.Import,
        $lex.In,
        $lex.Is,
        $lex.Isnt,
        $lex.Match,
        $lex.Mod,
        $lex.New,
        $lex.Nonew,
        $lex.Not,
        $lex.NotIn,
        $lex.Or,
        $lex.Pause,
        $lex.Rem,
        $lex.Then,
        $lex.Throw,
        $lex.Try
    ])) {
        return 1;
    }
    else if ($tools.instanceof(token, [
        $lex.Str
    ])) {
        return 2;
    }
    else if ($tools.instanceof(token, [
        $lex.InlineComment,
        $lex.FormattedComment
    ])) {
        return 3;
    }
    else if ($tools.instanceof(token, [
        $lex.ArrowFunction,
        $lex.DiamondFunction,
        $lex.DashFunction,
        $lex.Class
    ])) {
        return 4;
    }
    else {
        return 0;
    }
};
