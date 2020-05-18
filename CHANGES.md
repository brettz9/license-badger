# CHANGES for license-badger

## ?

- Linting: As per latest ash-nazg (`eslint-plugin-jsdoc`)
- npm: Use stable `licensee`
- npm: Add coverage to regular `test` script

## 0.17.0

- Testing: Update test expectations per updated `badge-up` (generated
    SVG is somewhat different but essentially the same)
- npm: Use stable `badge-up` and devDeps.

## 0.16.0

- Docs: Update dev license badges
- npm: Update devDeps and `package-lock.json` (including `npm-consider`
    fork support for "OBSD" categorization)
- npm: Switch to maintained `cypress-multi-reporters`

## 0.15.0

- Docs: Update badges per updates
- npm: Remove `q-combinators` (previously used for sample of custom license)
- npm: Update devDeps.

## 0.14.2

- Fix: Ensure sorting order of `filteredTypes` follows users' order

## 0.14.1

- Docs: Update CLI docs
- Refactoring: Simplify and avoid extra checks

## 0.14.0

- Fix: Allow `filteredTypes` to work besides with `nonempty`
- Linting: Check hidden files; add missing `use strict` on hidden files
- Docs: Clarification of `filteredTypes` option

## 0.13.0

- Enhancement: Allow `completePackageList` map programmatic option
    (and `getLicensesMap` export)
- Docs: Info for possible use with `rollup-plugin-license`
- npm: Add `prepublishOnly` script for updating license badges

## 0.12.7

- Fix: Add missing `disableLsErrorAborting` setting to avoid the
    peerDep errors

## 0.12.6

- npm: Update licensee copy, avoiding failing on (peerDep) errors
- npm: Update devDep.

## 0.12.5

- Docs: Point to correct license badges
- Testing: Drop need for external bootstrap file
- npm: Update devDeps

## 0.12.4

- Docs: Indicate missing defaults

## 0.12.3

- Docs: Indicate `outputPath` as optional

## 0.12.2

- Docs: Update `cli.svg`
- Docs: Dog food showing our own license badges

## 0.12.1

- Fix: Change from "coverage-badge.svg" -> "license-badge.svg" as
  default (copy-paste error)
- Maintenance: Special indent for MD files
- npm: Update devDeps.

## 0.12.0

- npm: Point to updated, stable `mocha-badge-generator`
- npm: Rename `build-cli-svg` script to `build-cli`
- npm: Update devDeps; update `command-line-basics` dep.

## 0.11.1

- npm: Update `mocha-badge-generator` and `package-lock.json`

## 0.11.0

- Docs: Update test badge
- Refactoring: Use `badge-up` fork version that returns a Promise
- Testing: Update expected test file (per new devDeps.)
- npm: Update devDeps.

## 0.10.0

- Docs: Update CLI docs
- npm: Update dep. (command-line-basics); devDeps

## 0.9.3

- npm: Point to `npm-consider` branch which integrates fix for
  UNLICENSED along with previous fixes
- npm: Update devDep.

## 0.9.2

- npm: Update to support CC-BY-4.0 (as "permissive")

## 0.9.1

- npm: Update to support CC-BY-3.0 (as "permissive")

## 0.9.0

- Enhancement: Integrate `AND` components separately
- Testing: Update tests per new colors/behaviors
- npm: Rename `test:unit` to `mocha`; only remove `.cache` for `nyc`

## 0.8.0

- Change: Use a darker yellow for readability of `weaklyProtective`

## 0.7.4

- Fix: Pass in `license` to uncategorized templates
- Docs: Fix CLI docs to mention passing `custom`

## 0.7.3

- Fix: "uncategorized", "custom", "unlicensed", and "missing" were showing
  only a single item

## 0.7.2

- Fix: Default to `process.cwd()` for `packagePath` with `packageJson`.

## 0.7.1

- Fix: Make `licenseInfo.json` the default
- npm: Bump devDep.

## 0.7.0

- Change: `getLicenses` to a named export; add export `getTypesForLicense`
- Enhancement: Add `packageJson` boolean option
- Enhancement: Throw if insufficient info given
- Enhancement: Add `satisfies` binary
- Enhancement: Add `command-line-basics` to `get-license-type`
  (help, version, usage)
- Enhancement: Add `production` option to allow checking it
  with or without `licenseInfoPath`
- Enhancement: Add `allDevelopment` to check all devDeps (not
  filtered by bundled packages in `licenseInfoPath`)
- Enhancement: Adding `logging` option
- Enhancement: Add binary `get-license-type` as convenience for
  checking license type
- Docs: More on types
- Testing: Bump timeout for other tests
- Testing: Consolidate timeouts
- Testing: Run multiple simultaneous reporters
- npm: Remove now unneeded separate badge creation script
- npm: Use own npm-consider fork to get updates on spdx deps.
- npm: Update devDeps.

## 0.6.0

- Breaking change: Switch from `licensePath` to `licenseInfoPath`.
- Fix: Add intended defaults for `outputPath`, `licenseInfoPath`,
  `packagePath`
- Enhancement: Throw for bad output path
- Docs: Fix jsdoc

## 0.5.0

- Breaking change: Switch from `path` to `outputPath` (to distinguish
  from other path arguments). Is still the default, however.
- Docs: Fix escaping of CLI options and order to put required at top

## 0.4.0

- Fix: Add missing `packagePath` option!
- Docs: Add samples and clarify
- npm: Update devDeps

## 0.3.0

- Enhancement: Have "uncategorized" supply package name and version
  (as may be bad license)
- Refactoring: Remove redundant code
- Testing: Fix per recent update
- Docs: Add locally-generated testing badg
- npm: Update to `mocha-badge-generator` which uses updated `badge-up`

## 0.2.0

- Fix: Uses badge-up version without vulnerabilities

## 0.1.0

- Initial commit
