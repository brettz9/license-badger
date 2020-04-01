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

**This project is in early beta.**

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
- use the likes of [rollup-plugin-license](https://www.npmjs.com/package/rollup-plugin-license)
  to grab licenses while pulling in modules during a bundling routine (as useful
  as this can be), perhaps because the project wishes instead for their source
  to be usable within a live ESM browser version for rapid debugging/development
  which has no need of a bundling step or which has a bundling step but is not
  used for all files such as an online demo.

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

There is also a helper which only takes one argument and returns:

```sh
get-license-type "license expression"
```

## CLI

![cli.svg](https://raw.githubusercontent.com/brettz9/license-badger/master/cli.svg?sanitize=true)

## See also

- [mocha-badge-generator](https://github.com/ianpogi5/mocha-badge-generator) - Locally
  created badges for Mocha test results
- [coveradge](https://github.com/brettz9/coveradge) - Locally-created badges
  for nyc/istanbul coverage

## Immediate to-dos

1. Get `npm-consider/lib/getLicenseType` to stop treating AND as
    potentially getting stricter one (though each license is different,
    at least with "permissive" or "public domain" which could normally
    submit to the other type). Filed <https://github.com/delfrrr/npm-consider/pull/26>.
    May even have problem with "OR" per
    [this issue](https://github.com/delfrrr/npm-consider/issues/21),
    though this seems due to an outdated dep.

## To-dos

1. Get to work with Git submodules
1. Ability to normalize an AND/OR license, e.g.,
    `(MIT OR (MIT OR GPL-3.0))`, `(MIT AND (MIT AND GPL-3.0))`,
    or `(MIT AND (MIT OR GPL-3.0))`; use for overwriting of `license`
    mentioned above and for feeding current license and other licenses
    for license badge creation.
    1. See <https://www.npmjs.com/package/spdx-expression-parse> and
      <https://github.com/nexB/license-expression/blob/master/src/license_expression/_pyahocorasick.py>
1. Add Rollup plugin that can ovewrite `bundledRootPackages` in
    `licenseInfoPath`/`licenseInfo.json`
1. Process `licenseeInfo.json` `filesByLicense` to optionally overwrite
    `license` in `package.json`
  1. Extract jsdoc iterator from `eslint-plugin-jsdoc` to own repo and
      use to search for `@license` within files so as to be able to
      overwrite `filesByLicense` with dynamic info
1. Generate reports (MD, HTML, JSON, CLI) creating a
    `bundledPackagesByLicense` (and repeating `filesByLicense` info), and
    using `licenseeInfo.json`'s `bundledRootPackages` (and optionally
    `default`)
    1. Use `unapproved`, `nonApproved`, and especially `manuallyCorrected`
        info in reports so users can know whether to report.
    1. Link to issue tracker and/or search of issue tracker for "license",
        so users can easily see if filed/discussed, at least for those
        missing, manually corrected, etc.
1. See about using [license-checker](https://github.com/davglass/license-checker)
    for more detection opportunities (e.g., README and License file); see
    also <https://github.com/davglass/license-checker/issues/225> to make this
    easier on our end.
