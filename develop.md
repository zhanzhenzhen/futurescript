Develop this project
====================

First, Git clone the repository, and let the repository's root directory be your working directory.

Then:

```bash
npm update
```

(Note: we can't use `npm install` because it will mistakenly run the postinstall script.)

Now, we're ready to develop.

Test:

```bash
bin/fus test
bin/fus t
```

Fill:

```bash
bin/fus fill
```

The following command is handy when you want to "find" something in compiler, for it creates a `"c-current"` directory to symlink all compiler files of the current version (note: on Windows you may need to run as admin):

```bash
bin/fus c-current
bin/fus cc
```

Then we can search by typing:

```bash
grep -Rl your-search-string c-current
```

We must build release (but must NOT fill it) before publishing. When a user installs it, referenced files will be automatically filled in the post-install period.

Permanent directories are in `"lib/c-v<number>.<number>.<number>"` format, under which there are permanent compiler files (including testing files). They can't have sub-directories.

Each permanent directory must have a `"ref.json"` file.

`"main.js"` is the entry of each permanent directory. `"test-main.js"` is the entry of testing files. `"ref.json"` lists all referenced permanent files. These referenced files will be copied to the directory (to that in "target", not in "lib") when filling.

For each version, there may be a related `"readme.js"` file in one permanent directory. So, for contributors, there are 2 important documents: This document and the permanent readme document.

Permanent compiler files conventions
------------------------------------

Can't rely on anything outside the ECMAScript 2015 (ES6) specification.

Note that these are outside ES6 spec:

- `console.log`
- `require` and other Node.js built-ins
- `global`, `window`, `setTimeout`, `setInterval`

Can't import any path outside this file's directory except `"../locked-api.js"` and `"../test-locked-api.js"`.

Test files can import compiler files, but compiler files can't import test files.

Test files can import `"../locked-api.js"`, but compiler files can't import `"../test-locked-api.js"`.

Except for `"ref.json"`, all files must be in pure JavaScript (i.e. extension: .js) and comply with ES6.

Can't be modified or deleted after release (unless there are very serious problems).

When you want to edit a file (that already exists in any old release) for next release, don't edit, but keep it unchanged and copy the file to the new version's directory (and until next release the new file is editable). When you want to rename a file that exists in old release, also do not rename, but use a new filename in the new version's directory.

It's highly recommended that large file be splitted into small files.

Publish
=======

Make sure the newest version is reflected in the spec. Use the regular expression `\b\d+\.\d+\.\d+\b` to search, and replace them with the new version strings. Replace them one by one carefully, not all at once.

Make sure all examples in `"examples"` directory is using the newest version.

Make sure in `"lib/locked-api.js"` the `bundlerLookup` function includes versions you want to bundle for browser.

Then run test to make sure there's no false or error result:

```bash
bin/fus t
```

Git commit the change and tag the new version.

Then publish to npm.

Fork and Pull Request
=====================

You may wonder why there're thousands of Git tags in this repo. That's because the author uses GitLock. For details see [here](https://www.npmjs.com/package/gitlock). But for other developers, you don't need to have GitLock installed. Just use the normal Git commands to commit and push and create a pull request, then the author will lock it.
