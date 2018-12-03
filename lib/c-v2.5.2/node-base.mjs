import * as $tools from "./tools.mjs";
import * as $print from "./print.mjs";
import * as $node from "./node.mjs";
import * as $lex from "./lex.mjs";
import * as $pattern from "./pattern.mjs";
import {JsBuilder as J} from "./js-builder.mjs";

export class Node {
    constructor(obj) {
        if (obj !== undefined && obj !== null) {
            Object.keys(obj).forEach(key => {
                this[key] = obj[key];
            });
        }
        this.setHasWaitBehavior(false);
    }

    setParent(node) {
        this._parent = node;
    }

    getParent() {
        return this._parent;
    }

    // Takes 0, 1, or 2 arguments.
    // If no argument, returns all ancestors.
    // `untilMatch` (if present) can be a type, or a selector function.
    // If the match is not found, returns all ancestors.
    // The order of the traverse and the returned array are both from leaf to root.
    getAncestors(untilMatch, includesMatched = true) {
        let next = this;
        let stack = [];
        while (true) {
            next = next._parent;
            if (next === null) break;
            let found =
                untilMatch === undefined ?
                false :
                ($tools.classIsClass(untilMatch, Node) ? next instanceof untilMatch : untilMatch(next));
            if (!found || includesMatched) {
                stack.push(next);
            }
            if (found) break;
        }
        return stack;
    }

    // `match` can be a type, or a selector function.
    // If not found, returns null.
    // Traverse order is from leaf to root.
    getAncestor(match) {
        let next = this;
        while (true) {
            next = next._parent;
            if (next === null) return null;
            let found = $tools.classIsClass(match, Node) ? next instanceof match : match(next);
            if (found) return next;
        }
    }

    getRoot() {
        let next = this;
        while (next._parent !== null) {
            next = next._parent;
        }
        return next;
    }

    // A node N having "wait behavior" means N has at least one "wait" expression E inside N satisfying
    // that there's no function expression in the hierarchical chain between N (excluding) and E.
    setHasWaitBehavior(hasWaitBehavior) {
        this._hasWaitBehavior = hasWaitBehavior;
    }

    getHasWaitBehavior() {
        return this._hasWaitBehavior;
    }

    toString(level = 0) {
        return $print.printObject(this, this.constructor, level);
    }
}

export class MappableNode extends Node {
    setLexPart(lexPart) {
        this._lexPart = lexPart;
        return this;
    }

    getLexPart() {
        return this._lexPart;
    }
}

// Piece is not an expression, statement or block. It's a simple node that
// the source and the compiled code look the same (unless renamed to avoid conflict).
export class Piece extends MappableNode {
    constructor() {
        super();
        let arg = arguments[0];
        if (typeof arg === "string") {
            this.value = arg;
        }
        else if (arg instanceof $lex.LexPart) {
            if (arg.token() instanceof $lex.InlineNormalString) {
                this.value = "\"" + arg.lex.at(arg.startIndex + 2).value + "\"";
            }
            else {
                this.value = arg.token().value;
            }
            this.setLexPart(arg);
        }
        else if (arg instanceof Piece) {
            this.value = arg.value;
            this.setLexPart(arg.getLexPart());
        }
    }

    compile() {
        return new J(this.value).shareLexPart(this);
    }

    toString() {
        return $print.printAtom(this);
    }
}

export class Arr extends Node {
    constructor(value) {
        super();
        this.value = value;
    }

    toString(level = 0) {
        return $print.printArray(this.value, this.constructor, level);
    }
}

export class Xy extends Node {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }
}

export class LocalVariable extends Piece {}

export class VariableAssignee extends Node {
    // `obj` has 4 properties: variable, export, ifvoid, ifnull. Only `variable` is mandatory,
    // others are all optional defaulting to `false`.
    constructor(obj) {
        if (obj.export === undefined) {
            obj.export = false;
        }
        if (obj.ifvoid === undefined) {
            obj.ifvoid = false;
        }
        if (obj.ifnull === undefined) {
            obj.ifnull = false;
        }
        super(obj);
    }
}

export class DotAssignee extends Node {
    // `obj` has 5 properties: x, y, export, ifvoid, ifnull. `x` and `y` are mandatory,
    // others are all optional defaulting to `false`.
    constructor(obj) {
        if (obj.export === undefined) {
            obj.export = false;
        }
        if (obj.ifvoid === undefined) {
            obj.ifvoid = false;
        }
        if (obj.ifnull === undefined) {
            obj.ifnull = false;
        }
        super(obj);
    }
}

export class BracketAssignees extends Arr {}

export class ArrowArgument extends Node {
    // `obj` has 3 properties: variable, voidDefault, nullDefault. Only `variable` is mandatory,
    // others are all optional defaulting to `null`.
    constructor(obj) {
        if (obj.voidDefault === undefined) {
            obj.voidDefault = null;
        }
        if (obj.nullDefault === undefined) {
            obj.nullDefault = null;
        }
        super(obj);
    }
}

export class MemberKey extends Node {
    // `obj` has 5 properties: name, new, static, get, set. All are optional.
    // `name` defaults to `null`. Others defaults to `false`.
    constructor(obj) {
        if (obj.name === undefined) {
            obj.name = null;
        }
        if (obj.new === undefined) {
            obj.new = false;
        }
        if (obj.static === undefined) {
            obj.static = false;
        }
        if (obj.get === undefined) {
            obj.get = false;
        }
        if (obj.set === undefined) {
            obj.set = false;
        }
        super(obj);
    }
}

export class SymbolMemberName extends Piece {}

export class OrPattern extends Arr {}

export class AndPattern extends Arr {}

export class CompareOperator extends MappableNode {
    toString() {
        return $print.printAtom(this);
    }
}
export class Equal extends CompareOperator {}
export class NotEqual extends CompareOperator {}
export class LessThan extends CompareOperator {}
export class GreaterThan extends CompareOperator {}
export class LessThanOrEqual extends CompareOperator {}
export class GreaterThanOrEqual extends CompareOperator {}

export class CallSpread extends MappableNode {
    constructor(value) {
        super();
        this.value = value;
    }

    compile() {
        return new J(["...", this.value.compile()]).shareLexPart(this);
    }
}

export class NestedBracketAssigneesError extends $lex.SyntaxError {
    constructor(lexPart) {
        super(lexPart, "Destructuring assignment can't be nested.");
    }
}

export class ExportWithIfvoidIfnullError extends $lex.SyntaxError {
    constructor(lexPart) {
        super(lexPart, "`'export` can't coexist with `ifvoid` and `ifnull`.");
    }
}

export class BracketWithIfvoidIfnullError extends $lex.SyntaxError {
    constructor(lexPart) {
        super(lexPart, "Destructuring assignment can't coexist with `ifvoid` and `ifnull`.");
    }
}

// This can build an assignee, or a `BracketAssignees` instance.
export let buildAssignee = (lexPart, ifvoidOn, ifnullOn, allowsBracket = true) => {
    let lex = lexPart.lex;
    let startIndex = lexPart.startIndex;
    let endIndex = lexPart.endIndex;

    let exportOn = false;
    if (
        lex.at(endIndex - 1) instanceof $lex.NormalVariant &&
        lex.at(endIndex) instanceof $lex.NormalToken &&
        lex.at(endIndex).value === "export"
    ) {
        if (ifvoidOn || ifnullOn) {
            throw new ExportWithIfvoidIfnullError(lex.part(endIndex, endIndex));
        }
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
        let y = null;
        if (lex.at(dotMatch[1].startIndex) instanceof $lex.LeftParenthesis) {
            y = $node.Expression.build(lex.part(dotMatch[1]).shrink());
        }
        else if (
            (
                lex.at(dotMatch[0].endIndex) instanceof $lex.Me ||
                lex.at(dotMatch[0].endIndex) instanceof $lex.ClassMe
            ) &&
            (
                lex.at(dotMatch[1].startIndex) instanceof $lex.NormalToken &&
                lex.at(dotMatch[1].startIndex).value.startsWith("_")
            )
        ) {
            y = new SymbolMemberName(lex.part(dotMatch[1]));
        }
        else {
            y = new Piece(lex.part(dotMatch[1]));
        }
        return new DotAssignee({
            x: $node.Expression.build(lex.part(dotMatch[0])),
            y: y,
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
            if (!allowsBracket) {
                throw new NestedBracketAssigneesError(lex.part(startIndex, endIndex));
            }
            if (ifvoidOn || ifnullOn) {
                throw new BracketWithIfvoidIfnullError(lex.part(startIndex, endIndex));
            }
            let elementRanges = $pattern.Pattern.split(
                [$lex.Comma, $lex.Semicolon],
                lex.part(bracketMatch[0]).shrink()
            );
            return new BracketAssignees(
                elementRanges.map(m => buildAssignee(lex.part(m), ifvoidOn, ifnullOn, false))
            );
        }
        else {
            return new VariableAssignee({
                variable: new LocalVariable(lexPart),
                export: exportOn,
                ifvoid: ifvoidOn,
                ifnull: ifnullOn
            });
        }
    }
};

// This can compile an assignee, or a `BracketAssignees` instance.
export let compileAssignee = (assignee) => {
    let root = assignee.getRoot();

    let first = null;
    if (assignee instanceof $node.VariableAssignee && assignee.export) {
        let external = assignee.export instanceof Piece ? assignee.export : assignee.variable;
        if (
            root.hasCompilerDirective("node modules") ||
            root.hasCompilerDirective("node import")
        ) {
            first = new J([
                "exports.", external.compile()
            ]);
        }
        else {
            root.loweredCompiled +=
                "export {" + assignee.variable.compile().js + " as " + external.compile().js + "};";
        }
    }

    let second = null;
    if (assignee instanceof $node.BracketAssignees) {
        second = new J([
            "[",
            new J(assignee.value.map(m => compileAssignee(m)), ","),
            "]"
        ]);
    }
    else if (assignee instanceof $node.DotAssignee) {
        let statement = assignee.getAncestor($node.Statement);
        let useBase1 = statement instanceof $node.AssignStatement && statement.getUseBase1();
        let useBase2 = statement instanceof $node.AssignStatement && statement.getUseBase2();
        let obj = useBase1 ? "base1_" + $node.antiConflictString : assignee.x.compile();
        if (
            assignee.y instanceof $node.Expression ||
            assignee.y instanceof $node.SymbolMemberName
        ) {
            let rightPart = useBase2 ? "base2_" + $node.antiConflictString : assignee.y.compile();
            second = new J([obj, "[", rightPart, "]"]);
        }
        else {
            second = new J([obj, ".", assignee.y.compile()]);
        }
    }
    else {
        second = assignee.variable.compile();
    }

    if (first === null) {
        return second;
    }
    else {
        return new J([first, "=", second]);
    }
};

// This trick is to avoid JS's bad feature of "folding" promises.
let useAsyncTrick = node =>
    !(node instanceof $node.FunctionExpression) &&
    !(node instanceof $node.Block && node.getParent() instanceof $node.FunctionExpression) &&
    node.getHasWaitBehavior()
;

// `innerJb` can also be a string.
// `asyncTangle` is a function expression or null. If it's not null, then whether the wrapper function
// is async will be determined by whether `asyncTangle` is async.
// Important: `applyWrapperFunction` and `applyReturn` must be used together, and the former's `node`
// and the latter's `container` must be the same.
export let applyWrapperFunction = (innerJb, node, asyncTangle = null) => {
    if (useAsyncTrick(node)) {
        return new J(["(await (async()=>{", innerJb, "})())[0]"]);
    }
    else if (asyncTangle !== null && asyncTangle.getAsync()) {
        return new J(["(async()=>{", innerJb, "})()"]);
    }
    else {
        return new J(["(()=>{", innerJb, "})()"]);
    }
};

// `jb` can also be a string.
export let applyReturn = (jb, container) => {
    if (useAsyncTrick(container)) {
        /*
        In some cases, we compile a non-function block that has `'wait` to `await async () => {...}`
        JS code. But because JS has a bad feature of "folding" promises, adding a wrapper function
        may cause a promise to be "waited" unexpectedly, if that non-function block's last statement
        is that promise. We use a trick (an array wrapper) to avoid this problem.
        This trick is invented by a contributor of CoffeeScript. Details of the trick:
        https://github.com/jashkenas/coffeescript/issues/5029
        */
        return new J(["return [", jb, "];"]);
    }
    else {
        return new J(["return ", jb, ";"]);
    }
};
