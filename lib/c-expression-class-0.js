import {hub} from "./c-expression-hub-0.js";
import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $block from "./c-block-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import * as $statement from "./c-statement-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

hub.ClassExpression = class extends hub.Expression {
    constructor(superClass, body) {
        super();
        this.superClass = superClass;
        this.body = body;
        this._symbolMembers = {};
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
                    if (lex.part(startIndex, endIndex).token().value.startsWith("_")) {
                        name = new $node.SymbolMemberName(lex.part(startIndex, endIndex));
                    }
                    else {
                        name = new $node.Piece(lex.part(startIndex, endIndex));
                    }
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
        let classVar = "class_" + $block.antiConflictString;
        let treeStaticConstructor = null;
        let treeFunctionMembers = [];
        let treeOtherMembers = [];
        this.body.value.forEach(m => {
            if (m.x.static && m.x.name === null) {
                treeStaticConstructor = m;
            }
            else if (
                m.y instanceof hub.ArrowFunctionExpression ||
                m.y instanceof hub.DiamondFunctionExpression ||
                m.y instanceof hub.DashFunctionExpression
            ) {
                treeFunctionMembers.push(m);
            }
            else {
                treeOtherMembers.push(m);
            }
        });
        let funName = "fun_" + $block.antiConflictString;
        let inner = new J(treeFunctionMembers.map(m => {
            let variables =
                m.y instanceof hub.ArrowFunctionExpression ?
                new J(m.y.arguments.value.map(m => m.variable.compile()), ",") :
                "";
            return new J([
                (m.x.static ? "static " : "") +
                (m.x.get ? "get " : "") +
                (m.x.set ? "set " : ""),
                (m.x.new ? "constructor" : m.x.name),
                "(", variables, "){var ", funName,
                ";(", funName, "=", m.y.compile() + ")(", variables, ");}"
            ]);
        }));
        let part1 = new J(["var " + classVar + "=class {", inner, "};"]);
        let part2 = new J(treeOtherMembers.map(m => new J([
            classVar + (m.x.static ? "" : ".prototype") + ".",
            m.x.name.compile(),
            "=",
            m.y.compile(),
            ";"
        ])));
        let part3 = new J([treeStaticConstructor.y.compile(), ".call(" + classVar + ");"]);
        return ["(()=>{", part1, part2, part3, "return " + classVar + ";})()"];
    }

    getSymbolMembers() {
        return this._symbolMembers;
    }

    getSymbolMemberNames() {
        return Object.keys(this._symbolMembers);
    }

    addSymbolMember(name) {
        if (!this.hasSymbolMember(name)) {
            this._symbolMembers[name] = {nodes: []};
        }
    }

    getSymbolMember(name) {
        return this._symbolMembers[name];
    }

    hasSymbolMember(name) {
        return this._symbolMembers[name] !== undefined;
    }

    addNodeToSymbolMember(node, symbolMemberName) {
        this.getSymbolMember(symbolMemberName).nodes.push(node);
    }

    removeSymbolMember(name) {
        delete this._symbolMembers[name];
    }
}
