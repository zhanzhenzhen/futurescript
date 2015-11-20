import * as $lex from "./c-lex-0.js";
import * as $node from "./c-node-0.js";
import * as $block from "./c-block-0.js";
import * as $pattern from "./c-pattern-0.js";
import * as $print from "./c-print-0.js";
import * as $statement from "./c-statement-0.js";
import * as $expressionBase from "./c-expression-base-0.js";
import {JsBuilder as J} from "./c-js-builder-0.js";

export class TryExpression extends $expressionBase.Expression {
    constructor(tryBranch, catchVar, catchBranch, finallyBranch) {
        super();
        this.tryBranch = tryBranch;
        this.catchVar = catchVar;
        this.catchBranch = catchBranch;
        this.finallyBranch = finallyBranch;
    }

    static patternsAndCaptures() {
        return [
            [[$lex.Try, $pattern.any, $lex.Catch, $lex.NormalToken, $pattern.any,
                $lex.Finally, $pattern.any], [1, 3, 4, 6]],
            [[$lex.Try, $pattern.any, $lex.Catch, $pattern.any,
                $lex.Finally, $pattern.any], [1, null, 3, 5]],
            [[$lex.Try, $pattern.any, $lex.Catch, $lex.NormalToken, $pattern.any], [1, 3, 4, null]],
            [[$lex.Try, $pattern.any, $lex.Catch, $pattern.any], [1, null, 3, null]],
            [[$lex.Try, $pattern.any, $lex.Finally, $pattern.any], [1, null, null, 3]],
            [[$lex.Try, $pattern.any], [1, null, null, null]]
        ];
    }

    static applyMatch(match, lex) {
        return new this(
            $statement.Statement.buildBlock(lex.part(match[0])),
            match[1] === null ? null : new $node.VariableAssignee({
                variable: new $node.Piece(lex.part(match[1])),
                export: false,
                ifvoid: false,
                ifnull: false
            }),
            $statement.Statement.buildBlock(lex.part(match[2])),
            $statement.Statement.buildBlock(lex.part(match[3]))
        );
    }

    rawCompile() {
        let internalCatchVar = "catch_" + $block.antiConflictString;
        let catchVarAssign = new J([
            this.variable.compile(),
            "=" + internalCatchVar,
            ";"
        ]);
        return [
            "(function(){try {return ",
            this.tryBranch.compile(),
            "} catch (" + internalCatchVar + ") {return ",
            this.catchVarAssign,
            this.catchBranch.compile(),
            "} finally {",
            this.finallyBranch.compile(),
            "}})()"
        ];
    }
}
