FutureScript
============

Please visit http://futurescript.org/ to learn the language.

Command Usage
-------------

- `fus (compile | c | map-compile | m) [--no-shim] <file-or-directory> [<target-file-or-directory>]`
- `fus (version | v | --version)`

`compile` or `c` is for compiling without source map.

`map-compile` or `m` is for compiling with source map.

Examples
--------

Compile "abc.fus" to "abc.js":

```bash
fus compile abc.fus
```

Compile the whole "abc" directory to "abc-output":

```bash
fus compile abc abc-output
```

Compile "abc.fus" to "abc.js" and generate a source map of "abc.js.map":

```bash
fus m abc.fus
```

The same as above, but without using Babel for ES5-compatibility. That is, generate the raw ES6 code:

```bash
fus m --no-shim abc.fus
```

Develop this project
====================

The most commonly used command is `fus list` when your working directory is the project root. For details, see "develop.md".
