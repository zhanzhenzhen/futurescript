import * as $lex from "./compile-lex-0";
import * as $node from "./compile-node-0";
import * as $expression from "./compile-expression-0";
import * as $block from "./compile-block-0";
import * as $pattern from "./compile-pattern-0";
import * as $print from "../lib/compile-print-0";
import {JsBuilder as J} from "./compile-js-builder-0";

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
            r = AssignStatement.matchAndApply(lexPart);
        }
        if (r === null) {
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

                let ifnullOn;
                let ifvoidOn;
                if (lex.at(endIndex) instanceof $lex.Ifnull) {
                    ifnullOn = true;
                    endIndex--;
                }
                else if (lex.at(endIndex) instanceof $lex.Ifvoid) {
                    ifvoidOn = true;
                    endIndex--;
                }

                let exportOn;
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
                        return new $node.BracketAssignee({
                            elements: new $node.Arr(
                                elementRanges.map(m =>
                                    new $node.Piece(lex.part(m))
                                )
                            ),
                            export: exportOn,
                            ifvoid: ifvoidOn,
                            ifnull: ifnullOn
                        });
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
            if (assignee instanceof $node.BracketAssignee) {
                return new J([
                    "[",
                    new J(assignee.elements.value.map(m => m.compile()), ","),
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
        return new J([left, "=", this.value.compile()]);
    }
}
