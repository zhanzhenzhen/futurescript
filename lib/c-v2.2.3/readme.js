/*

1. Compiler directives can only be applied after the tree is built, for example when generating JS in `compile` method (or in `bareCompile`, etc) or when modifying the tree in `complyWithJs` method. Compiler directives can't be applied when building the tree. The reason is because of our concept: The built tree (before being modified) should remain the same regardless of the compiler directives.

2. Lex doesn't change orders. That means any two tokens in the lex are in the same order as the raw input.

3. There are 3 main concepts in the compiler: lex, tree, and JS builder. Raw input compiles to lex. Lex compiles to tree. Tree compiles to JS code (and optionally produces source map) using JS builder.

4. Tree consists of nodes. The most important kinds of nodes are block, statement, and expression. Block's child must be statement. Statement's parent must be block.

5. For `Node` and all its child classes, because they are separated into many files, it's prone to cyclic dependencies problem. To avoid this, we use such mechanism:

(1) Child module (i.e. module of child or base classes) can refer to its parent without restriction. Parent can also import child, but parent using child's exports is only limited to "inside function", that is, parent can't run child code when module loading.

(2) In these 2 modules "node" and "expression", we use re-exports. Each of these 2 is considered as child of any of its re-exported module. (In this concept a module can have many parents.)

(3) The only node module that non-node modules can import is "node", which contains all of its parent's exports. Don't confuse the "node.js" file with the famous Node.js platform. It's not about that.

6. There may be a "ref" variable (the actual name can be another) in the compiled code. If the compiler doesn't follow the rule of how to use it, this variable will be messed up - that will cause bugs in the compiler. The rule is: for a compiled expression, the assignment and the use of this variable must be consecutive (i.e. there can't be other compiled expressions in-between).

For example:

`a < b < (c ifvoid 1)` can be compiled to:

a < (ref = b) && ref < ((ref = c) === undefined ? 1 : ref)

But it can't be compiled to:

a < (ref = b) && ((ref = c) === undefined ? 1 : ref) > ref

This is because when evaluating the right-most `ref`, it isn't `b` but `c`, which is incorrect.

*/
