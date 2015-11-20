/*

1. Compiler directives can only be applied after the tree is built, for example when generating JS in `compile` method (or in `rawCompile`, etc) or when modifying the tree in `complyWithJs` method. Compiler directives can't be applied when building the tree. The reason is because of our concept: The built tree (before being modified) should remain the same regardless of the compiler directives.

2. Lex doesn't change orders. That means any two tokens in the lex are in the same order as the raw input.

*/
