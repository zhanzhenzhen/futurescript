import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $block from "./c-block-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import * as $statement from "./c-statement-0.js";
import * as $expressionBase from "./c-expression-base-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

export class ClassExpression extends $expressionBase.Expression {
    constructor(superClass, body) {
        super();
        this.superClass = superClass;
        this.body = body;
    }

    static patternsAndCaptures() {
        return [
            [[$lex.Class, $pattern.ChevronPair], [null, 1]],
            [[$lex.Class], [null, null]],
            [[$lex.Class, (token => token instanceof $lex.NormalToken && token.value === "from"),
                $pattern.tokens, $pattern.ChevronPair], [2, 3]],
            [[$lex.Class, (token => token instanceof $lex.NormalToken && token.value === "from"),
                $pattern.tokensExcept([$lex.LeftChevron])], [2, null]]
        ];
    }

    static applyMatch(match, lex) {
        let memberRanges = match[1] === null ? [] : $pattern.Pattern
        .split([$lex.Comma, $lex.Semicolon], lex.part(match[1]).shrink())
        .filter(m => m.endIndex >= m.startIndex);
        let body = new $node.Arr(memberRanges.map(m => {
            let nvRanges = $pattern.Pattern.split(
                $lex.Colon,
                lex.part(m)
            );
            let key = nvRanges[0];
            let value = nvRanges[1];

            let startIndex = key.startIndex;
            let endIndex = key.endIndex;
            let name = null;
            let newOn = false;
            let staticOn = false;
            let getOn = false;
            let setOn = false;

            if (
                lex.at(startIndex) instanceof $lex.NormalToken &&
                lex.at(startIndex).value === "new"
            ) {
                newOn = true;
            }
            else {
                if (
                    lex.at(startIndex) instanceof $lex.NormalToken &&
                    lex.at(startIndex).value === "static"
                ) {
                    staticOn = true;
                    startIndex++;
                }

                if (
                    lex.at(endIndex - 1) instanceof $lex.NormalVariant &&
                    lex.at(endIndex) instanceof $lex.NormalToken &&
                    lex.at(endIndex).value === "get"
                ) {
                    getOn = true;
                    endIndex -= 2;
                }
                else if (
                    lex.at(endIndex - 1) instanceof $lex.NormalVariant &&
                    lex.at(endIndex) instanceof $lex.NormalToken &&
                    lex.at(endIndex).value === "set"
                ) {
                    setOn = true;
                    endIndex -= 2;
                }

                if (startIndex === endIndex) {
                    name = new $node.Piece(lex.part(startIndex, endIndex));
                }
                else if (startIndex > endIndex) {
                }
                else {
                    throw new Error();
                }
            }

            return new $node.Xy(
                new $node.MemberKey({
                    name: name,
                    new: newOn,
                    static: staticOn,
                    get: getOn,
                    set: setOn
                }),
                this.build(lex.part(value))
            );
        }));
        return new this(
            this.build(lex.part(match[0])),
            body
        );
    }

    rawCompile() {
    }
}
