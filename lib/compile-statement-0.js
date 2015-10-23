import * as $lex from "./compile-lex-0";
import * as $expression from "./compile-expression-0";
import * as $pattern from "./compile-pattern-0";
import * as $print from "../lib/compile-print-0";

export class Arr {
    constructor(value) {
        this.value = value;
    }

    print(level = 0) {
        return $print.printArray(this.value, this.constructor, level);
    }
}

export class Atom {
    constructor(value) {
        this.value = value;
    }

    print() {
        return $print.printAtom(this);
    }
}

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
        if (r === null) {
            throw new Error("Unrecognized statement.");
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
        return $print.printObject(this, this.constructor, level);
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

        let match = $pattern.Pattern.searchPattern(
            [$pattern.Tokens, $lex.Colon, $pattern.Tokens],
            lexPart,
            false
        );
        if (match !== null) {
            return new AssignStatement(
                $expression.Expression.build({
                    lex: lex,
                    startIndex: startIndex,
                    endIndex: match[1] - 1
                }, parentBlock),
                $expression.Expression.build({
                    lex: lex,
                    startIndex: match[2],
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
