import * as $lex from "./lex.js";
import * as $node from "./node.js";
import * as $base from "./expression-base.js";
import * as $pattern from "./pattern.js";
import * as $print from "./print.js";
import {JsBuilder as J} from "./js-builder.js";

export class TryExpression extends $base.Expression {
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
            $node.Statement.buildBlock(lex.part(match[0])),
            match[1] === null ? null : new $node.VariableAssignee({
                variable: new $node.LocalVariable(lex.part(match[1]))
            }),
            $node.Statement.buildBlock(lex.part(match[2])),
            $node.Statement.buildBlock(lex.part(match[3]))
        );
    }

    bareCompile() {
        let internalCatchVar = "catch_" + $node.antiConflictString;
        let catchVarAssign = this.catchVar === null ? "" : new J([
            this.catchVar.variable.compile(),
            "=" + internalCatchVar,
            ";"
        ]);
        let catchBranch = this.catchBranch === null ? "" : new J([
            "return ",
            this.catchBranch.compile(),
            ";"
        ]);
        let finallyBranch = this.finallyBranch === null ? "" : new J([
            this.finallyBranch.compile(),
            ";"
        ]);
        return $node.compileWrapperFunction(
            new J([
                "try {return ",
                this.tryBranch.compile(),
                ";} catch (" + internalCatchVar + ") {",
                catchVarAssign,
                catchBranch,
                "} finally {",
                finallyBranch,
                "}"
            ]),
            this
        );
    }
}
