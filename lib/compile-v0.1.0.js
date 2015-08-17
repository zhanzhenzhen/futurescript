/*
a: 123
b: 456
console.log(a + b)

RootBlock [
    AssignStatement {
        assignee: "a"
        value: NumberExpression "123"
    }
    AssignStatement {
        assignee: "b"
        value: NumberExpression "456"
    }
    CallStatement {
        callee: DotExpression [
            VariableExpression "console"
            "log"
        ]
        arguments: [
            AddExpression [
                VariableExpression "a"
                VariableExpression "b"
            ]
        ]
    }
]
*/
export default function(input) {
    for (let i = 0; i < input.code.length; i++) {
    }
    return {code: "haha", sourceMap: null};
};
