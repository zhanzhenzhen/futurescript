Contributing
============

Permanent compiler files are under `"lib"` directory with filenames starting with `"c-"`, but not including `"c-v<number>.<number>.<number>.js"` and `"c.js"`.

Permanent compiler files conventions
------------------------------------

Can't rely on any dependencies except Babel, which can be removed (not replaced with another) finally (maybe in 2016).

Can't rely on any non-permanent files except `"locked-api.js"`.

Must be in pure JavaScript (i.e. extension: .js) and comply with ECMAScript 6.

Each filename (without extension) must end with a dash plus a number, like `"c-assign-0.js"`. The initial number for every name is 0. When you want to edit a file that exists in release, don't edit, but keep it unchanged and create a new file with the same name but the number added, like `"c-assign-1.js"` (and until next release the new file is editable). When you want to rename a file that exists in release, also do not rename, but use a new filename with the number 0. Lastly, of course, any file that exists in release can't be deleted.

It's highly recommended that large file be splitted into small files.

Permanent test files
--------------------

Permanent test files are under "`test`" directory. They should follow the similar rule as above. Note that:

- Permanent test files can rely on permanent compiler files, but permanent compiler files can't rely on permanent test files.
- Permanent test files can rely on `"lib/locked-api.js"`, but permanent compiler files can't rely on `"test/locked-api.js"`.
