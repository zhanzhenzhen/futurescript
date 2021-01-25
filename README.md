[![](https://futurescript.org/readme-splash.png)](https://futurescript.org/)

Please visit [https://futurescript.org/](https://futurescript.org/) to learn the language.

Requirements
============

1. Node.js 14 or higher
2. npm 6 or higher

Command Usage
=============

npm 6:

```bash
npm install futurescript -g --unsafe-perm
```

IMPORTANT: On npm 6, if you're using `-g` or `--global`, then `--unsafe-perm` must be selected.

npm 7+:

```bash
npm install futurescript -g
```

The generated JS works on any JS environment that supports ECMAScript 2017, including browser and Node.js.

```
fus (compile | c) [--map] <file-or-directory> [<target-file-or-directory>]

fus (legacy-compile | lc) [--map] <file-or-directory> [<target-file-or-directory>]

fus (version | v | --version)

fus --help
```

To compile (to `.mjs`), use `compile` or `c`.

To compile (to `.js`), use `legacy-compile` or `lc`.

Those two are exactly the same except for the file extension.

`--map` will add the line numbers of the source to the generated code. Useful for debugging. (Note: this is not "source map", which is another technology.)

Because we use a very sophisticated versioning model that all historical compilers are kept, there's really no need to install it to your project directory - conflicts are very unlikely. But if you really "hate global", to avoid waste of disk space, it should be stated in "devDependencies", not "dependencies" (particularly when you're writing a middleware).

Examples
========

Compile "a.fus" to "a.mjs":

```bash
fus compile a.fus
```

Compile for debugging:

```bash
fus compile --map a.fus
```

Compile the whole "lib" directory to "target":

```bash
fus compile lib target
```

Develop This Project
====================

See "develop.md".

Changelog
=========

See [history](https://futurescript.org/).

License
=======

See "LICENSE.txt".
