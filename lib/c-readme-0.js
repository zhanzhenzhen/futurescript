/*

1. Compiler directives can only be applied after the tree is built, for example when generating JS in `compile` method (or in `rawCompile`, etc) or when modifying the tree in `complyWithJs` method. Compiler directives can't be applied when building the tree. The reason is because of our concept: The built tree (before being modified) should remain the same regardless of the compiler directives.

2. Lex doesn't change orders. That means any two tokens in the lex are in the same order as the raw input.

3. There are 3 main concepts in the compiler: lex, tree, and JS builder. Raw input compiles to lex. Lex compiles to tree. Tree compiles to JS code (and optionally produces source map) using JS builder.

4. Tree consists of nodes. The most important kinds of nodes are block, statement, and expression. Block's child must be statement. Statement's parent must be block.

5. For `Node` and all its child classes, because they are separated into many files, it's prone to cyclic dependencies problem. To avoid this, we use such mechanism: Child module (i.e. module of mostly child or base classes) can refer to its parent without restriction. Parent can also import child, but parent using child's exports is only limited to "inside function", that is, parent can't run child code when module loading.

6. For an outer module like "c-node" and "c-expression", we use re-exports. But the order is important. Child must be before parent. The base must be in the end. This is also to avoid cyclic problem.

*/
