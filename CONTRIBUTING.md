Contributing
============

Permanent compiler files are files whose names start with "compile-", but not including "compile-v<number>.<number>.<number>" and "compile.js".

Permanent compiler files conventions:

Can't rely on any dependencies except Babel, which can be removed (not replaced with another) finally (maybe in 2016).

Can't rely on any non-permanent files.

Must be in pure JavaScript (i.e. extension: .js).

Each file can't have more than 300 lines.

Each file's size must be < 5kB.

Each file name (without extension) must end with a dash plus a number, like "compile-assign-0.js". The initial number for every name is 0. After release, when first editing a file, don't replace, but keep the old one. We should create a new file with the same name but the number added, like "compile-assign-1.js".
