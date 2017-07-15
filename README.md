[![](https://futurescript.org/readme-splash.png)](https://futurescript.org/)

Please visit [https://futurescript.org/](https://futurescript.org/) to learn the language.

Command Usage
=============

```bash
npm install -g futurescript
```

The `fus` command works on Node.js 6.0 or higher.

The generated JS, after "Babeled", works on any JS environment that supports ECMAScript 5th, including browser and Node.js old versions.

```
fus (compile | c) [--map] <file-or-directory> [<target-file-or-directory>]

fus (version | v | --version)

fus --help
```

To compile, use `compile` or `c`.

At present, you may need Babel to downgrade the generated ES6 code to be compatible with your environment. For details, see [Babel website](https://babeljs.io/).

In my opinion, Babel 5 is stable and easy to use. Babel 6 still has some bugs in some plug-ins. I recommend using Babel 5 if you want your generated JS to run on older Node.js or browser.

If you want your generated JS to run on Node.js 6.x or higher, you can use Babel 6 because you only need to enable this plugin which has no bug (through my test):

- transform-es2015-modules-commonjs

`--map` will add the line numbers of the source to the generated code. Useful for debugging. (Note: this is not "source map", which is another technology.)

Because we use a very sophisticated versioning model that all historical compilers are kept, there's really no need to install it to your project directory - conflicts are very unlikely. But if you really "hate global", to avoid waste of disk space, it should be stated in "devDependencies", not "dependencies" (particularly when you're writing a middleware).

Examples
========

Compile "a.fus" to "a.js":

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

Develop this project
====================

See "develop.md".

Changelog
=========

See [history](https://futurescript.org/).

License
=======

See "LICENSE.txt".
