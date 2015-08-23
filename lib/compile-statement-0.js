import * as $expression from "./compile-expression-0";

export class Statement {
    static build(codeLines, range) {
        let r = null;
        r = AssignStatement.build(codeLines, range);
        if (r === null) {
            r = $expression.Expression.build(codeLines, range);
        }
        return r;
    }

    print(level = 0) {
        return "    ".repeat(level) + this.constructor.name + " {\n" +
        Object.keys(this).map(key =>
            "    ".repeat(level + 1) + key + ": " +
            this[key].constructor.name + " " + this[key].print(level + 1)
        ) +
        "    ".repeat(level) + "}\n";
    }
};

// Every subclass must have a `expression` property.
export class ExpressionStatement extends Statement {
    print(level = 0) {
        return "    ".repeat(level) + this.expression.print(level).replace(/[^{ ]+/, this.constructor.name);
    }
};

export class AssignStatement extends Statement {
    constructor(assignee, value) {
        super();
        this.assignee = assignee;
        this.value = value;
    }

    static build(codeLines, range) {
        let pos = codeLines[range.startLine].code.search(":");
        if (pos !== -1) {
            return new AssignStatement(
                codeLines[range.startLine].code.substr(0, pos - 1),
                $expression.Expression.build(codeLines, {
                    startLine: range.startLine,
                    startColumn: pos + 1,
                    endLine: range.endLine,
                    endColumn: range.endColumn
                })
            );
        }
        else {
            return null;
        }
    }
};

export class CallStatement extends ExpressionStatement {
    constructor(callee, arguments) {
        super();
        this.expression = new $expression.CallExpression(callee, arguments);
    }
};

export class IfStatement extends ExpressionStatement {
    constructor(condition, thenBranch, elseBranch) {
        super();
        this.expression = new $expression.IfExpression(condition, thenBranch, elseBranch);
    }
};
