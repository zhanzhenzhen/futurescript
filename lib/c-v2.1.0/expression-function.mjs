import * as $lex from "./lex.mjs";
import * as $node from "./node.mjs";
import * as $base from "./expression-base.mjs";
import * as $pattern from "./pattern.mjs";
import * as $print from "./print.mjs";
import {JsBuilder as J} from "./js-builder.mjs";

export class FunctionExpression extends $base.Expression {
    constructor() {
        super();
        this.setAsync(false);
        this.setFunRef(null);
    }

    setAsync(isAsync) {
        this._async = isAsync;
    }

    getAsync() {
        return this._async;
    }

    setFunRef(funRef) {
        this._funRef = funRef;
    }

    getFunRef() {
        return this._funRef;
    }
}

export class ArrowFunctionExpression extends FunctionExpression {
    // There can be real argument, or "pseudo" argument (that is,
    // something enclosed with `[...]`).
    // TODO: So the name "argument" is bad. We should restructure or think a better name.
    constructor(args, body, argsReal = true, argumentsHasSpread = false) {
        super();
        this.arguments = args;
        this.body = body;
        this.argumentsReal = argsReal;
        this.argumentsHasSpread = argumentsHasSpread;
    }

    static patternsAndCaptures() {
        return [
            [[$pattern.NormalParenthesisPair, $lex.ArrowFunction, $pattern.any], [0, 2]],
            [[$pattern.NormalBracketPair, $lex.ArrowFunction, $pattern.any], [0, 2]],
            [[$lex.NormalToken, $lex.ArrowFunction, $pattern.any], [0, 2]]
        ];
    }

    static applyMatch(match, lex) {
        let argumentsLexPart = null;
        let argumentsReal = null;
        let argumentsHasSpread = null;
        if (lex.at(match[0].startIndex) instanceof $lex.NormalLeftBracket) {
            argumentsLexPart = lex.part(match[0]).shrink();
            argumentsReal = false;
            argumentsHasSpread = false;
        }
        else if (lex.at(match[0].startIndex) instanceof $lex.NormalLeftParenthesis) {
            argumentsLexPart = lex.part(match[0]).shrink();
            argumentsReal = true;
            if (lex.at(match[0].endIndex - 1) instanceof $lex.Spread) {
                argumentsLexPart = argumentsLexPart.changeTo(
                    argumentsLexPart.startIndex, argumentsLexPart.endIndex - 1
                );
                argumentsHasSpread = true;
            }
            else {
                argumentsHasSpread = false;
            }
        }
        else {
            argumentsLexPart = lex.part(match[0]);
            argumentsReal = true;
            argumentsHasSpread = false;
        }
        argumentsLexPart.addStyle(16);
        let argumentRanges = $pattern.Pattern
        .split([$lex.Comma, $lex.Semicolon], argumentsLexPart)
        .filter(m => m.endIndex >= m.startIndex);
        return new this(
            new $node.Arr(argumentRanges.map(m => {
                if (lex.at(m.startIndex + 1) instanceof $lex.Ifvoid) {
                    return new $node.ArrowArgument({
                        variable: new $node.LocalVariable(lex.part(m)),
                        voidDefault: this.build(lex.part(m.startIndex + 3, m.endIndex)),
                        nullDefault: null
                    });
                }
                else if (lex.at(m.startIndex + 1) instanceof $lex.Colon) {
                    return new $node.ArrowArgument({
                        variable: new $node.LocalVariable(lex.part(m)),
                        voidDefault: this.build(lex.part(m.startIndex + 2, m.endIndex)),
                        nullDefault: null
                    });
                }
                else if (lex.at(m.startIndex + 1) instanceof $lex.Ifnull) {
                    return new $node.ArrowArgument({
                        variable: new $node.LocalVariable(lex.part(m)),
                        voidDefault: null,
                        nullDefault: this.build(lex.part(m.startIndex + 3, m.endIndex))
                    });
                }
                else {
                    return new $node.ArrowArgument({
                        variable: new $node.LocalVariable(lex.part(m)),
                        voidDefault: null,
                        nullDefault: null
                    });
                }
            })),
            $node.Statement.buildScopeBlock(lex.part(match[1])),
            argumentsReal,
            argumentsHasSpread
        );
    }

    bareCompile() {
        let args = this.arguments.value;
        let variables = new J(args.map((m, index) =>
            new J([this.argumentsHasSpread && index === args.length - 1 ? "..." : "", m.variable.compile()])
        ), ",");
        if (!this.argumentsReal) {
            variables = new J(["[", variables, "]"]);
        }
        let voidDefaults = new J(args.filter(m => m.voidDefault !== null).map(m =>
            new J([
                "if (",
                m.variable.compile(),
                "===undefined){",
                m.variable.compile(),
                "=",
                m.voidDefault.compile(),
                ";}"
            ])
        ));
        let nullDefaults = new J(args.filter(m => m.nullDefault !== null).map(m =>
            new J([
                "if (",
                m.variable.compile(),
                "===null){",
                m.variable.compile(),
                "=",
                m.nullDefault.compile(),
                ";}"
            ])
        ));
        let funRef = this.getFunRef();
        if (
            this.getParent() instanceof $node.Xy &&
            this.getParent().getParent() instanceof $node.Arr &&
            this.getParent().getParent().getParent() instanceof $node.ClassExpression
        ) {
            if (this.getParent().x.static && this.getParent().x.name === null) {
                return [
                    funRef === null ? "" : funRef + "=",
                    "function(", variables, "){",
                    voidDefaults, nullDefaults,
                    "return ", this.body.compile(), ";}"
                ];
            }
            else {
                return [
                    funRef === null ? "" : funRef + "=",
                    "(", variables, ")=>{",
                    voidDefaults, nullDefaults,
                    "return ", this.body.compile(), ";}"
                ];
            }
        }
        else {
            if (this.getParent($node.ClassExpression) === null) {
                return [
                    funRef === null ? "" : funRef + "=",
                    "function(", variables, "){",
                    voidDefaults, nullDefaults,
                    "return ", this.body.compile(), ";}"
                ];
            }
            else {
                return [
                    funRef === null ? "" : funRef + "=",
                    "(", variables, ")=>{",
                    voidDefaults, nullDefaults,
                    "return ", this.body.compile(), ";}"
                ];
            }
        }
    }
}

export class DiamondFunctionExpression extends FunctionExpression {
    constructor(body) {
        super();
        this.body = body;
    }

    static patternsAndCaptures() {
        return [
            [[$lex.DiamondFunction, $pattern.any], [1]]
        ];
    }

    static applyMatch(match, lex) {
        return new this(
            $node.Statement.buildScopeBlock(lex.part(match[0]))
        );
    }

    bareCompile() {
        let arg = "var arg_" + $node.antiConflictString + "=arguments;";
        let funRef = this.getFunRef();

        if (
            this.getParent() instanceof $node.Xy &&
            this.getParent().getParent() instanceof $node.Arr &&
            this.getParent().getParent().getParent() instanceof $node.ClassExpression
        ) {
            if (this.getParent().x.static && this.getParent().x.name === null) {
                return [
                    funRef === null ? "" : funRef + "=",
                    "function(){" + arg + "return ", this.body.compile(), ";}"
                ];
            }
            else {
                return [
                    funRef === null ? "" : funRef + "=",
                    "()=>{" + arg + "return ", this.body.compile(), ";}"
                ];
            }
        }
        else {
            if (this.getParent($node.ClassExpression) === null) {
                return [
                    funRef === null ? "" : funRef + "=",
                    "function(){" + arg + "return ", this.body.compile(), ";}"
                ];
            }
            else {
                return [
                    funRef === null ? "" : funRef + "=",
                    "()=>{" + arg + "return ", this.body.compile(), ";}"
                ];
            }
        }
    }
}

export class DashFunctionExpression extends FunctionExpression {
    constructor(body) {
        super();
        this.body = body;
    }

    static patternsAndCaptures() {
        return [
            [[$lex.DashFunction, $pattern.any], [1]]
        ];
    }

    static applyMatch(match, lex) {
        return new this(
            $node.Statement.buildScopeBlock(lex.part(match[0]))
        );
    }

    bareCompile() {
        if (
            this.getParent() instanceof $node.Xy &&
            this.getParent().getParent() instanceof $node.Arr &&
            this.getParent().getParent().getParent() instanceof $node.ClassExpression
        ) {
            if (this.getParent().x.static && this.getParent().x.name === null) {
                return ["function(){return ", this.body.compile(), ";}"];
            }
            else {
                return ["()=>{return ", this.body.compile(), ";}"];
            }
        }
        else {
            if (this.getParent($node.ClassExpression) === null) {
                return ["function(){return ", this.body.compile(), ";}"];
            }
            else {
                return ["()=>{return ", this.body.compile(), ";}"];
            }
        }
    }
}

export class ParenthesisCallExpression extends $base.Expression {
    constructor(callee, args, isNew = false, isNonew = false) {
        super();
        this.callee = callee;
        this.arguments = args;
        this.new = isNew;
        this.nonew = isNonew;
    }

    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, $pattern.CallParenthesisPair], [0, 1]]
        ];
    }

    static applyMatch(match, lex) {
        let isNew = false;
        let isNonew = false;
        let isPossibleNew = lex.at(match[0].startIndex) instanceof $lex.New;
        let isPossibleNonew = lex.at(match[0].startIndex) instanceof $lex.Nonew;
        if (isPossibleNew || isPossibleNonew) {
            let found = $pattern.Pattern.searchOne(
                [$lex.LeftParenthesis, $lex.LeftBracket, $lex.LeftBrace],
                lex.part(match[0].startIndex + 1, match[0].endIndex),
                true
            );
            if (found === null || found === match[0].startIndex + 1) {
                match[0].startIndex++;
                if (isPossibleNew) isNew = true;
                if (isPossibleNonew) isNonew = true;
            }
        }
        let argumentRanges = $pattern.Pattern
        .split([$lex.Comma, $lex.Semicolon], lex.part(match[1]).shrink())
        .filter(m => m.endIndex >= m.startIndex);
        return new this(
            this.build(lex.part(match[0])),
            new $node.Arr(argumentRanges.map(m =>
                this.build(lex.part(m))
            )),
            isNew,
            isNonew
        );
    }

    bareCompile() {
        let args = new J(this.arguments.value.map(m => m.compile()), ",");

        let root = this.getRoot();
        let useNew = null;
        if (root.hasCompilerDirective("manual new")) {
            if (this.new) {
                useNew = true;
            }
            else {
                useNew = false;
            }
        }
        else {
            if (this.new) {
                useNew = true;
            }
            else if (this.nonew) {
                useNew = false;
            }
            else if (this.callee instanceof $node.ClassMeExpression) {
                useNew = true;
            }
            else if (this.callee instanceof $node.VariableExpression) {
                if (
                    this.callee.value !== "Number" &&
                    this.callee.value !== "String" &&
                    this.callee.value !== "Boolean" &&
                    this.callee.value !== "Symbol" &&
                    this.callee.value[0] >= "A" && this.callee.value[0] <= "Z"
                ) {
                    useNew = true;
                }
                else {
                    useNew = false;
                }
            }
            else if (
                this.callee instanceof $node.DotExpression &&
                this.callee.y instanceof $node.Piece
            ) {
                if (this.callee.y.value[0] >= "A" && this.callee.y.value[0] <= "Z") {
                    useNew = true;
                }
                else {
                    useNew = false;
                }
            }
            else {
                useNew = false;
            }
        }

        if (this.callee instanceof $node.DotDotExpression) {
            this.getRoot().predefinedLib.dotDotCalc = true;
            return new J([
                "dotDotCalc_" + $node.antiConflictString,
                "(dotDot_" + $node.antiConflictString + ",",
                this.callee.x.compile(),
                ",\"", this.callee.y.compile(), "\",[",
                args, "])"
            ]);
        }
        else {
            return new J([(useNew ? "new " : ""), this.callee.compile(), "(", args, ")"]);
        }
    }
}

export class BracketCallExpression extends $base.Expression {
    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, $pattern.CallBracketPair], [0, 1]]
        ];
    }

    static applyMatch(match, lex) {
        let isNew = false;
        let isNonew = false;
        let isPossibleNew = lex.at(match[0].startIndex) instanceof $lex.New;
        let isPossibleNonew = lex.at(match[0].startIndex) instanceof $lex.Nonew;
        if (isPossibleNew || isPossibleNonew) {
            let found = $pattern.Pattern.searchOne(
                [$lex.LeftParenthesis, $lex.LeftBracket, $lex.LeftBrace],
                lex.part(match[0].startIndex + 1, match[0].endIndex),
                true
            );
            if (found === null || found === match[0].startIndex + 1) {
                match[0].startIndex++;
                if (isPossibleNew) isNew = true;
                if (isPossibleNonew) isNonew = true;
            }
        }
        return new ParenthesisCallExpression(
            this.build(lex.part(match[0])),
            new $node.Arr([
                this.build(lex.part(match[1]))
            ]),
            isNew,
            isNonew
        );
    }
}

export class BraceCallExpression extends $base.Expression {
    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, $pattern.CallBracePair], [0, 1]]
        ];
    }

    static applyMatch(match, lex) {
        let isNew = false;
        let isNonew = false;
        let isPossibleNew = lex.at(match[0].startIndex) instanceof $lex.New;
        let isPossibleNonew = lex.at(match[0].startIndex) instanceof $lex.Nonew;
        if (isPossibleNew || isPossibleNonew) {
            let found = $pattern.Pattern.searchOne(
                [$lex.LeftParenthesis, $lex.LeftBracket, $lex.LeftBrace],
                lex.part(match[0].startIndex + 1, match[0].endIndex),
                true
            );
            if (found === null || found === match[0].startIndex + 1) {
                match[0].startIndex++;
                if (isPossibleNew) isNew = true;
                if (isPossibleNonew) isNonew = true;
            }
        }
        return new ParenthesisCallExpression(
            this.build(lex.part(match[0])),
            new $node.Arr([
                this.build(lex.part(match[1]))
            ]),
            isNew,
            isNonew
        );
    }
}

export class SpaceCallExpression extends $base.Expression {
    static match(lexPart) {
        let pos = this.searchOne(
            (token, index, lexPart) => {
                let next = lexPart.lex.at(index + 1);
                return (
                    (
                        token instanceof $lex.RightParenthesis &&
                        !(token instanceof $lex.PseudoCallRightParenthesis)
                    ) ||
                    token.constructor.canBeCalleeEnd
                ) &&
                    next !== undefined && index < lexPart.endIndex &&
                    (
                        next instanceof $lex.NormalLeftParenthesis ||
                        next instanceof $lex.NormalLeftBracket ||
                        next instanceof $lex.NormalLeftBrace ||
                        !(
                            next.constructor.expressionStartForbidden ||
                            next.constructor.isJoint ||
                            next instanceof $lex.Chevron ||
                            next instanceof $lex.Parenthesis ||
                            next instanceof $lex.Bracket ||
                            next instanceof $lex.Brace
                        )
                    );
            },
            lexPart
        );
        if (pos === null) {
            return null;
        }
        else {
            return {
                selected: [
                    {startIndex: lexPart.startIndex, endIndex: pos},
                    {startIndex: pos + 1, endIndex: lexPart.endIndex}
                ],
                all: [
                    {startIndex: lexPart.startIndex, endIndex: pos},
                    {startIndex: pos + 1, endIndex: lexPart.endIndex}
                ]
            };
        }
    }

    static applyMatch(match, lex) {
        let isNew = false;
        let isNonew = false;
        let isPossibleNew = lex.at(match[0].startIndex) instanceof $lex.New;
        let isPossibleNonew = lex.at(match[0].startIndex) instanceof $lex.Nonew;
        if (isPossibleNew || isPossibleNonew) {
            let found = $pattern.Pattern.searchOne(
                [$lex.LeftParenthesis, $lex.LeftBracket, $lex.LeftBrace],
                lex.part(match[0].startIndex + 1, match[0].endIndex),
                true
            );
            if (found === null || found === match[0].startIndex + 1) {
                match[0].startIndex++;
                if (isPossibleNew) isNew = true;
                if (isPossibleNonew) isNonew = true;
            }
        }
        return new ParenthesisCallExpression(
            this.build(lex.part(match[0])),
            new $node.Arr([this.build(lex.part(match[1]))]),
            isNew,
            isNonew
        );
    }
}

export class PseudoCallExpression extends $base.Expression {
    constructor(callee, args) {
        super();
        this.callee = callee;
        this.arguments = args;
    }

    static patternsAndCaptures() {
        return [
            [[$lex.InlineNormalString, $pattern.PseudoCallParenthesisPair], [0, 1]],
            [[$lex.FormattedNormalString, $pattern.PseudoCallParenthesisPair], [0, 1]],
            [[$lex.InlineVerbatimString, $pattern.PseudoCallParenthesisPair], [0, 1]],
            [[$lex.FormattedVerbatimString, $pattern.PseudoCallParenthesisPair], [0, 1]],
            [[$lex.InlineRegex, $pattern.PseudoCallParenthesisPair], [0, 1]],
            [[$lex.FormattedRegex, $pattern.PseudoCallParenthesisPair], [0, 1]],
            [[$lex.InlineJs, $pattern.PseudoCallParenthesisPair], [0, 1]],
            [[$lex.FormattedJs, $pattern.PseudoCallParenthesisPair], [0, 1]]
        ];
    }

    static applyMatch(match, lex) {
        let argumentRanges = $pattern.Pattern
        .split($lex.Comma, lex.part(match[1]).shrink())
        .filter(m => m.endIndex >= m.startIndex);
        return new this(
            this.build(lex.part(match[0])),
            new $node.Arr(argumentRanges.map(m =>
                this.build(lex.part(m))
            ))
        );
    }

    bareCompile() {
        if (this.callee instanceof $node.InlineNormalStringExpression) {
            return this.arguments.value[0].compile();
        }
        else if (this.callee instanceof $node.FormattedNormalStringExpression) {
            return this.arguments.value[0].compile();
        }
        else if (this.callee instanceof $node.InlineVerbatimStringExpression) {
            return this.arguments.value[0].compile();
        }
        else if (this.callee instanceof $node.FormattedVerbatimStringExpression) {
            return this.arguments.value[0].compile();
        }
        else if (this.callee instanceof $node.InlineRegexExpression) {
            if (this.arguments.value.length > 1) {
                return [
                    "new RegExp(",
                    this.arguments.value[0].compile(),
                    ",\"",
                    this.arguments.value[1].value,
                    "\")"
                ];
            }
            else {
                return [
                    "new RegExp(",
                    this.arguments.value[0].compile(),
                    ")"
                ];
            }
        }
        else if (this.callee instanceof $node.FormattedRegexExpression) {
            this.getRoot().predefinedLib.formattedRegex = true;
            if (this.arguments.value.length > 1) {
                return [
                    "formattedRegex_" + $node.antiConflictString + "(",
                    this.arguments.value[0].compile(),
                    ",\"",
                    this.arguments.value[1].value,
                    "\")"
                ];
            }
            else {
                return [
                    "formattedRegex_" + $node.antiConflictString + "(",
                    this.arguments.value[0].compile(),
                    ")"
                ];
            }
        }
        else if (this.callee instanceof $node.InlineJsExpression) {
            return this.arguments.value[0].compile();
        }
        else if (this.callee instanceof $node.FormattedJsExpression) {
            return this.arguments.value[0].compile();
        }
        else {
            throw new Error("String syntax error.");
        }
    }
}

export class DoExpression extends $base.Expression {
    constructor(f) {
        super();
        this.function = f;
    }

    static patternsAndCaptures() {
        return [
            [[$lex.Do, $pattern.tokens], [1]]
        ];
    }

    static applyMatch(match, lex) {
        return new this(this.build(lex.part(match[0])));
    }

    bareCompile() {
        return [this.function.compile(), "()"];
    }
}
