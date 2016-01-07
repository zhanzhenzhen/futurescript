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
fus (compile | c) [--no-shim | --heavy-shim] [--map] <file-or-directory> [<target-file-or-directory>]

fus (version | v | --version)
```

To compile, use `compile` or `c`.

The default shim policy is for Node.js, so if your code only runs on Node then just use the default. But if you want it to also run on browsers (particularly on old browsers), you may need `--heavy-shim`.

`--no-shim` will generate the raw ES6 code, though at present it doesn't work in any platform. It may get supported by Node and browsers by the second half of 2016.

`--map` will add the line numbers of the source to the generated code. Useful for debugging. (Note: this is not "source map", which is another technology.)

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

Compile for browser compatibility:

```bash
fus compile --heavy-shim a.fus
```

Develop this project
====================

See "develop.md".
