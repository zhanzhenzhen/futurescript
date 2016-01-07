Develop this project
====================

First, use npm to install FutureScript globally.

Then, git clone the repository, and let the repository's root directory be your working directory.

Now, we're ready to develop.

Compile (build) all files in "lib" to "target":

```bash
fus build
```

Build and fill and test:

```bash
fus build-test
fus bt
```

Build and fill:

```bash
fus build-fill
fus bf
```

Test only:

```bash
fus test
fus t
```

Fill only:

```bash
fus fill
```

Note: If you don't want to globally install it, replace the "`fus`" above with "`node lib/bin`".

We must build it (but must NOT fill it) before publish it.

Permanent directories are in `"lib/c-v<number>.<number>.<number>"` format, under which there are permanent compiler files (including testing files). They can't have sub-directories.

Each permanent directory must have a `"ref.json"` file.

`"main.js"` is the entry of each permanent directory. `"test-main.js"` is the entry of testing files. `"ref.json"` lists all referenced permanent files in old versions. These referenced files will be copied to the directory (to that in "target" not in "lib") when filling.

For each version, there may be a related `"readme.js"` file in one permanent directory. So, for contributors, there are 2 important documents: This document and the permanent readme document.

Permanent compiler files conventions
------------------------------------

Can't rely on anything outside the ECMAScript 6 specification. For now, we use Babel to simulate the ECMAScript 6 environment, but Babel can be removed finally (maybe in 2016).

Note that these are outside ECMAScript 6 spec:

- `console.log`
- `require` and other Node.js built-ins
- `global` and `window`

Can't import any path outside this file's directory except `"../locked-api.js"` and `"../test-locked-api.js"`.

Test files can import compiler files, but compiler files can't import test files.

Test files can import `"../locked-api.js"`, but compiler files can't import `"../test-locked-api.js"`.

Except for `"ref.json"`, all files must be in pure JavaScript (i.e. extension: .js) and comply with ECMAScript 6.

Can't be modified or deleted after release (unless there are very serious problems).

When you want to edit a file (that already exists in any old release) for next release, don't edit, but keep it unchanged and copy the file to a new file in the new version's directory (and until next release the new file is editable). When you want to rename a file that exists in old release, also do not rename, but use a new filename in the new version's directory.

It's highly recommended that large file be splitted into small files.
