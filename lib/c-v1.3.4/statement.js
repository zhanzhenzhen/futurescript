// `patternsAndCaptures` static method can't contain expression parts, because
// expression may be right-to-left. Our pattern here is always left-to-right.
// But we can handle expression part in `applyMatch` static method.

import * as $lex from "./lex.js";
import * as $node from "./node.js";
import * as $nodeBase from "./node-base.js";
import * as $pattern from "./pattern.js";
import * as $print from "./print.js";
import {JsBuilder as J} from "./js-builder.js";

export class Statement extends $nodeBase.MappableNode {
    static match(lexPart) {
        let pcs = this.patternsAndCaptures();
        for (let i = 0; i < pcs.length; i++) {
            let pc = pcs[i];

            // For statement, `leftToRight` argument in pattern doesn't have any effect,
            // but it's better to set it to true so that it will run faster.
            let candidate = $pattern.Pattern.matchPatternCapture(pc[0], lexPart, true, pc[1]);

            if (candidate !== null) {
                return candidate;
            }
        }
        return null;
    }

    static matchAndApply(lexPart) {
        let match = this.match(lexPart);
        if (match === null) {
            return null;
        }
        else {
            return this.applyMatch(match, lexPart.lex, lexPart);
        }
    }

    static buildBlock(lexPart) {
        if (lexPart === null) {
            return null;
        }
        else if (lexPart.token() instanceof $lex.LeftChevron) {
            return new $node.Block(lexPart.shrink());
        }
        else {
            return new $node.Block(lexPart);
        }
    }

    static buildScopeBlock(lexPart) {
        if (lexPart === null) {
            return null;
        }
        else if (lexPart.token() instanceof $lex.LeftChevron) {
            return new $node.ScopeBlock(lexPart.shrink());
        }
        else {
            return new $node.ScopeBlock(lexPart);
        }
    }

    static build(lexPart) {
        let r = null;
        r = PostIfStatement.matchAndApply(lexPart);
        if (r === null) {
            r = ImportStatement.matchAndApply(lexPart);
        }
        if (r === null) {
            r = ExportStatement.matchAndApply(lexPart);
        }
        if (r === null) {
            r = ExportColonStatement.matchAndApply(lexPart);
        }
        if (r === null) {
            r = AssignStatement.matchAndApply(lexPart);
        }
        if (r === null) {
            r = ThrowStatement.matchAndApply(lexPart);
        }
        if (r === null) {
            r = DeleteStatement.matchAndApply(lexPart);
        }
        if (r === null) {
            r = PauseStatement.matchAndApply(lexPart);
        }
        if (r === null) {
            // If this doesn't throw, r won't be null.
            r = new ExpressionStatement($node.Expression.build(lexPart));
        }
        r.setLexPart(lexPart);
        return r;
    }
}

export class ExpressionStatement extends Statement {
    constructor(expression) {
        super();
        this.expression = expression;
    }

    compile() {
        return this.expression.compile();
    }
}

export class PostIfStatement extends ExpressionStatement {
    static patternsAndCaptures() {
        return $node.PostIfExpression.patternsAndCaptures();
    }

    static applyMatch(match, lex) {
        return new this($node.PostIfExpression.applyMatch(...arguments));
    }
}

export class ImportStatement extends Statement {
    constructor(module, mapping, catchall, batchall) {
        super();
        this.module = module;
        this.mapping = mapping;
        this.catchall = catchall;
        this.batchall = batchall;
    }

    static patternsAndCaptures() {
        return [
            [[$lex.NormalToken, $lex.Colon, $lex.Import,
                $lex.InlineNormalString, $pattern.PseudoCallParenthesisPair], [0, [3, 4], null]],
            [[$lex.NormalToken, $lex.Colon, $lex.Import,
                $lex.InlineNormalString, $pattern.PseudoCallParenthesisPair,
                (m => m instanceof $lex.NormalToken && m.value === "all")], [0, [3, 4], 5]],
            [[$pattern.NormalBracePair, $lex.Colon, $lex.Import,
                $lex.InlineNormalString, $pattern.PseudoCallParenthesisPair], [0, [3, 4], null]],
            [[$pattern.NormalBracePair, $lex.Colon, $lex.Import,
                $lex.InlineNormalString, $pattern.PseudoCallParenthesisPair,
                (m => m instanceof $lex.NormalToken && m.value === "all")], [0, [3, 4], 5]],
            [[$lex.Import, $lex.InlineNormalString, $pattern.PseudoCallParenthesisPair,
                $lex.As, $lex.NormalToken], [4, [1, 2], null]],
            [[$lex.Import, $lex.InlineNormalString, $pattern.PseudoCallParenthesisPair,
                (m => m instanceof $lex.NormalToken && m.value === "all"),
                $lex.As, $lex.NormalToken], [5, [1, 2], 3]],
            [[$lex.Import, $lex.InlineNormalString, $pattern.PseudoCallParenthesisPair,
                $lex.As, $pattern.NormalBracePair], [4, [1, 2], null]],
            [[$lex.Import, $lex.InlineNormalString, $pattern.PseudoCallParenthesisPair,
                (m => m instanceof $lex.NormalToken && m.value === "all"),
                $lex.As, $pattern.NormalBracePair], [5, [1, 2], 3]],
            [[$lex.Import, $lex.InlineNormalString, $pattern.PseudoCallParenthesisPair,
                (m => m instanceof $lex.NormalToken && m.value === "all")], [null, [1, 2], 3]]
        ];
    }

    static applyMatch(match, lex, lexPart) {
        if (match[0] !== null) {
            lex.part(match[0]).addStyle(16);
        }

        if (match[0] === null) {
            return new this(
                new $node.Piece(lex.part(match[1])),
                null,
                null,
                true
            );
        }
        else if (lex.at(match[0].startIndex) instanceof $lex.NormalToken && match[2] === null) {
            return new this(
                new $node.Piece(lex.part(match[1])),
                new $node.Arr([new $node.Xy(new $node.VariableAssignee({
                    variable: new $node.LocalVariable(lex.part(match[0]))
                }), new $node.Piece("default"))]),
                null,
                false
            );
        }
        else if (lex.at(match[0].startIndex) instanceof $lex.NormalToken && match[2] !== null) {
            return new this(
                new $node.Piece(lex.part(match[1])),
                null,
                new $node.VariableAssignee({
                    variable: new $node.LocalVariable(lex.part(match[0]))
                }),
                false
            );
        }
        else if (lex.at(match[0].startIndex) instanceof $lex.NormalLeftBrace) {
            let innerLexPart = lex.part(match[0]).shrink();
            let memberRanges = $pattern.Pattern.split(
                [$lex.Comma, $lex.Semicolon],
                innerLexPart
            );
            return new this(
                new $node.Piece(lex.part(match[1])),
                new $node.Arr(
                    memberRanges.map(m => {
                        let asSplitted = $pattern.Pattern.split(
                            $lex.As,
                            lex.part(m)
                        );
                        let nvRanges =
                            asSplitted.length === 1 ?
                            [asSplitted[0], asSplitted[0]] :
                            [asSplitted[1], asSplitted[0]];
                        return new $node.Xy(
                            new $node.VariableAssignee({
                                variable: new $node.LocalVariable(lex.part(nvRanges[0]))
                            }),
                            new $node.Piece(lex.part(nvRanges[1]))
                        );
                    })
                ),
                null,
                false
            );
        }
        else {
            throw new ImportError(lexPart);
        }
    }

    compile() {
        // For batch import, the original statement will be replaced before compiling.
        // So this condition should never be met.
        if (this.batchall) {
            throw new Error("Batch import error.");
        }

        if (
            this.getRoot().hasCompilerDirective("node modules") ||
            this.getRoot().hasCompilerDirective("node import")
        ) {
            if (this.catchall !== null) {
                return new J([
                    this.catchall.variable.compile(),
                    "=require(",
                    this.module.compile(),
                    ")"
                ]);
            }
            else if (this.mapping.value.length === 1 && this.mapping.value[0].y.value === "default") {
                return new J([
                    this.mapping.value[0].x.variable.compile(),
                    "=require(",
                    this.module.compile(),
                    ")"
                ]);
            }
            else {
                return new J(this.mapping.value.map(m => new J([
                    m.x.variable.compile(),
                    "=require(",
                    this.module.compile(),
                    ").",
                    m.y.compile()
                ])), ";");
            }
        }
        else {
            if (this.catchall !== null) {
                return new J([
                    "import * as ",
                    this.catchall.variable.compile(),
                    " from ",
                    this.module.compile()
                ]);
            }
            else if (this.mapping.value.length === 1 && this.mapping.value[0].y.value === "default") {
                return new J([
                    "import ",
                    this.mapping.value[0].x.variable.compile(),
                    " from ",
                    this.module.compile()
                ]);
            }
            else {
                return new J([
                    "import {",
                    new J(this.mapping.value.map(m => new J([
                        m.y.compile(),
                        " as ",
                        m.x.variable.compile()
                    ])), ","),
                    "} from ",
                    this.module.compile()
                ]);
            }
        }
    }
}

export class ExportStatement extends Statement {
    constructor(variable, externalName) {
        super();
        this.variable = variable;
        this.externalName = externalName;
    }

    static patternsAndCaptures() {
        return [
            [[$lex.Export, $lex.NormalToken], [1, null]],
            [[$lex.Export, $lex.NormalToken, $lex.As, $lex.NormalToken], [1, 3]]
        ];
    }

    static applyMatch(match, lex) {
        return new this(
            new $node.LocalVariable(lex.part(match[0])),
            new $node.Piece(match[1] === null ? lex.part(match[0]) : lex.part(match[1]))
        );
    }

    compile() {
        if (
            this.getRoot().hasCompilerDirective("node modules") ||
            this.getRoot().hasCompilerDirective("node import")
        ) {
            if (this.externalName.value === "default") {
                return new J(["module.exports=", this.variable.compile()]);
            }
            else {
                return new J(["exports.", this.externalName.compile(), "=", this.variable.compile()]);
            }
        }
        else {
            return new J(["export {", this.variable.compile(), " as ", this.externalName.compile(), "}"]);
        }
    }
}

export class ExportColonStatement extends Statement {
    constructor(value) {
        super();
        this.value = value;
    }

    static patternsAndCaptures() {
        return [
            [[$lex.Export, $lex.Colon, $pattern.tokens], [2]]
        ];
    }

    static applyMatch(match, lex) {
        return new this($node.Expression.build(lex.part(match[0])));
    }

    compile() {
        if (
            this.getRoot().hasCompilerDirective("node modules") ||
            this.getRoot().hasCompilerDirective("node import")
        ) {
            return new J(["module.exports=", this.value.compile()]);
        }
        else {
            return new J(["export default ", this.value.compile()]);
        }
    }
}

export class AssignStatement extends Statement {
    // Each element of `assignees` can be an assignee, or a `BracketAssignees` instance.
    constructor(assignees, value) {
        super();
        this.assignees = assignees;
        this.value = value;

        this.setHasSelf(false);
    }

    setHasSelf(hasSelf) {
        this._hasSelf = hasSelf;
    }

    getHasSelf() {
        return this._hasSelf;
    }

    static patternsAndCaptures() {
        return [
            // TODO: This looks fragile. We need later completely redesign the matchPattern
            // function in the pattern module to avoid this kind of code.
            [[$pattern.tokensExcept([$lex.ArrowFunction, $lex.DiamondFunction, $lex.DashFunction,
                $lex.Then, $lex.Else, $lex.Try, $lex.Catch, $lex.Finally]),
                $lex.Colon, $pattern.tokens], [0, 2]]
        ];
    }

    static applyMatch(match, lex) {
        let ifnullOn = false;
        let ifvoidOn = false;
        if (lex.at(match[0].endIndex) instanceof $lex.Ifnull) {
            ifnullOn = true;
        }
        else if (lex.at(match[0].endIndex) instanceof $lex.Ifvoid) {
            ifvoidOn = true;
        }
        let leftLexPart =
            ifnullOn || ifvoidOn ?
            lex.part(match[0].startIndex, match[0].endIndex - 1) :
            lex.part(match[0]);
        let assigneeRanges = $pattern.Pattern
        .split($lex.Comma, leftLexPart)
        .filter(m => m.endIndex >= m.startIndex);
        if (assigneeRanges.length > 1 && (ifvoidOn || ifnullOn)) {
            throw new CommaWithIfvoidIfnullError(leftLexPart);
        }
        lex.part(match[0]).addStyle(16);
        return new this(
            new $node.Arr(assigneeRanges.map(m => $node.buildAssignee(lex.part(m), ifvoidOn, ifnullOn))),
            $node.Expression.build(lex.part(match[1]))
        );
    }

    compile() {
        let firstAssignee = this.assignees.value[0];
        if (firstAssignee.ifvoid || firstAssignee.ifnull) {
            let left = $node.compileAssignee(firstAssignee);
            let jb =
                firstAssignee instanceof $node.DotAssignee ?
                new J([
                    "var base_" + $node.antiConflictString + "=", firstAssignee.x.compile(), ";",
                    left, "=", this.value.compile()
                ]) :
                new J([left, "=", this.value.compile()]);
            if (firstAssignee.ifvoid) {
                return new J(["if (", $node.compileAssignee(firstAssignee), "===undefined){", jb, ";}"]);
            }
            else {
                return new J([
                    "if (",
                    $node.compileAssignee(firstAssignee), "===undefined||",
                    $node.compileAssignee(firstAssignee), "===null",
                    "){", jb, ";}"
                ]);
            }
        }
        else {
            let left = new J(this.assignees.value.map(assignee => {
                return $node.compileAssignee(assignee);
            }), "=");
            let jb = new J([left, "=", this.value.compile()]);
            return jb;
        }
    }
}

export class ThrowStatement extends Statement {
    constructor(value) {
        super();
        this.value = value;
    }

    static patternsAndCaptures() {
        return [
            [[$lex.Throw, $pattern.any], [1]]
        ];
    }

    static applyMatch(match, lex) {
        return new this($node.Expression.build(lex.part(match[0])));
    }

    compile() {
        let value =
            this.value === null ?
            (
                this.getParent(m =>
                    m instanceof $node.TryExpression &&
                    m.catchBranch !== null
                ) === null ? "undefined" : "catch_" + $node.antiConflictString
            ) :
            this.value.compile();
        return new J(["throw ", value]);
    }
}

export class DeleteStatement extends Statement {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }

    static patternsAndCaptures() {
        return [
            [[$lex.Delete, $pattern.tokens], [1]]
        ];
    }

    static applyMatch(match, lex) {
        let dotMatch = $pattern.Pattern.matchPatternCapture(
            [$pattern.tokens, $lex.Dot, $pattern.tokens],
            lex.part(match[0]),
            false,
            [0, 2]
        );
        if (dotMatch === null) {
            throw new DeleteError(lex.part(match[0]));
        }
        return new this(
            $node.Expression.build(lex.part(dotMatch[0])),
            (
                lex.at(dotMatch[1].startIndex) instanceof $lex.LeftParenthesis ?
                $node.Expression.build(lex.part(dotMatch[1]).shrink()) :
                new $node.Piece(lex.part(dotMatch[1]))
            )
        );
    }

    compile() {
        if (this.y instanceof $node.Expression) {
            return new J(["delete ", this.x.compile(), "[", this.y.compile(), "]"]);
        }
        else {
            return new J(["delete ", this.x.compile(), ".", this.y.compile()]);
        }
    }
}

export class PauseStatement extends Statement {
    static patternsAndCaptures() {
        return [
            [[$lex.Pause], []]
        ];
    }

    static applyMatch(match, lex) {
        return new this();
    }

    compile() {
        return new J("debugger");
    }
}

export class DeleteError extends $lex.SyntaxError {
    constructor(lexPart) {
        super(lexPart, "\"delete\" statement syntax error.");
    }
}

export class ImportError extends $lex.SyntaxError {
    constructor(lexPart) {
        super(lexPart, "\"import\" statement syntax error.");
    }
}

export class CommaWithIfvoidIfnullError extends $lex.SyntaxError {
    constructor(lexPart) {
        super(lexPart, "Comma \",\" can't coexist with `ifvoid` and `ifnull`.");
    }
}
