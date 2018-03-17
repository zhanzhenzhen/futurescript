Develop this project
====================

Make sure you're on Node.js 9.8.0 or higher, and npm 5.6.0 or higher.

Git clone the repository, and let the repository's root directory be your working directory.

Then:

```bash
npm update
```

(Note: we can't use `npm install` because it will mistakenly run the postinstall script.)

Now, we're ready to develop.

Presently, for any `node dev` in this article, change it to `./dev.mjs`, because Node.js 9.x doesn't turn on ES modules by default. Using command `./dev.mjs`, the shebang will tell Node.js to turn this feature on. Or you can use a long, ugly format `node --experimental-modules --no-warnings dev`. In future Node.js (maybe v10), `node dev` will work.

Make and test the current version (this is most commonly used):

```bash
node dev test
node dev t
```

Make all versions:

```bash
node dev make-all
```

The following command is handy when you want to "find" something just inside the current version of compiler, for it creates a `"c-current"` directory to symlink all compiler files of the current version (note: on Windows you may need to run as admin):

```bash
node dev c-current
node dev cc
```

Then we can search by typing:

```bash
grep -Rl your-search-string c-current
```

Directory structure
-------------------

All files in `"lib"` directory (including its sub-directories, recursively) must be either `".mjs"` or `".json"` files.

Permanent directories are in `"lib/c-v<number>.<number>.<number>"` format, under which there are permanent files. They can't have sub-directories.

Permanent files can be compiler files, test files and `"ref.json"`. Within each permanent directory: There must be a `"ref.json"` file; Files starting with `"test-"` are test files; All others are compiler files.

Within each permanent directory: `"main.mjs"` is the compiler entry; `"test-main.mjs"` is the test entry; `"ref.json"` lists all referenced permanent files. These referenced files will be mixed together in a directory with the same name in "target" after the package is installed.

For each version, there's a `"readme.mjs"` referenced by `"ref.json"`. This readme applies to permanent files only (more accurately, the files together referenced by `"ref.json"`). So, contributors please note that there are 2 important documents: This document and the permanent `"readme.mjs"`.

Permanent files conventions
---------------------------

(For convenience, "test files" in this section are limited to permanent files, so this concept doesn't include `"test-locked-api.mjs"`.)

Permanent files (except `"ref.json"`):

Must be ECMAScript modules (i.e. extension: .mjs) and comply with ECMAScript 2017.

Can't rely on anything outside the ECMAScript 2017 specification. Note that these are outside ECMAScript 2017 spec:

- `console.log`
- `require` and other Node.js built-ins
- `global`, `window`, `setTimeout`, `setInterval`

Can only import `".mjs"` files. The import string must be in one of these formats:

- `"./<base-name>.mjs"`, where `<base-name>` is the filename without the `".mjs"` extension. Obviously in this format the imported file can't be located outside the importer's directory.
- `"../locked-api.mjs"`
- `"../test-locked-api.mjs"`

Permanent files (including `"ref.json"`):

Can't be modified or deleted after release (unless there are very serious problems).

When you want to edit a file (that already exists in any old release) for next release, don't edit, but keep it unchanged and copy the file to the new version's directory (and until next release the new file is editable). When you want to rename a file that exists in old release, also do not rename, but use a new filename in the new version's directory.

It's highly recommended that large file be splitted into small files.

Other rules:

Test files can import compiler files, but compiler files can't import test files.

Test files can import `"../locked-api.mjs"`, but compiler files can't import `"../test-locked-api.mjs"`.

Publish
-------

Make sure the newest version is reflected in the spec. Use the regular expression `\b\d+\.\d+\.\d+\b` to search, and replace them with the new version strings. Replace them one by one carefully, not all at once.

Make sure all examples in `"examples"` directory are using the newest version.

Then run test to make sure there's no false or error result:

```bash
node dev t
```

Git commit the change and tag the new version.

Then publish to npm.

Fork and Pull Request
---------------------

You may wonder why there're thousands of Git tags in this repo. That's because the author uses GitLock. For details see [here](https://www.npmjs.com/package/gitlock). But for other developers, you don't need to have GitLock installed. Just use the normal Git commands to commit and push and create a pull request, then the author will lock it.
