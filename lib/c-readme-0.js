/*

1. Compiler directives can only be used when running in `compile` method (or in `rawCompile`, etc) after the tree is built. They can't be used when building the tree. That's because using different compiler directives often cause different generated JS. Our concept is: The tree should remain the same regardless of the compiler directives.

*/
