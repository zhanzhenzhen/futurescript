FutureScript
============

1. Consistent. Member access always uses the dot `.`, regardless of whether it's in object or array.

2. Simple. The `=` just means equality. Say goodbye to the annoying `==` and `===`.

3. Highly expressive and readable. If you are a fan of "functional style", then you must be interested.

4. And many, many more.

Please visit [http://futurescript.org/](http://futurescript.org/) to learn the language.

Command Usage
=============

```bash
npm install -g futurescript
```

Your Node.js version should be 5.0 or higher.

```bash
fus (compile | c) [--map] <file-or-directory> [<target-file-or-directory>]

fus (version | v | --version)
```

To compile, use `compile` or `c`.

At present, you may need Babel to downgrade the generated ES6 code to be compatible with your environment. For details, see [Babel website](https://babeljs.io/).

For Node.js 5.x, you only need to enable these 3 Babel plugins:

- transform-es2015-modules-commonjs
- transform-es2015-destructuring
- transform-es2015-parameters

For Node.js prior to 5.0 and for browsers, you may need to enable the entire "es2015" preset.

`--map` will add the line numbers of the source to the generated code. Useful for debugging. (Note: this is not "source map", which is another technology.)

To avoid waste of disk space, if you want to install it to your project directory rather than globally, it should be in "devDependencies", not "dependencies" (particularly when you're writing a middleware). This is important because we use a very sophisticated versioning model that all historical compilers are kept.

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

See "changelog.md".

License
=======

See "LICENSE.txt".
