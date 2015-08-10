Contributing
============

We can't rely on any dependencies except Babel, which can be removed (not replaced with another) finally (maybe in 2016).

We must use pure JavaScript.

Each .js file can't have more than 300 lines.

Each .js file size must < 5kB.

.js file naming convention: Each file name (without extension) must end with a dash plus a number, like "compiler-0.js". The initial number for every name is 0. After release, when first editing a file, don't replace, but keep the old one. We should create a new file with the same name but the number added, like "compiler-1.js".
