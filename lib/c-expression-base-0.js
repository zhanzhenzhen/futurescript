import {pool} from "./c-expression-pool-0.js";
import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $block from "./c-block-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import * as $statement from "./c-statement-0.js";
import * as $tools from "./c-tools-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

let Expression = pool.Expression = class Expression extends $node.MappableNode {
    static leftToRight() {
        return this.precedence.find(group => $tools.includes(group.types, this)).leftToRight;
    }

    static matchPatternCapture(tokenTypes, lexPart, capture) {
        return $pattern.Pattern.matchPatternCapture(tokenTypes, lexPart, this.leftToRight(), capture);
    }

    static searchOne(ruler, lexPart) {
        return $pattern.Pattern.searchOne(ruler, lexPart, this.leftToRight());
    }

    static match(lexPart) {
        let pcs = this.patternsAndCaptures();
        let leftToRight = this.leftToRight();
        return $pattern.Pattern.matchPatternsAndCaptures(pcs, lexPart, leftToRight, true);
    }

    static build(lexPart) {
        if (lexPart === null) {
            return null;
        }

        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        let r = null;
        if (startIndex > endIndex) {
            return null;
        }
        else if (startIndex === endIndex) { // atom expression
            let token = lex.at(startIndex);
            if (token instanceof $lex.NormalToken) {
                r = new pool.VariableExpression(lex.at(startIndex).value);
            }
            else if (token instanceof $lex.Num) {
                r = new pool.NumberExpression(lex.at(startIndex).value);
            }
            else if (token instanceof $lex.Str) {
                r = new pool.StringExpression(lex.at(startIndex).value);
            }
            else if (token instanceof $lex.PostQuote) {
                r = new pool.PostQuoteExpression(lex.at(startIndex).value);
            }
            else if (token instanceof $lex.InlineNormalString) {
                r = new pool.InlineNormalStringExpression();
            }
            else if (token instanceof $lex.FormattedNormalString) {
                r = new pool.FormattedNormalStringExpression();
            }
            else if (token instanceof $lex.InlineVerbatimString) {
                r = new pool.InlineVerbatimStringExpression();
            }
            else if (token instanceof $lex.FormattedVerbatimString) {
                r = new pool.FormattedVerbatimStringExpression();
            }
            else if (token instanceof $lex.InlineRegex) {
                r = new pool.InlineRegexExpression();
            }
            else if (token instanceof $lex.FormattedRegex) {
                r = new pool.FormattedRegexExpression();
            }
            else if (token instanceof $lex.InlineJs) {
                r = new pool.InlineJsExpression();
            }
            else if (token instanceof $lex.FormattedJs) {
                r = new pool.FormattedJsExpression();
            }
            else if (token instanceof $lex.True) {
                r = new pool.BooleanExpression("true");
            }
            else if (token instanceof $lex.False) {
                r = new pool.BooleanExpression("false");
            }
            else if (token instanceof $lex.Null) {
                r = new pool.NullExpression();
            }
            else if (token instanceof $lex.Void) {
                r = new pool.VoidExpression();
            }
            else if (token instanceof $lex.Arg) {
                r = new pool.ArgExpression();
            }
            else if (token instanceof $lex.Fun) {
                r = new pool.FunExpression();
            }
            else if (token instanceof $lex.Self) {
                r = new pool.SelfExpression();
            }
            else if (token instanceof $lex.Me) {
                r = new pool.MeExpression();
            }
            else if (token instanceof $lex.ClassMe) {
                r = new pool.ClassMeExpression();
            }
            else if (token instanceof $lex.Super) {
                r = new pool.SuperExpression();
            }
            else {
                throw new pool.ParseSingleTokenError(lexPart);
            }
        }
        else if (
            lex.at(startIndex) instanceof $lex.NormalLeftParenthesis &&
            lex.at(endIndex) instanceof $lex.NormalRightParenthesis
        ) {
            r = this.build(lexPart.shrink());
        }
        else {
            for (let i = 0; i < this.precedence.length; i++) {
                let group = this.precedence[i];
                let nearest = null;
                for (let j = 0; j < group.types.length; j++) {
                    let type = group.types[j];
                    let match = type.match(lexPart);
                    if (match !== null) {
                        if (nearest === null) {
                            nearest = {match: match, type: type};
                        }
                        else {
                            if (group.leftToRight) {
                                if (
                                    match.all[0].endIndex <
                                    nearest.match.all[0].endIndex
                                ) {
                                    nearest = {match: match, type: type};
                                }
                            }
                            else {
                                if (
                                    match.all[match.all.length - 1].startIndex >
                                    nearest.match.all[nearest.match.all.length - 1].startIndex
                                ) {
                                    nearest = {match: match, type: type};
                                }
                            }
                        }
                    }
                }
                if (nearest !== null) {
                    r = nearest.type.applyMatch(nearest.match.selected, lex, lexPart);
                    break;
                }
            }
            if (r === null) {
                throw new pool.NoPatternMatchError(lexPart);
            }
        }
        return r.setLexPart(lexPart);
    }

    compile() {
        let rawCompiled = this.rawCompile();
        let jb = null;
        if (Array.isArray(rawCompiled)) {
            jb = new J(rawCompiled);
        }
        else if (typeof rawCompiled === "string") {
            jb = new J(rawCompiled).shareLexPart(this);
        }
        else if (rawCompiled instanceof J) {
            jb = rawCompiled;
        }
        else {
            throw new Error("Compile argument invalid.");
        }
        return new J(["(", jb, ")"]);
    }
}

let AtomExpression = pool.AtomExpression = class AtomExpression extends Expression {
    constructor(value) {
        super();
        this.value = value;
    }

    toString() {
        return $print.printAtom(this);
    }
}

// Every subclass must have a `sign` static property.
// This class is only for convenience for `a op b` form where both `a` and `b` are expressions.
// It doesn't include all binary expressions.
pool.BinaryExpression = class BinaryExpression extends Expression {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }

    static patternsAndCaptures() {
        return [
            [[$pattern.tokens, this.sign, $pattern.tokens], [0, 2]]
        ];
    }

    static applyMatch(match, lex) {
        return new this(
            this.build(lex.part(match[0])),
            this.build(lex.part(match[1]))
        );
    }
}

// Every subclass must have a `sign` static property.
// This class is only for convenience for `op a` form when `a` is an expression.
// It doesn't include all unary expressions.
pool.UnaryExpression = class UnaryExpression extends Expression {
    constructor(x) {
        super();
        this.x = x;
    }

    static patternsAndCaptures() {
        return [
            [[this.sign, $pattern.tokens], [1]]
        ];
    }

    static applyMatch(match, lex) {
        return new this(
            this.build(lex.part(match[0]))
        );
    }
}

pool.VariableExpression = class VariableExpression extends AtomExpression {
    rawCompile() {
        return this.value;
    }
}

pool.NumberExpression = class NumberExpression extends AtomExpression {
    rawCompile() {
        return this.value;
    }
}

pool.BooleanExpression = class BooleanExpression extends AtomExpression {
    rawCompile() {
        return this.value;
    }
}

pool.NullExpression = class NullExpression extends AtomExpression {
    rawCompile() {
        return "null";
    }
}

pool.VoidExpression = class VoidExpression extends AtomExpression {
    rawCompile() {
        return "undefined";
    }
}

pool.ArgExpression = class ArgExpression extends AtomExpression {
    rawCompile() {
        if (this.getRoot().hasCompilerDirective("radical")) {
            return "arg_" + $block.antiConflictString + "[0]";
        }
        else {
            return "arg_" + $block.antiConflictString;
        }
    }
}

pool.FunExpression = class FunExpression extends AtomExpression {
    rawCompile() {
        return "fun_" + $block.antiConflictString;
    }
}

pool.SelfExpression = class SelfExpression extends AtomExpression {
    rawCompile() {
        let treeAssignee = this.getParent($statement.Statement).assignees.value[0];

        // The assignee isn't an expression, so we should compile the main components of it.
        // That looks redundant to the assign statement, but essentially they are not the same,
        // for the compiled JS here is an expression, though the JS code is the same.
        if (treeAssignee instanceof $node.VariableAssignee) {
            return treeAssignee.variable.compile();
        }
        else if (treeAssignee instanceof $node.DotAssignee) {
            if (treeAssignee.y instanceof Expression || treeAssignee.y instanceof $node.SymbolMemberName) {
                return new J([treeAssignee.x.compile(), "[", treeAssignee.y.compile(), "]"]);
            }
            else {
                return new J([treeAssignee.x.compile(), ".", treeAssignee.y.compile()]);
            }
        }
        else {
            throw new Error("\"self\" can't apply to this assignee.");
        }
    }
}

pool.MeExpression = class MeExpression extends AtomExpression {
    rawCompile() {
        return "this";
    }
}

pool.ClassMeExpression = class ClassMeExpression extends AtomExpression {
    rawCompile() {
        let ancestors = this.getParent(pool.ClassExpression, true);

        let firstLevel = ancestors[ancestors.length - 1];
        if (firstLevel === null) {
            throw new Error();
        }

        let secondLevel = ancestors[ancestors.length - 2];
        let thirdLevel = ancestors[ancestors.length - 3];
        if (!(
            secondLevel instanceof $node.Arr &&
            thirdLevel instanceof $node.Xy
        )) {
            throw new Error();
        }

        if (thirdLevel.x.static) {
            return "this";
        }
        else {
            return "this.constructor";
        }
    }
}

pool.SuperExpression = class SuperExpression extends AtomExpression {
    // We must override `compile`. If using `rawCompile`, then it will mis-add
    // an enclosing `()` for the bare `super`, but `super` is not an expression in JS.
    compile() {
        let ancestors = this.getParent(pool.ClassExpression, true);

        let firstLevel = ancestors[ancestors.length - 1];
        if (firstLevel === null) {
            throw new Error();
        }

        let secondLevel = ancestors[ancestors.length - 2];
        let thirdLevel = ancestors[ancestors.length - 3];
        if (!(
            secondLevel instanceof $node.Arr &&
            thirdLevel instanceof $node.Xy
        )) {
            throw new Error();
        }

        if (thirdLevel.x.new) {
            return new J("super"); // because of this we can't use `rawCompile`
        }
        else {
            return new J(["(super.", thirdLevel.x.name.compile(), ")"]);
        }
    }
}

// This refers to `Str` token.
pool.StringExpression = class StringExpression extends AtomExpression {
    rawCompile() {
        // Note: If the source code `"aaa"` compiles to JS `"aaa"`, then the left `"` in
        // the compiled JS will map to the first 'a' in source, not to the left `"`
        // in source. This is not a bug, because:
        // If we have interpolation, such as `"aaa\(a)bbb"` that compiles to `"aaa"+a+"bbb"`,
        // then you'll find the source `"` and the compiled `"` are not at the same level,
        // so they are not the same.
        return "\"" + this.value + "\"";
    }
}

// This refers to `PostQuote` token.
pool.PostQuoteExpression = class PostQuoteExpression extends AtomExpression {}

// This refers to `InlineNormalString` token.
pool.InlineNormalStringExpression = class InlineNormalStringExpression extends AtomExpression {}

pool.FormattedNormalStringExpression = class FormattedNormalStringExpression extends AtomExpression {}

pool.InlineVerbatimStringExpression = class InlineVerbatimStringExpression extends AtomExpression {}

pool.FormattedVerbatimStringExpression = class FormattedVerbatimStringExpression extends AtomExpression {}

pool.InlineRegexExpression = class InlineRegexExpression extends AtomExpression {}

pool.FormattedRegexExpression = class FormattedRegexExpression extends AtomExpression {}

pool.InlineJsExpression = class InlineJsExpression extends AtomExpression {}

pool.FormattedJsExpression = class FormattedJsExpression extends AtomExpression {}

pool.ParseSingleTokenError = class ParseSingleTokenError extends $lex.SyntaxError {
    constructor(lexPart) {
        super(lexPart, "The single token can't be parsed as expression.");
    }
}

pool.NoPatternMatchError = class NoPatternMatchError extends $lex.SyntaxError {
    constructor(lexPart) {
        super(lexPart, "No pattern matches the possible expression.");
    }
}
