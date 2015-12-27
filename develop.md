Develop this project
====================

First, use npm to install FutureScript globally.

Second, git clone the repository, and let the repository's root directory be your working directory.

Now, we're ready to develop.

Because "lib" and "test" directories hold all versions, we often want to list files of just the current version (specified in "package.json"):

- `fus list`
- `fus l`

Compile (build) all files in "lib" to ES5-compatible files in "target":

- `fus build`
- `fus b`

Test:

- `fus test`
- `fus t`

Note: If you don't want to globally install it, or you want to directly run the raw ECMAScript 6 code (not the JS in the "target" directory), replace the "`fus`" above with "`babel-node <futurescript-directory>/lib/bin`". In this case, you should have Babel 5.x.x installed on your computer.

We must build it before publish it.

Permanent compiler directories are in `"lib/c-v<number>.<number>.<number>"` format, under which there are permanent compiler files. They can't have sub-directories.

Permanent test directories are in `"test/c-v<number>.<number>.<number>"` format, under which there are permanent test files. They can't have sub-directories.

`"main.js"` is the entry of each permanent directory.

For each version, there may be a related `"readme.js"` file in one permanent directory. You can find it by using `fus list`. So for contributors, there are 2 important documents: This document and the permanent readme document.

Permanent compiler files conventions
------------------------------------

Can't rely on anything outside the ECMAScript 6 specification. For now, we use Babel to simulate the ECMAScript 6 environment, but Babel can be removed finally (maybe in 2016).

Note that these are outside ECMAScript 6 spec:

- `console.log`
- `require` and other Node.js built-ins
- `global` and `window`

Can't rely on any non-permanent files except `"../locked-api.js"` (relative to the directory of the current module).

Even when importing a module in the same directory, the import string must start with `../c-v<number>.<number>.<number>`. That's redundant but needed because in later versions you don't need to modify every import strings.

Must be in pure JavaScript (i.e. extension: .js) and comply with ECMAScript 6.

Can't be modified or deleted after release (unless there are very serious problems).

When you want to edit a file (that already exists in any old release) for next release, don't edit, but keep it unchanged and copy the file to a new file in the new version's directory (and until next release the new file is editable). When you want to rename a file that exists in old release, also do not rename, but use a new filename in the new version's directory.

It's highly recommended that large file be splitted into small files.

Permanent test files
--------------------

They should follow the similar rule as above. Note that:

- Permanent test files can rely on permanent compiler files, but permanent compiler files can't rely on permanent test files.
- Permanent test files can rely on `"lib/locked-api.js"`, but permanent compiler files can't rely on `"test/locked-api.js"`.
