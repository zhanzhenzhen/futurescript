import {hub} from "./c-expression-hub-0.js";
import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $block from "./c-block-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import * as $statement from "./c-statement-0.js";
import * as $tools from "./c-tools-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

let Expression = hub.Expression = class extends $node.MappableNode {
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
                r = new hub.VariableExpression(lex.at(startIndex).value);
            }
            else if (token instanceof $lex.Num) {
                r = new hub.NumberExpression(lex.at(startIndex).value);
            }
            else if (token instanceof $lex.Str) {
                r = new hub.StringExpression(lex.at(startIndex).value);
            }
            else if (token instanceof $lex.PostQuote) {
                r = new hub.PostQuoteExpression(lex.at(startIndex).value);
            }
            else if (token instanceof $lex.InlineNormalString) {
                r = new hub.InlineNormalStringExpression();
            }
            else if (token instanceof $lex.FormattedNormalString) {
                r = new hub.FormattedNormalStringExpression();
            }
            else if (token instanceof $lex.InlineVerbatimString) {
                r = new hub.InlineVerbatimStringExpression();
            }
            else if (token instanceof $lex.FormattedVerbatimString) {
                r = new hub.FormattedVerbatimStringExpression();
            }
            else if (token instanceof $lex.InlineRegex) {
                r = new hub.InlineRegexExpression();
            }
            else if (token instanceof $lex.FormattedRegex) {
                r = new hub.FormattedRegexExpression();
            }
            else if (token instanceof $lex.InlineJs) {
                r = new hub.InlineJsExpression();
            }
            else if (token instanceof $lex.FormattedJs) {
                r = new hub.FormattedJsExpression();
            }
            else if (token instanceof $lex.True) {
                r = new hub.BooleanExpression("true");
            }
            else if (token instanceof $lex.False) {
                r = new hub.BooleanExpression("false");
            }
            else if (token instanceof $lex.Null) {
                r = new hub.NullExpression();
            }
            else if (token instanceof $lex.Void) {
                r = new hub.VoidExpression();
            }
            else if (token instanceof $lex.Arg) {
                r = new hub.ArgExpression();
            }
            else if (token instanceof $lex.Fun) {
                r = new hub.FunExpression();
            }
            else if (token instanceof $lex.Self) {
                r = new hub.SelfExpression();
            }
            else if (token instanceof $lex.Me) {
                r = new hub.MeExpression();
            }
            else if (token instanceof $lex.ClassMe) {
                r = new hub.ClassMeExpression();
            }
            else {
                throw new hub.ParseSingleTokenError(lexPart);
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
                throw new hub.NoPatternMatchError(lexPart);
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

let AtomExpression = hub.AtomExpression = class extends Expression {
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
hub.BinaryExpression = class extends Expression {
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
hub.UnaryExpression = class extends Expression {
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

hub.VariableExpression = class extends AtomExpression {
    rawCompile() {
        return this.value;
    }
}

hub.NumberExpression = class extends AtomExpression {
    rawCompile() {
        return this.value;
    }
}

hub.BooleanExpression = class extends AtomExpression {
    rawCompile() {
        return this.value;
    }
}

hub.NullExpression = class extends AtomExpression {
    rawCompile() {
        return "null";
    }
}

hub.VoidExpression = class extends AtomExpression {
    rawCompile() {
        return "undefined";
    }
}

hub.ArgExpression = class extends AtomExpression {
    rawCompile() {
        if (this.getRoot().hasCompilerDirective("radical")) {
            return "arg_" + $block.antiConflictString + "[0]";
        }
        else {
            return "arg_" + $block.antiConflictString;
        }
    }
}

hub.FunExpression = class extends AtomExpression {
    rawCompile() {
        return "fun_" + $block.antiConflictString;
    }
}

hub.SelfExpression = class extends AtomExpression {
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

hub.MeExpression = class extends AtomExpression {
    rawCompile() {
        return "this";
    }
}

hub.ClassMeExpression = class extends AtomExpression {
    rawCompile() {
        let ancestors = this.getParent(hub.ClassExpression, true);

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
hub.StringExpression = class extends AtomExpression {
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
hub.PostQuoteExpression = class extends AtomExpression {}

// This refers to `InlineNormalString` token.
hub.InlineNormalStringExpression = class extends AtomExpression {}

hub.FormattedNormalStringExpression = class extends AtomExpression {}

hub.InlineVerbatimStringExpression = class extends AtomExpression {}

hub.FormattedVerbatimStringExpression = class extends AtomExpression {}

hub.InlineRegexExpression = class extends AtomExpression {}

hub.FormattedRegexExpression = class extends AtomExpression {}

hub.InlineJsExpression = class extends AtomExpression {}

hub.FormattedJsExpression = class extends AtomExpression {}

hub.ParseSingleTokenError = class extends $lex.SyntaxError {
    constructor(lexPart) {
        super(lexPart, "The single token can't be parsed as expression.");
    }
}

hub.NoPatternMatchError = class extends $lex.SyntaxError {
    constructor(lexPart) {
        super(lexPart, "No pattern matches the possible expression.");
    }
}
