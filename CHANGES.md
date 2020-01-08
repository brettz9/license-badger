# CHANGES for license-badger

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
