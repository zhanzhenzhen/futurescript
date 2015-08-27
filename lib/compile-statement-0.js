import * as $lex from "./compile-lex-0";
import * as $expression from "./compile-expression-0";

export class Statement {
    static build(lex, startIndex, endIndex) {
        let r = null;
        r = AssignStatement.build(lex, startIndex, endIndex);
        if (r === null) {
            r = $expression.Expression.build(lex, startIndex, endIndex);
        }
        return r;
    }

    static indent(lex, index) {
        for (let i = index; i >= 0; i--) {
            if (lex[i] instanceof $lex.Indent) {
                return lex[i].value;
            }
        }
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

    static build(lex, startIndex, endIndex) {
        let pos = lex.search($lex.Colon);
        if (pos !== null) {
            return new AssignStatement(
                lex[pos - 1].value,
                $expression.Expression.build(lex, pos + 1, endIndex)
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
