import * as $lex from "./compile-lex-0";
import * as $expression from "./compile-expression-0";
import * as $pattern from "./compile-pattern-0";

export class Statement {
    static build(lexPart, parentBlock) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        let r = null;
        r = AssignStatement.build(lexPart, parentBlock);
        if (r === null) {
            r = ExpressionStatement.build(lexPart, parentBlock);
        }
        return r;
    }

    static indent(lex, index) {
        for (let i = index; i >= 0; i--) {
            if (lex.at(i) instanceof $lex.Indent) {
                return lex.at(i).value;
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
    constructor(expression) {
        super();
        this.expression = expression;
    }

    static build(lexPart, parentBlock) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        let expression = $expression.Expression.build(lexPart, parentBlock);
        if (expression !== null) {
            return new ExpressionStatement(expression);
        }
        else {
            return null;
        }
    }

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

    static build(lexPart, parentBlock) {
        let lex = lexPart.lex;
        let startIndex = lexPart.startIndex;
        let endIndex = lexPart.endIndex;

        console.log("assign", startIndex, endIndex);
        let colonPos = $pattern.Pattern.search($lex.Colon, lex, startIndex, endIndex);
        if (colonPos !== null) {
            return new AssignStatement(
                $expression.Expression.build({
                    lex: lex,
                    startIndex: startIndex,
                    endIndex: colonPos - 1
                }, parentBlock),
                $expression.Expression.build({
                    lex: lex,
                    startIndex: colonPos + 1,
                    endIndex: endIndex
                }, parentBlock)
            );
        }
        else {
            return null;
        }
    }
};

export class CallStatement extends ExpressionStatement {
    constructor(callee, args) {
        super();
        this.expression = new $expression.CallExpression(callee, args);
    }
};

export class IfStatement extends ExpressionStatement {
    constructor(condition, thenBranch, elseBranch) {
        super();
        this.expression = new $expression.IfExpression(condition, thenBranch, elseBranch);
    }
};
