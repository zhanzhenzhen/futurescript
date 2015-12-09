Development
===========

First, use npm to install lemo globally.

Second, git clone the repository, and let the repository's root directory be your working directory.

Now, we're ready to develop.

Because "lib" and "test" directories hold all versions, we often want to list files of just the current version:

- `lemo list`
- `lemo l`

Compile (build) all files in "lib" to ES5-compatible files in "target":

- `lemo build`
- `lemo b`

Test:

- `lemo test`
- `lemo t`

Note: If you don't want to globally install it, or you want to directly run the raw ECMAScript 6 code (not the JS in the "target" directory), replace the "`lemo`" above with "`babel-node <lemo-directory>/lib/bin`". In this case, you should have Babel 5.x.x installed on your computer.

We must build it before publish it.

Permanent compiler files are under `"lib"` directory with filenames starting with `"c-"`.

Permanent compiler files conventions
------------------------------------

Can't rely on any dependencies outside the ECMAScript 6 specification (even including Node.js built-ins such as `require`) except Babel, which can be removed finally (maybe in 2016).

Can't rely on any non-permanent files except `"locked-api.js"`.

Must be in pure JavaScript (i.e. extension: .js) and comply with ECMAScript 6.

Can't be modified or deleted after release (unless there are very serious problems).

There are two kinds of filenames: version and other. Version filename is in `"c-v<number>.<number>.<number>.js"` format. Other filename (without extension) must end with a dash plus a number, like `"c-assign-0.js"`. The initial number for every name is 0. When you want to edit a file (that already exists in any old release) for next release, don't edit, but keep it unchanged and create a new file with the same name but the number added, like `"c-assign-1.js"` (and until next release the new file is editable). When you want to rename a file that exists in old release, also do not rename, but use a new filename with the number 0.

It's highly recommended that large file be splitted into small files.

Permanent test files
--------------------

Permanent test files are under "`test`" directory with filenames starting with `"c-"`. They should follow the similar rule as above. Note that:

- Permanent test files can rely on permanent compiler files, but permanent compiler files can't rely on permanent test files.
- Permanent test files can rely on `"lib/locked-api.js"`, but permanent compiler files can't rely on `"test/locked-api.js"`.
