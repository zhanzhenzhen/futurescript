import * as $lex from "./lex.mjs";
import * as $node from "./node.mjs";
import * as $nodeBase from "./node-base.mjs";
import * as $pattern from "./pattern.mjs";
import * as $print from "./print.mjs";
import * as $tools from "./tools.mjs";
import {JsBuilder as J} from "./js-builder.mjs";

export class Expression extends $nodeBase.MappableNode {
    static precedence() {
        // It must be in a function to avoid cyclic dependencies problem.
        if (this._precedence === undefined) {
            this._precedence = [
                {types: [
                    $node.ArrayExpression,
                    $node.ObjectExpression,
                    $node.PostIfExpression,
                    $node.MatchExpression,
                    $node.TryExpression,
                    $node.DoExpression,
                    $node.ClassExpression
                ], leftToRight: true},
                {types: [
                    $node.ArrowFunctionExpression,
                    $node.DiamondFunctionExpression,
                    $node.DashFunctionExpression
                ], leftToRight: true},
                {types: [$node.IfExpression], leftToRight: true},
                {types: [$node.SpaceCallExpression], leftToRight: true},
                {types: [$node.OrExpression], leftToRight: false},
                {types: [$node.AndExpression], leftToRight: false},
                {types: [$node.NotExpression], leftToRight: true},
                {types: [
                    $node.EqualExpression,
                    $node.NotEqualExpression,
                    $node.LessThanExpression,
                    $node.LessThanOrEqualExpression,
                    $node.GreaterThanExpression,
                    $node.GreaterThanOrEqualExpression,
                    $node.ChainedCompareExpression
                ], leftToRight: false},
                {types: [
                    $node.InExpression,
                    $node.NotInExpression,
                    $node.IsExpression,
                    $node.IsntExpression
                ], leftToRight: false},
                {types: [$node.PlusExpression, $node.MinusExpression], leftToRight: false},
                {types: [
                    $node.TimesExpression,
                    $node.OverExpression,
                    $node.RemExpression,
                    $node.ModExpression
                ], leftToRight: false},
                {types: [$node.PowerExpression], leftToRight: true},
                {types: [$node.PositiveExpression, $node.NegativeExpression], leftToRight: true},
                {types: [$node.IfvoidExpression, $node.IfnullExpression], leftToRight: false},
                {types: [$node.AsExpression, $node.ExportAsExpression], leftToRight: false},
                {types: [$node.PipeExpression], leftToRight: false},
                {types: [
                    $node.ParenthesisCallExpression,
                    $node.BracketCallExpression,
                    $node.BraceCallExpression,
                    $node.DotExpression,
                    $node.DotDotExpression,
                    $node.NormalVariantExpression,
                    $node.FunctionVariantExpression,
                    $node.ImportExpression
                ], leftToRight: false},
                {types: [$node.PseudoCallExpression], leftToRight: true}
            ];
        }
        return this._precedence;
    }

    static leftToRight() {
        return this.precedence().find(group => $tools.includes(group.types, this)).leftToRight;
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
        else if (
            startIndex === endIndex &&
            !(lex.at(startIndex) instanceof $lex.Class) &&
            !(lex.at(startIndex) instanceof $lex.DiamondFunction) &&
            !(lex.at(startIndex) instanceof $lex.DashFunction)
        ) { // atom expression
            let token = lex.at(startIndex);
            if (token instanceof $lex.NormalToken) {
                r = new VariableExpression(lex.at(startIndex).value);
            }
            else if (token instanceof $lex.Num) {
                r = new NumberExpression(lex.at(startIndex).value);
            }
            else if (token instanceof $lex.Str) {
                r = new StringExpression(lex.at(startIndex).value);
            }
            else if (token instanceof $lex.PostQuote) {
                r = new PostQuoteExpression(lex.at(startIndex).value);
            }
            else if (token instanceof $lex.InlineNormalString) {
                r = new InlineNormalStringExpression();
            }
            else if (token instanceof $lex.FormattedNormalString) {
                r = new FormattedNormalStringExpression();
            }
            else if (token instanceof $lex.InlineVerbatimString) {
                r = new InlineVerbatimStringExpression();
            }
            else if (token instanceof $lex.FormattedVerbatimString) {
                r = new FormattedVerbatimStringExpression();
            }
            else if (token instanceof $lex.InlineRegex) {
                r = new InlineRegexExpression();
            }
            else if (token instanceof $lex.FormattedRegex) {
                r = new FormattedRegexExpression();
            }
            else if (token instanceof $lex.InlineJs) {
                r = new InlineJsExpression();
            }
            else if (token instanceof $lex.FormattedJs) {
                r = new FormattedJsExpression();
            }
            else if (token instanceof $lex.True) {
                r = new BooleanExpression("true");
            }
            else if (token instanceof $lex.False) {
                r = new BooleanExpression("false");
            }
            else if (token instanceof $lex.Null) {
                r = new NullExpression();
            }
            else if (token instanceof $lex.Void) {
                r = new VoidExpression();
            }
            else if (token instanceof $lex.Arg) {
                r = new ArgExpression();
            }
            else if (token instanceof $lex.Fun) {
                r = new FunExpression();
            }
            else if (token instanceof $lex.Self) {
                r = new SelfExpression();
            }
            else if (token instanceof $lex.Me) {
                r = new MeExpression();
            }
            else if (token instanceof $lex.ClassMe) {
                r = new ClassMeExpression();
            }
            else if (token instanceof $lex.Super) {
                r = new SuperExpression();
            }
            else {
                throw new ParseSingleTokenError(lexPart);
            }
        }
        else if (
            lex.at(startIndex) instanceof $lex.NormalLeftParenthesis &&
            lex.at(startIndex).oppositeIndex === endIndex
        ) {
            r = this.build(lexPart.shrink());
        }
        else {
            for (let i = 0; i < this.precedence().length; i++) {
                let group = this.precedence()[i];
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
                throw new NoPatternMatchError(lexPart);
            }
        }
        return r.setLexPart(lexPart);
    }

    compile() {
        let bareCompiled = this.bareCompile();
        let jb = null;
        if (Array.isArray(bareCompiled)) {
            jb = new J(bareCompiled);
        }
        else if (typeof bareCompiled === "string") {
            jb = new J(bareCompiled).shareLexPart(this);
        }
        else if (bareCompiled instanceof J) {
            jb = bareCompiled;
        }
        else {
            throw new Error("Compile argument invalid.");
        }
        return new J(["(", jb, ")"]);
    }
}

export class AtomExpression extends Expression {
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
export class BinaryExpression extends Expression {
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
export class UnaryExpression extends Expression {
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

export class VariableExpression extends AtomExpression {
    bareCompile() {
        return this.value;
    }
}

export class NumberExpression extends AtomExpression {
    bareCompile() {
        return this.value;
    }
}

export class BooleanExpression extends AtomExpression {
    bareCompile() {
        return this.value;
    }
}

export class NullExpression extends AtomExpression {
    bareCompile() {
        return "null";
    }
}

export class VoidExpression extends AtomExpression {
    bareCompile() {
        return "undefined";
    }
}

export class ArgExpression extends AtomExpression {
    bareCompile() {
        if (this.getRoot().hasCompilerDirective("radical")) {
            return "arg_" + $node.antiConflictString + "[0]";
        }
        else {
            return "arg_" + $node.antiConflictString;
        }
    }
}

export class FunExpression extends AtomExpression {
    bareCompile() {
        return "fun_" + $node.antiConflictString;
    }
}

export class SelfExpression extends AtomExpression {
    bareCompile() {
        let statement = this.getAncestor($node.Statement);
        let treeAssignee = statement.assignees.value[0];

        // The assignee isn't an expression, so we should compile the main components of it.
        // That looks redundant to the assign statement, but essentially they are not the same,
        // for the compiled JS here is an expression, though the JS code is the same.
        if (treeAssignee instanceof $node.VariableAssignee) {
            return treeAssignee.variable.compile();
        }
        else if (treeAssignee instanceof $node.DotAssignee) {
            if (!statement.getUseBase1()) {
                throw new Error("\"self\" internal error.");
            }

            if (treeAssignee.y instanceof Expression || treeAssignee.y instanceof $node.SymbolMemberName) {
                if (!statement.getUseBase2()) {
                    throw new Error("\"self\" internal error.");
                }
                return new J(`base1_${$node.antiConflictString}[base2_${$node.antiConflictString}]`);
            }
            else {
                return new J(["base1_" + $node.antiConflictString + ".", treeAssignee.y.compile()]);
            }
        }
        else {
            throw new Error("\"self\" can't apply to this assignee.");
        }
    }
}

export class MeExpression extends AtomExpression {
    bareCompile() {
        return "this";
    }
}

export class ClassMeExpression extends AtomExpression {
    bareCompile() {
        let ancestors = this.getAncestors($node.ClassExpression);

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
        else if (thirdLevel.x.new) {
            return "new.target";
        }
        else {
            return "this.constructor";
        }
    }
}

export class SuperExpression extends AtomExpression {
    // We must override `compile`. If using `bareCompile`, then it will mis-add
    // an enclosing `()` to `super` so that it will be `(super)`, but this is illegal,
    // because `super` is not an expression in JS.
    compile() {
        let ancestors = this.getAncestors($node.ClassExpression);

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

        if (thirdLevel.x.new || (ancestors[0] instanceof $node.DotExpression && ancestors[0].x === this)) {
            return new J("super"); // because of this we can't use `bareCompile`
        }
        else {
            return new J(["(super.", thirdLevel.x.name.compile(), ")"]);
        }
    }
}

// This refers to `Str` token.
export class StringExpression extends AtomExpression {
    // Note: If the source code `"aaa"` compiles to JS `"aaa"`, then the left `"` in
    // the compiled JS will map to the first 'a' in source, not to the left `"`
    // in source. This is not a bug, because:
    // If we have interpolation, such as `"aaa\(a)bbb"` that compiles to `"aaa"+a+"bbb"`,
    // then you'll find the source `"` and the compiled `"` are not at the same level,
    // so they are not the same.
    bareCompile() {
        let callee = this.getAncestor($node.PseudoCallExpression).callee;
        if (callee instanceof InlineNormalStringExpression) {
            return "\"" + this.value + "\"";
        }
        else if (callee instanceof FormattedNormalStringExpression) {
            let value = this.value;
            value = value.replace(/\n/g, "\\n");

            // No need to consider "\x.." or "\u...." because we only handle the quotes.
            let escapeOpen = false;

            let r = "";
            for (let i = 0; i < value.length; i++) {
                if (!escapeOpen && value[i] === "\"") {
                    r += "\\" + value[i];
                }
                else {
                    r += value[i];
                }

                if (value[i] === "\\") {
                    escapeOpen = !escapeOpen;
                }
                else {
                    escapeOpen = false;
                }
            }
            return "\"" + r + "\"";
        }
        else if (callee instanceof InlineVerbatimStringExpression) {
            return JSON.stringify(this.value);
        }
        else if (callee instanceof FormattedVerbatimStringExpression) {
            return JSON.stringify(this.value);
        }
        else if (callee instanceof InlineRegexExpression) {
            return JSON.stringify(this.value);
        }
        else if (callee instanceof FormattedRegexExpression) {
            return JSON.stringify(this.value);
        }
        else if (callee instanceof InlineJsExpression) {
            return this.value;
        }
        else if (callee instanceof FormattedJsExpression) {
            return this.value;
        }
        else {
            throw new Error("String syntax error.");
        }
    }
}

// This refers to `PostQuote` token.
export class PostQuoteExpression extends AtomExpression {}

// This refers to `InlineNormalString` token.
export class InlineNormalStringExpression extends AtomExpression {}

export class FormattedNormalStringExpression extends AtomExpression {}

export class InlineVerbatimStringExpression extends AtomExpression {}

export class FormattedVerbatimStringExpression extends AtomExpression {}

export class InlineRegexExpression extends AtomExpression {}

export class FormattedRegexExpression extends AtomExpression {}

export class InlineJsExpression extends AtomExpression {}

export class FormattedJsExpression extends AtomExpression {}

export class ParseSingleTokenError extends $lex.SyntaxError {
    constructor(lexPart) {
        super(lexPart, "The single token can't be parsed as expression.");
    }
}

export class NoPatternMatchError extends $lex.SyntaxError {
    constructor(lexPart) {
        super(lexPart, "No pattern matches the possible expression.");
    }
}
