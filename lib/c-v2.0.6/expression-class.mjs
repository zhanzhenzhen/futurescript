import * as $lex from "./lex.mjs";
import * as $node from "./node.mjs";
import * as $base from "./expression-base.mjs";
import * as $pattern from "./pattern.mjs";
import * as $print from "./print.mjs";
import {JsBuilder as J} from "./js-builder.mjs";

export class ClassExpression extends $base.Expression {
    constructor(superClass, body) {
        super();
        this.superClass = superClass;
        this.body = body;
        this._symbolMembers = Object.create(null);
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
            let colonPos = $pattern.Pattern.searchOne(
                $lex.Colon,
                lex.part(m),
                true
            );
            let key = {startIndex: m.startIndex, endIndex: colonPos - 1};
            let value = {startIndex: colonPos + 1, endIndex: m.endIndex};

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

                if (startIndex <= endIndex) {
                    let firstToken = lex.at(startIndex);
                    if (firstToken instanceof $lex.NormalToken) {
                        if (firstToken.value.startsWith("_")) {
                            name = new $node.SymbolMemberName(lex.part(startIndex, endIndex));
                        }
                        else {
                            name = new $node.Piece(lex.part(startIndex, endIndex));
                        }
                    }
                    else {
                        name = this.build(lex.part(startIndex, endIndex));
                    }
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

    bareCompile() {
        let classVar = "class_" + $node.antiConflictString;
        let treeStaticConstructor = null;
        let treeFunctionMembers = [];
        let treeOtherMembers = [];
        this.body.value.forEach(m => {
            if (m.x.static && m.x.name === null) {
                treeStaticConstructor = m;
            }
            else if (
                m.y instanceof $node.ArrowFunctionExpression ||
                m.y instanceof $node.DiamondFunctionExpression ||
                m.y instanceof $node.DashFunctionExpression
            ) {
                treeFunctionMembers.push(m);
            }
            else {
                treeOtherMembers.push(m);
            }
        });

        // ES6 requires setter have exactly one parameter. So we must provide
        // a parameter even if it's useless.
        let nonsenseParam = "nonsenseParam_" + $node.antiConflictString;

        let inner = new J(treeFunctionMembers.map(m => {
            let variables =
                m.y instanceof $node.ArrowFunctionExpression ?
                new J(m.y.arguments.value.map((n, index) =>
                    new J([
                        m.y.argumentsHasSpread && index === m.y.arguments.value.length - 1 ?
                        "..." :
                        "",
                        n.variable.compile()
                    ])
                ), ",") :
                (m.x.set ? nonsenseParam : "");
            return new J([
                (m.x.static ? "static " : "") +
                (m.x.get ? "get " : "") +
                (m.x.set ? "set " : ""),
                (m.x.new ? "constructor" : (
                    (
                        m.x.name instanceof $node.Expression ||
                        m.x.name instanceof $node.SymbolMemberName
                    ) ?
                    new J(["[", m.x.name.compile(), "]"]) :
                    m.x.name.compile()
                )),
                "(", variables, "){" +
                (m.x.new ? "" : "return "),
                m.y.compile(), "(", variables, ");}"
            ]);
        }));
        let ext = this.superClass === null ? "" : new J(["extends ", this.superClass.compile()]);
        let part1 = this.getSymbolMemberNames().map(m => "var " + m + "=Symbol();").join("");
        let part2 = new J(["var " + classVar + "=class ", ext, "{", inner, "};"]);
        let part3 = new J(treeOtherMembers.map(m => new J([
            classVar + (m.x.static ? "" : ".prototype"),
            (
                (
                    m.x.name instanceof $node.Expression ||
                    m.x.name instanceof $node.SymbolMemberName
                ) ?
                new J(["[", m.x.name.compile(), "]"]) :
                new J([".", m.x.name.compile()])
            ),
            "=",
            m.y.compile(),
            ";"
        ])));
        let part4 =
            treeStaticConstructor === null ?
            "" :
            new J([treeStaticConstructor.y.compile(), ".call(" + classVar + ");"]);
        return $node.compileWrapperFunction(
            new J([part1, part2, part3, part4, "return " + classVar + ";"]),
            this
        );
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

    renameSymbolMember(oldName, newName) {
        this._symbolMembers[newName] = this._symbolMembers[oldName];
        delete this._symbolMembers[oldName];
    }
}
