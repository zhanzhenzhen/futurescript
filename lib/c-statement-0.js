// `patternsAndCaptures` static method can't contain expression parts, because
// expression may be right-to-left. Our pattern here is always left-to-right.
// But we can handle expression part in `applyMatch` static method.

import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $expression from "./c-expression-0.js";
import * as $block from "./c-block-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

export class Statement extends $node.MappableNode {
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
            return this.applyMatch(match, lexPart.lex);
        }
    }

    static buildBlock(lexPart) {
        if (lexPart === null) {
            return null;
        }
        else if (lexPart.token() instanceof $lex.LeftChevron) {
            return new $block.Block(lexPart.shrink());
        }
        else {
            return new $block.Block(lexPart);
        }
    }

    static buildScopeBlock(lexPart) {
        if (lexPart === null) {
            return null;
        }
        else if (lexPart.token() instanceof $lex.LeftChevron) {
            return new $block.ScopeBlock(lexPart.shrink());
        }
        else {
            return new $block.ScopeBlock(lexPart);
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
            // If this doesn't throw, r won't be null.
            r = new ExpressionStatement($expression.Expression.build(lexPart));
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
        return $expression.PostIfExpression.patternsAndCaptures();
    }

    static applyMatch(match, lex) {
        return new this($expression.PostIfExpression.applyMatch(...arguments));
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

    static applyMatch(match, lex) {
        if (lex.at(match[0].startIndex) instanceof $lex.NormalToken && match[2] === null) {
            return new this(
                new $node.Piece(lex.part(match[1])),
                new $node.Arr([new $node.Xy(new $node.VariableAssignee({
                    variable: new $node.Piece(lex.part(match[0]))
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
                    variable: new $node.Piece(lex.part(match[0]))
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
                                variable: new $node.Piece(lex.part(nvRanges[0]))
                            }),
                            new $node.Piece(lex.part(nvRanges[1]))
                        );
                    })
                ),
                null,
                false
            );
        }
        else if (match[0] === null) {
            return new this(
                new $node.Piece(lex.part(match[1])),
                null,
                null,
                true
            );
        }
        else {
            throw new Error("\"import\" statement syntax error.");
        }
    }

    compile() {
        if (
            this.getRoot().hasCompilerDirective("node module") ||
            this.getRoot().hasCompilerDirective("node import")
        ) {
            if (this.batchall) {
            }
            else if (this.catchall !== null) {
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
            if (this.batchall) {
            }
            else if (this.catchall !== null) {
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
            this.getRoot().hasCompilerDirective("node module") ||
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
        return new this($expression.Expression.build(lex.part(match[0])));
    }

    compile() {
        if (
            this.getRoot().hasCompilerDirective("node module") ||
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
    constructor(assignees, value) {
        super();
        this.assignees = assignees;
        this.value = value;
    }

    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, $lex.Colon, $pattern.tokens], [0, 2]]
        ];
    }

    static applyMatch(match, lex) {
        let assigneeRanges = $pattern.Pattern
        .split($lex.Comma, lex.part(match[0]))
        .filter(m => m.endIndex >= m.startIndex);
        return new this(
            new $node.Arr(assigneeRanges.map(m => {
                let startIndex = m.startIndex;
                let endIndex = m.endIndex;

                let ifnullOn = false;
                let ifvoidOn = false;
                if (lex.at(endIndex) instanceof $lex.Ifnull) {
                    ifnullOn = true;
                    endIndex--;
                }
                else if (lex.at(endIndex) instanceof $lex.Ifvoid) {
                    ifvoidOn = true;
                    endIndex--;
                }

                let exportOn = false;
                if (
                    lex.at(endIndex - 1) instanceof $lex.NormalVariant &&
                    lex.at(endIndex) instanceof $lex.NormalToken &&
                    lex.at(endIndex).value === "export"
                ) {
                    exportOn = true;
                    endIndex -= 2;
                }

                let dotMatch = $pattern.Pattern.matchPatternCapture(
                    [$pattern.tokens, $lex.Dot, $pattern.tokens],
                    lex.part(startIndex, endIndex),
                    false,
                    [0, 2]
                );
                if (dotMatch !== null) {
                    return new $node.DotAssignee({
                        x: $expression.Expression.build(lex.part(dotMatch[0])),
                        y: (
                            lex.at(dotMatch[1].startIndex) instanceof $lex.LeftParenthesis ?
                            $expression.Expression.build(lex.part(dotMatch[1]).shrink()) :
                            new $node.Piece(lex.part(dotMatch[1]))
                        ),
                        export: exportOn,
                        ifvoid: ifvoidOn,
                        ifnull: ifnullOn
                    });
                }
                else {
                    let bracketMatch = $pattern.Pattern.matchPatternCapture(
                        [$pattern.BracketPair],
                        lex.part(startIndex, endIndex),
                        true,
                        [0]
                    );
                    if (bracketMatch !== null) {
                        let elementRanges = $pattern.Pattern.split(
                            [$lex.Comma, $lex.Semicolon],
                            lex.part(bracketMatch[0]).shrink()
                        );
                        return new $node.BracketAssignees(
                            elementRanges.map(m =>
                                new $node.VariableAssignee({
                                    variable: new $node.Piece(lex.part(m))
                                })
                            )
                        );
                    }
                    else {
                        return new $node.VariableAssignee({
                            variable: new $node.Piece(lex.part(m)),
                            export: exportOn,
                            ifvoid: ifvoidOn,
                            ifnull: ifnullOn
                        });
                    }
                }
            })),
            $expression.Expression.build(lex.part(match[1]))
        );
    }

    compile() {
        let left = new J(this.assignees.value.map(assignee => {
            if (assignee instanceof $node.BracketAssignees) {
                return new J([
                    "[",
                    new J(assignee.value.map(m => m.variable.compile()), ","),
                    "]"
                ]);
            }
            else if (assignee instanceof $node.DotAssignee) {
                if (assignee.y instanceof $expression.Expression) {
                    return new J([assignee.x.compile(), "[", assignee.y.compile(), "]"]);
                }
                else {
                    return new J([assignee.x.compile(), ".", assignee.y.compile()]);
                }
            }
            else {
                return assignee.variable.compile();
            }
        }), "=");
        let jb = new J([left, "=", this.value.compile()]);
        let root = this.getRoot();
        let treeExports = this.assignees.value
        .filter(m => m instanceof $node.VariableAssignee && m.export);
        if (treeExports.length > 0) {
            let exportJb = new J(
                treeExports.map(assignee => {
                    if (
                        root.hasCompilerDirective("node module") ||
                        root.hasCompilerDirective("node import")
                    ) {
                        return new J([
                            "exports.", assignee.variable.compile(), "=", assignee.variable.compile()
                        ]);
                    }
                    else {
                        return new J(["export {", assignee.variable.compile(), "}"]);
                    }
                }),
                ";"
            );
            jb = new J([jb, ";", exportJb]);
        }
        return jb;
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
        return new this($expression.Expression.build(lex.part(match[0])));
    }

    compile() {
        let value =
            this.value === null ?
            (
                this.getParent(m =>
                    m instanceof $expression.TryExpression &&
                    m.catchBranch !== null
                ) === null ? "undefined" : "catch_" + $block.antiConflictString
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
            throw new Error("\"delete\" statement syntax error.");
        }
        return new this(
            $expression.Expression.build(lex.part(dotMatch[0])),
            (
                lex.at(dotMatch[1].startIndex) instanceof $lex.LeftParenthesis ?
                $expression.Expression.build(lex.part(dotMatch[1]).shrink()) :
                new $node.Piece(lex.part(dotMatch[1]))
            )
        );
    }

    compile() {
        if (this.y instanceof $expression.Expression) {
            return new J(["delete ", this.x.compile(), "[", this.y.compile(), "]"]);
        }
        else {
            return new J(["delete ", this.x.compile(), ".", this.y.compile()]);
        }
    }
}
