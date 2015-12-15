import {pool} from "./c-expression-pool-0.js";
import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $block from "./c-block-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import * as $statement from "./c-statement-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

pool.ArrowFunctionExpression = class ArrowFunctionExpression extends pool.Expression {
    constructor(args, body) {
        super();
        this.arguments = args;
        this.body = body;
    }

    static patternsAndCaptures() {
        return [
            [[$pattern.NormalParenthesisPair, $lex.ArrowFunction, $pattern.any], [0, 2]],
            [[$pattern.NormalBracketPair, $lex.ArrowFunction, $pattern.any], [0, 2]],
            [[$lex.NormalToken, $lex.ArrowFunction, $pattern.any], [0, 2]]
        ];
    }

    static applyMatch(match, lex) {
        let argumentsLexPart =
            lex.at(match[0].startIndex) instanceof $lex.NormalLeftParenthesis ?
            lex.part(match[0]).shrink() :
            lex.part(match[0]);
        let argumentRanges = $pattern.Pattern
        .split($lex.Comma, argumentsLexPart)
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
            $statement.Statement.buildScopeBlock(lex.part(match[1]))
        );
    }

    rawCompile() {
        let args = this.arguments.value;
        let variables = new J(args.map(m => m.variable.compile()), ",");
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
        let name = "fun_" + $block.antiConflictString;
        if (
            this.getParent() instanceof $node.Xy &&
            this.getParent().getParent() instanceof $node.Arr &&
            this.getParent().getParent().getParent() instanceof pool.ClassExpression
        ) {
            if (this.getParent().x.static && this.getParent().x.name === null) {
                return [
                    "function " + name + "(", variables, "){",
                    voidDefaults, nullDefaults,
                    "return ", this.body.compile(), ";}"
                ];
            }
            else {
                return [
                    "(", variables, ")=>{",
                    voidDefaults, nullDefaults,
                    "return ", this.body.compile(), ";}"
                ];
            }
        }
        else {
            if (this.getParent(pool.ClassExpression) === null) {
                return [
                    "function " + name + "(", variables, "){",
                    voidDefaults, nullDefaults,
                    "return ", this.body.compile(), ";}"
                ];
            }
            else {
                return [
                    "(", variables, ")=>{var ", name,
                    ";(", name, "=(", variables, ")=>{",
                    voidDefaults, nullDefaults,
                    "return ", this.body.compile(), ";})(", variables, ");}"
                ];
            }
        }
    }
}

pool.DiamondFunctionExpression = class DiamondFunctionExpression extends pool.Expression {
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
            $statement.Statement.buildScopeBlock(lex.part(match[0]))
        );
    }

    rawCompile() {
        let name = "fun_" + $block.antiConflictString;
        let arg = "var arg_" + $block.antiConflictString + "=arguments;";
        return [
            "function " + name + "(){" +
            arg +
            "return ", this.body.compile(), ";}"
        ];
    }
}

pool.DashFunctionExpression = class DashFunctionExpression extends pool.Expression {
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
            $statement.Statement.buildScopeBlock(lex.part(match[0]))
        );
    }

    rawCompile() {
        return ["function(){return ", this.body.compile(), ";}"];
    }
}

pool.ParenthesisCallExpression = class ParenthesisCallExpression extends pool.Expression {
    constructor(callee, args) {
        super();
        this.callee = callee;
        this.arguments = args;
    }

    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, $pattern.CallParenthesisPair], [0, 1]]
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

    rawCompile() {
        let jb = (callee) => {
            let args = new J(this.arguments.value.map(m => m.compile()), ",");
            return new J([callee.compile(), "(", args, ")"]);
        };
        if (this.callee instanceof pool.OkVariantExpression) {
            this.getRoot().predefinedLib.ok = true;
            return [
                "ok_" + $block.antiConflictString + "(",
                this.callee.x.compile(),
                ")?",
                jb(this.callee.x),
                ":undefined"
            ];
        }
        else {
            return jb(this.callee);
        }
    }
}

pool.BracketCallExpression = class BracketCallExpression extends pool.Expression {
    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, $pattern.CallBracketPair], [0, 1]]
        ];
    }

    static applyMatch(match, lex) {
        return new pool.ParenthesisCallExpression(
            this.build(lex.part(match[0])),
            new $node.Arr([
                this.build(lex.part(match[1]))
            ])
        );
    }
}

pool.BraceCallExpression = class BraceCallExpression extends pool.Expression {
    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, $pattern.CallBracePair], [0, 1]]
        ];
    }

    static applyMatch(match, lex) {
        return new pool.ParenthesisCallExpression(
            this.build(lex.part(match[0])),
            new $node.Arr([
                this.build(lex.part(match[1]))
            ])
        );
    }
}

pool.SpaceCallExpression = class SpaceCallExpression extends pool.Expression {
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
        return new pool.ParenthesisCallExpression(
            this.build(lex.part(match[0])),
            new $node.Arr([this.build(lex.part(match[1]))])
        );
    }
}

pool.PseudoCallExpression = class PseudoCallExpression extends pool.Expression {
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

    rawCompile() {
        if (this.callee instanceof pool.InlineNormalStringExpression) {
            return this.arguments.value[0].compile();
        }
        else if (this.callee instanceof pool.FormattedNormalStringExpression) {
            return this.arguments.value[0].compile();
        }
        else if (this.callee instanceof pool.InlineVerbatimStringExpression) {
            return this.arguments.value[0].compile();
        }
        else if (this.callee instanceof pool.FormattedVerbatimStringExpression) {
            return this.arguments.value[0].compile();
        }
        else if (this.callee instanceof pool.InlineRegexExpression) {
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
        else if (this.callee instanceof pool.FormattedRegexExpression) {
            this.getRoot().predefinedLib.formattedRegex = true;
            if (this.arguments.value.length > 1) {
                return [
                    "formattedRegex_" + $block.antiConflictString + "(",
                    this.arguments.value[0].compile(),
                    ",\"",
                    this.arguments.value[1].value,
                    "\")"
                ];
            }
            else {
                return [
                    "formattedRegex_" + $block.antiConflictString + "(",
                    this.arguments.value[0].compile(),
                    ")"
                ];
            }
        }
        else if (this.callee instanceof pool.InlineJsExpression) {
            return this.arguments.value[0].value;
        }
        else if (this.callee instanceof pool.FormattedJsExpression) {
            return this.arguments.value[0].value;
        }
        else {
            throw new Error("String syntax error.");
        }
    }
}

pool.DoExpression = class DoExpression extends pool.Expression {
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

    rawCompile() {
        return [this.function.compile(), "()"];
    }
}
