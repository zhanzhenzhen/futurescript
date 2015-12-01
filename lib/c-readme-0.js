/*

1. Compiler directives can only be applied after the tree is built, for example when generating JS in `compile` method (or in `rawCompile`, etc) or when modifying the tree in `complyWithJs` method. Compiler directives can't be applied when building the tree. The reason is because of our concept: The built tree (before being modified) should remain the same regardless of the compiler directives.

2. Lex doesn't change orders. That means any two tokens in the lex are in the same order as the raw input.

3. There are 3 main concepts in the compiler: lex, tree, and JS builder. Raw input compiles to lex. Lex compiles to tree. Tree compiles to JS code (and optionally produces source map) using JS builder.

4. Tree consists of nodes. The most important kinds of nodes are block, statement, and expression. Block's child must be statement. Statement's parent must be block.

*/
