# CHANGES for license-badger

## ?

- Enhancement: Adding `logging` option
- Testing: Run multiple simultaneous reporters
- npm: Remove now unneeded separate badge creation script
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
