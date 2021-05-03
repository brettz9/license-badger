# license-badger

[![npm](https://img.shields.io/npm/v/license-badger.svg)](https://www.npmjs.com/package/license-badger)
[![Dependencies](https://img.shields.io/david/brettz9/license-badger.svg)](https://david-dm.org/brettz9/license-badger)
[![devDependencies](https://img.shields.io/david/dev/brettz9/license-badger.svg)](https://david-dm.org/brettz9/license-badger?type=dev)

[![testing badge](https://raw.githubusercontent.com/brettz9/license-badger/master/badges/tests-badge.svg?sanitize=true)](badges/tests-badge.svg)
[![coverage badge](https://raw.githubusercontent.com/brettz9/license-badger/master/badges/coverage-badge.svg?sanitize=true)](badges/coverage-badge.svg)

[![Known Vulnerabilities](https://snyk.io/test/github/brettz9/license-badger/badge.svg)](https://snyk.io/test/github/brettz9/license-badger)
[![Total Alerts](https://img.shields.io/lgtm/alerts/g/brettz9/license-badger.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/brettz9/license-badger/alerts)
[![Code Quality: Javascript](https://img.shields.io/lgtm/grade/javascript/g/brettz9/license-badger.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/brettz9/license-badger/context:javascript)

<!--[![License](https://img.shields.io/npm/l/license-badger.svg)](LICENSE-MIT.txt)-->
[![Licenses badge](https://raw.githubusercontent.com/brettz9/license-badger/master/badges/licenses-badge.svg?sanitize=true)](badges/licenses-badge.svg)

(see also [licenses for dev. deps.](https://raw.githubusercontent.com/brettz9/license-badger/master/badges/licenses-badge-dev.svg?sanitize=true))

[![issuehunt-to-marktext](https://issuehunt.io/static/embed/issuehunt-button-v1.svg)](https://issuehunt.io/r/brettz9/license-badger)

***license-badger has regrettably been effectively broken by updates to
npm (and lacks support for pnpm). Hopefully the project can be revived if
a means of iterating for license of specific devDependencies (as well as
dependencies) is restored.***

Build a badge indicating the licenses of your project's dependencies
(dependencies, devDependencies, whitelist-bundled devDependencies, and/or
your project's own license).

Here's a sample badge (see below on the format):

[![esm mocha and missing badge](https://raw.githubusercontent.com/brettz9/license-badger/master/test/fixtures/esm-mocha-and-missing.svg?sanitize=true)](test/fixtures/esm-mocha-and-missing.svg)

You can also opt to only show non-empty types:

[![testing badge](https://raw.githubusercontent.com/brettz9/license-badger/master/test/fixtures/nonemptyFilteredTypes.svg?sanitize=true)](test/fixtures/nonemptyFilteredTypes.svg)

## License selections

This project allows licenses to be selected in several different manners.

Current license checking tools typically only allow checking `dependencies` or
`devDependencies`, or they allow checking selected packages without transitive
dependencies. This project allows you to check specific selected packages but
*with* their transitive dependencies.

You can also create a badge which combines whitelisted licenses (or all
`devDependencies`) with the licenses in `dependencies`.

The following section. gives more detail on the types and which can
be combined.

### Your own license (`packageJson`)

This option if set will check the `license` within the `package.json` pointed
to by `packagePath` (possibly also using `name` and `version`), where
`packagePath` defaults to the current working directory.

This option can be combined with any of the options.

### Those wishing for all of `dependencies` (`production`)

This option gathers license data from all `dependencies` in `package.json`
and can be combined with any of the options.

Note that if you do not want to check a `licenseInfoPath` and only want
`dependencies` checked, you need to specify an empty string for
`licenseInfoPath`.

### Those wishing for all `devDependencies` (`allDevelopment`)

This option gathers license data from all `devDependencies` in `package.json`
and can be combined with the `production` option. `licenseInfoPath` will
not be used if this is set.

### Those wishing a subset of `devDependencies` (`licenseInfoPath`)

Projects may wish to bring over third-party dependencies into their final
distribution files and/or repo via a copy routine (e.g., one run
upon dependency updates).

This license selection type is done through the argument `licenseInfoPath`
pointing to a JSON file (recommended as `licenseInfo.json` at project root)
with an array `bundledRootPackages` property indicating the `devDependencies`
that are bundled. It can be combined with `production` but `allDevelopment`
will override this setting and include *all* `devDependencies` instead.

This whitelist will determine which of your top-level `devDependencies`
you are bundling and uses this information to build a badge
showing the license types within your distribution, including those packages'
transitive dependencies (not including your own project's license) and
sorted by permissiveness (see below for more permissiveness degrees).

Projects may use this selection type to take advantage of npm versioning,
but instead of only deploying to clients that have the capability to install
`dependencies`, they may wish to deploy to Github-based hosting services
(such as Github Pages) which normally wouldn't bring in `node_modules` yet
can host static files copied into a repository which can be viewed in
browsers.

Other current solutions may not be desired because a project may not wish to
be forced to either:

- include all of `node_modules` and use actual `bundledDependencies`,
  creating a potentially very large repository
- use the likes of [rollup-plugin-license](https://www.npmjs.com/package/rollup-plugin-license) (though see to-do below which might combine the functionalities)
  to grab licenses while pulling in modules during a bundling routine (as useful
  as this can be), perhaps because the project wishes instead for their source
  to be usable within a live ESM browser version for rapid debugging/development
  which has no need of a bundling step or which has a bundling step but is not
  used for all files such as an online demo.

### Those already having a list of licenses

Though this option is only recommended for tools and such because one might
otherwise miss transitive dependencies (dependencies of your dependencies)
that should also be included. But if you are sure you know the complete list,
including transitive dependencies, you can use the option `completePackageList`,
a Map of package names (only available in the programmatic interface).

## Notes on license categories

Adopts helpful categories of [npm-consider](https://github.com/delfrrr/npm-consider):
"publicDomain", "permissive", "weaklyProtective", "protective", "networkProtective",
and "uncategorized". We also add "reuseProtective" (for
[RPL](https://en.wikipedia.org/wiki/Reciprocal_Public_License) and
[Parity](https://licensezero.com/licenses/parity) type licenses which put
conditions on even private use) and "unlicensed" (which is copyrighted or
otherwise explicitly against reuse--rather than merely being currently
unspecified).
<!--
(See [#24](https://github.com/delfrrr/npm-consider/issues/24) and [#18](https://github.com/delfrrr/npm-consider/issues/18#issuecomment-568872477) of `npm-consider` for tracking these recommendations)
-->

It might be worth bearing in mind that "public domain" is a reference to specific
licenses which seek to enforce that general principle (otherwise,
the principle of public domain does not automatically apply world-wide), so
this should make sense as the first category.

It might also be worth noting that these categories are only rough and items
in the same category do not substitute for one another, e.g., different
"permissive" licenses still have certain requirements. And even the same
license may have different needs depending on the project for which it was
used--e.g., the need to preserve the copyright notice for each package
and/or file.

## Installation

```
npm i -g license-badger
```

## Usage

```sh
license-badger --filteredTypes=weaklyProtective,protective --textTemplate \"License types (\\${licenseCount})\" --licenseTypeColor networkProtective=blue,s{white} -l test/fixtures/licenseInfo.json test.svg
```

It is recommended you add this to a `package.json` [`prepare`](https://docs.npmjs.com/misc/scripts#description) script so that you have the
latest info reflected upon adding new dependencies (or use a
`prepublishOnly` script if only wishing to update for releases).

There is also a helper which only takes one argument and returns:

```sh
get-license-type "license expression"
```

## CLI

![cli.svg](https://raw.githubusercontent.com/brettz9/license-badger/master/cli.svg?sanitize=true)

## Tips

You may wish to use the likes of [@hkdobrev/run-if-changed](https://github.com/hkdobrev/run-if-changed) (with [husky](https://github.com/typicode/husky))
so as to check for `package.json`/`package-lock.json` changes and run
`license-badger` to ensure it is being built against the latest `dependencies`
(and/or `devDependencies`). (The package is also useful for ensuring your
local installation is auto-updated to reflect your project's latest package
lock.)

## See also

- [eslint-formatter-badger](https://github.com/brettz9/eslint-formatter-badger) -
    Locally created badges indicating linting results (as run against your project
    and/or your dependencies)
- [filesize-badger](https://github.com/brettz9/filesize-badger) - Locally created
    badges indicating file size (also buildable as part of Rollup routine)
- [mocha-badge-generator](https://github.com/ianpogi5/mocha-badge-generator) - Locally
    created badges for Mocha test results
- [coveradge](https://github.com/brettz9/coveradge) - Locally-created badges
    for nyc/istanbul coverage

## Development

Some npm commands (`npm audit fix`) might auto-add items to the `dependencies`,
but if you use such a command, be sure to undo the change (and run tests to be
sure).

## Immediate to-dos

1. Get `npm-consider/lib/getLicenseType` to stop treating AND as
    potentially getting stricter one (though each license is different,
    at least with "permissive" or "public domain" which could normally
    submit to the other type). Filed <https://github.com/delfrrr/npm-consider/pull/26>.
    May even have problem with "OR" per
    [this issue](https://github.com/delfrrr/npm-consider/issues/21),
    though this seems due to an outdated dep.

## To-dos

1. Provide export for convenient use with
    [rollup-plugin-license](https://www.npmjs.com/package/rollup-plugin-license),
    building our `completePackageList` map option as its `template` option
    is called:

```js
// UNTESTED

const getLicenseType = require('npm-consider/lib/getLicenseType');

const licenseMap = new Map();

export default {
  plugins: [
    license({
      thirdParty: {
        output: {
          template (dependencies) {
            dependencies.forEach((dependency) => {
              const type = getLicenseType(dependency.license);
              const set = licenseMap.has(type)
                ? licenseMap.get(type)
                : new Set();
              set.add(dependency.license);
              licenseMap.set(type, set);
            });
          }
        }
      }
    }),
    // Making plugin here on the fly, but should expose to API
    (() => {
      return {
        name: 'license-badger',
        buildEnd () {
          licenseBadger({
            licenseInfoPath: '',
            completePackageList: licenseMap,
            textColor: 'orange,s{blue}'
          });
        }
      };
    })()
  ],
  input: '...',
  output: {
    //
  }
};
```
1. Get to work with Git submodules
1. Ability to normalize an AND/OR license, e.g.,
    `(MIT OR (MIT OR GPL-3.0))`, `(MIT AND (MIT AND GPL-3.0))`,
    or `(MIT AND (MIT OR GPL-3.0))`; use for overwriting of `license`
    mentioned above and for feeding current license and other licenses
    for license badge creation.
    1. See <https://www.npmjs.com/package/spdx-expression-parse> and
      <https://github.com/nexB/license-expression/blob/master/src/license_expression/_pyahocorasick.py>
1. Add Rollup plugin that can ovewrite `bundledRootPackages` in
    `licenseInfoPath`/`licenseInfo.json`; might adapt
    [rollup-plugin-license](https://www.npmjs.com/package/rollup-plugin-license)
1. Process `licenseeInfo.json` `filesByLicense` to optionally overwrite
    `license` in `package.json`
  1. Extract jsdoc iterator from `eslint-plugin-jsdoc` to own repo and
      use to search for `@license` within files so as to be able to
      overwrite `filesByLicense` with dynamic info
1. Generate reports (MD, HTML, JSON, CLI) creating a
    `bundledPackagesByLicense` (and repeating `filesByLicense` info), and
    using `licenseeInfo.json`'s `bundledRootPackages` (and optionally
    `default`)
    1. Change the badge-making itself into a reporter, so can be optional,
        in case just want to get at aggregated `npm-consider` + `licensee`
        info, e.g., to list on command line
    1. Use `unapproved`, `nonApproved`, and especially `manuallyCorrected`
        info in reports so users can know whether to report.
    1. Link to issue tracker and/or search of issue tracker for "license",
        so users can easily see if filed/discussed, at least for those
        missing, manually corrected, etc.
    1. Along the lines of <https://www.gnu.org/software/librejs/free-your-javascript.html#step3>/
        <https://www.gnu.org/licenses/javascript-labels.html>, might advertise
        permissiveness of JS (to a browser add-on which could indicate the
        license type(s) automatically). (Would also be nice to settle on a
        means of advertising the server-side licenses in use behind a site
        as well as info on how to get source.). Could make this as a reporter
        which builds the necessary code (probably caching a static copy for
        performance reasons)--i.e., build a JS web labels table (being sure
        to link to it).
        1. Might alternatively provide `<link/a rel>` mechanism to point
            to a `package.json` file. (Besides being easier to convert this
            code base to work in this manner, would be useful to have a
            formal mechanism for finding other meta-data and source
            code.) Might have separate `<link>` or `rel` to distinguish
            between a package with just JS code and server code?
1. See about using [license-checker](https://github.com/davglass/license-checker)
    for more detection opportunities (e.g., README and License file); see
    also <https://github.com/davglass/license-checker/issues/225> to make this
    easier on our end.
1. Utilize `es-file-traverse` to be able to list licenses for files
    actually in use.
