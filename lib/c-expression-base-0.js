import {face} from "./c-expression-face-0.js";
import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $block from "./c-block-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import * as $statement from "./c-statement-0.js";
import * as $tools from "./c-tools-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

let Expression = face.Expression = class extends $node.MappableNode {
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
                r = new face.VariableExpression(lex.at(startIndex).value);
            }
            else if (token instanceof $lex.Num) {
                r = new face.NumberExpression(lex.at(startIndex).value);
            }
            else if (token instanceof $lex.Str) {
                r = new face.StringExpression(lex.at(startIndex).value);
            }
            else if (token instanceof $lex.PostQuote) {
                r = new face.PostQuoteExpression(lex.at(startIndex).value);
            }
            else if (token instanceof $lex.InlineNormalString) {
                r = new face.InlineNormalStringExpression();
            }
            else if (token instanceof $lex.FormattedNormalString) {
                r = new face.FormattedNormalStringExpression();
            }
            else if (token instanceof $lex.InlineVerbatimString) {
                r = new face.InlineVerbatimStringExpression();
            }
            else if (token instanceof $lex.FormattedVerbatimString) {
                r = new face.FormattedVerbatimStringExpression();
            }
            else if (token instanceof $lex.InlineRegex) {
                r = new face.InlineRegexExpression();
            }
            else if (token instanceof $lex.FormattedRegex) {
                r = new face.FormattedRegexExpression();
            }
            else if (token instanceof $lex.InlineJs) {
                r = new face.InlineJsExpression();
            }
            else if (token instanceof $lex.FormattedJs) {
                r = new face.FormattedJsExpression();
            }
            else if (token instanceof $lex.True) {
                r = new face.BooleanExpression("true");
            }
            else if (token instanceof $lex.False) {
                r = new face.BooleanExpression("false");
            }
            else if (token instanceof $lex.Null) {
                r = new face.NullExpression();
            }
            else if (token instanceof $lex.Void) {
                r = new face.VoidExpression();
            }
            else if (token instanceof $lex.Arg) {
                r = new face.ArgExpression();
            }
            else if (token instanceof $lex.Fun) {
                r = new face.FunExpression();
            }
            else if (token instanceof $lex.Self) {
                r = new face.SelfExpression();
            }
            else if (token instanceof $lex.Me) {
                r = new face.MeExpression();
            }
            else if (token instanceof $lex.ClassMe) {
                r = new face.ClassMeExpression();
            }
            else {
                throw new face.ParseSingleTokenError(lexPart);
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
                throw new face.NoPatternMatchError(lexPart);
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

let AtomExpression = face.AtomExpression = class extends Expression {
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
face.BinaryExpression = class extends Expression {
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
face.UnaryExpression = class extends Expression {
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

face.VariableExpression = class extends AtomExpression {
    rawCompile() {
        return this.value;
    }
}

face.NumberExpression = class extends AtomExpression {
    rawCompile() {
        return this.value;
    }
}

face.BooleanExpression = class extends AtomExpression {
    rawCompile() {
        return this.value;
    }
}

face.NullExpression = class extends AtomExpression {
    rawCompile() {
        return "null";
    }
}

face.VoidExpression = class extends AtomExpression {
    rawCompile() {
        return "undefined";
    }
}

face.ArgExpression = class extends AtomExpression {
    rawCompile() {
        if (this.getRoot().hasCompilerDirective("radical")) {
            return "arg_" + $block.antiConflictString + "[0]";
        }
        else {
            return "arg_" + $block.antiConflictString;
        }
    }
}

face.FunExpression = class extends AtomExpression {
    rawCompile() {
        return "fun_" + $block.antiConflictString;
    }
}

face.SelfExpression = class extends AtomExpression {
    rawCompile() {
        let treeAssignee = this.getParent($statement.Statement).assignees.value[0];

        // The assignee isn't an expression, so we should compile the main components of it.
        // That looks redundant to the assign statement, but essentially they are not the same,
        // for the compiled JS here is an expression, though the JS code is the same.
        if (treeAssignee instanceof $node.VariableAssignee) {
            return treeAssignee.variable.compile();
        }
        else if (treeAssignee instanceof $node.DotAssignee) {
            if (treeAssignee.y instanceof Expression) {
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

face.MeExpression = class extends AtomExpression {
    rawCompile() {
        return "this";
    }
}

face.ClassMeExpression = class extends AtomExpression {
    rawCompile() {
        let ancestors = this.getParent($expressionClass.ClassExpression, true);

        let firstLevel = ancestors[ancestors.length - 1];
        if (firstLevel === null) {
            throw new Error();
        }

        let secondLevel = ancestors[ancestors.length - 2];
        let thirdLevel = ancestors[ancestors.length - 3];
        if (!(
            secondLevel instanceof $node.Arr &&
            thirdLevel instanceof $node.Xy
        ) {
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

// This refers to `Str` token.
face.StringExpression = class extends AtomExpression {
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
face.PostQuoteExpression = class extends AtomExpression {}

// This refers to `InlineNormalString` token.
face.InlineNormalStringExpression = class extends AtomExpression {}

face.FormattedNormalStringExpression = class extends AtomExpression {}

face.InlineVerbatimStringExpression = class extends AtomExpression {}

face.FormattedVerbatimStringExpression = class extends AtomExpression {}

face.InlineRegexExpression = class extends AtomExpression {}

face.FormattedRegexExpression = class extends AtomExpression {}

face.InlineJsExpression = class extends AtomExpression {}

face.FormattedJsExpression = class extends AtomExpression {}

face.ParseSingleTokenError = class extends $lex.SyntaxError {
    constructor(lexPart) {
        super(lexPart, "The single token can't be parsed as expression.");
    }
}

face.NoPatternMatchError = class extends $lex.SyntaxError {
    constructor(lexPart) {
        super(lexPart, "No pattern matches the possible expression.");
    }
}
