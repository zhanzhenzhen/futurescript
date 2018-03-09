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
    }

    setParent(node) {
        this._parent = node;
    }

    // Takes 0, 1, or 2 arguments.
    // If no argument, then returns the parent.
    // If 1 argument, it can be a type, or a selector function. Returns the ancestor matching it.
    // If 2 arguments, and the second argument is `true`, it will return all ancestors from
    // this node (excluding) through the matching ancestor (including) in an array. Setting the
    // second argument to false is equal to the 1-argument syntax.
    // TODO: The functionality doesn't fully match the method name. Need refactor.
    getParent() {
        let arg = arguments[0];
        let returnsArray = arguments[1] === true ? true : false;
        if (arg === undefined) {
            return this._parent;
        }
        else if (typeof arg === "function") {
            let next = this._parent;
            let stack = [next];
            while (next !== null && !($tools.classIsClass(arg, Node) ? next instanceof arg : arg(next))) {
                next = next._parent;
                stack.push(next);
            }
            return returnsArray ? stack : next;
        }
        else {
            throw new Error("Argument invalid.");
        }
    }

    getRoot() {
        let next = this;
        while (next._parent !== null) {
            next = next._parent;
        }
        return next;
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
        let statement = assignee.getParent($node.Statement);
        let useBase = statement instanceof $node.AssignStatement && statement.getUseBase();
        let obj = useBase ? "base_" + $node.antiConflictString : assignee.x.compile();
        if (
            assignee.y instanceof $node.Expression ||
            assignee.y instanceof $node.SymbolMemberName
        ) {
            second = new J([obj, "[", assignee.y.compile(), "]"]);
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

export let compileWrapperFunction = (innerJb, node) => {
    let ancestor = node.getParent($node.FunctionExpression);
    if (ancestor !== null && ancestor.getAsync()) {
        return new J([
            `yield asyncToGenerator_${$node.antiConflictString}.call(this,function*(){`,
            innerJb,
            "})"
        ]);
    }
    else {
        return new J(["(()=>{", innerJb, "})()"]);
    }
};
