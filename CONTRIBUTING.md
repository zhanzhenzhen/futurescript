Contributing
============

Permanent compiler files are those whose names start with `"c-"`, but not including `"c-v<number>.<number>.<number>.js"` and `"c.js"`.

Permanent compiler files conventions
------------------------------------

Can't rely on any dependencies except Babel, which can be removed (not replaced with another) finally (maybe in 2016).

Can't rely on any non-permanent files except `"lib/locked-api.js"`.

Must be in pure JavaScript (i.e. extension: .js) and comply with ECMAScript 6.

Each file name (without extension) must end with a dash plus a number, like `"c-assign-0.js"`. The initial number for every name is 0. After release, when first editing a file, don't replace, but keep the old one. We should create a new file with the same name but the number added, like `"c-assign-1.js"`. When you want to rename a file that exists in releases, also do not rename, but use a new file name with the number 0. Lastly, of course, any file that exists in releases can't be deleted.

It's highly recommended that large file be splitted into small files.
