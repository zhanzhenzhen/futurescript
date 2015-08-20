import * as $expression from "./compile-expression-0";

export class Statement {
    print(level = 0) {
        return this.constructor.name + " {\n" +
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
        let message = this.expression.print(level);
        let pos = message.indexOf("{");
        return this.constructor.name + " " + message.substr(pos);
    }
};

export class AssignStatement extends Statement {
    constructor(assignee, value) {
        super();
        this.assignee = assignee;
        this.value = value;
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
