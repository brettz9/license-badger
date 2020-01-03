'use strict';

const {readFile: rf, unlink: ul} = require('fs');
const {promisify} = require('util');
const {join} = require('path');
const licenseBadger = require('../src/index.js');

const packagePath = join(__dirname, '../');

const readFile = promisify(rf);
const unlink = promisify(ul);

const getFixturePath = (path) => {
  return join(__dirname, `fixtures/${path}`);
};

const licenseInfoPath = getFixturePath('licenseInfo.json');
const licenseInfoPathSeeLicenseIn = getFixturePath(
  'licenseInfo-seeLicenseIn.json'
);
const licenseInfoPathUnlicensed = getFixturePath('licenseInfo-unlicensed.json');
const licenseInfoPathUncategorized = getFixturePath(
  'licenseInfo-uncategorized.json'
);
const licenseInfoPathReuseProtective = getFixturePath(
  'licenseInfo-reuseProtective.json'
);
const coverageBadgePath = join(__dirname, '../coverage-badge.svg');
const coverageBadgeFixturePath = getFixturePath('coverage-badge.svg');
const esmAndMochaPath = getFixturePath('esm-mocha-and-missing.svg');
const redPublicDomainPath = getFixturePath('redPublicDomain.svg');
const nonemptyFilteredTypes = getFixturePath('nonemptyFilteredTypes.svg');
const seeLicenseInPath = getFixturePath('seeLicenseIn.svg');
const unlicensedPath = getFixturePath('unlicensed.svg');
const reuseProtectivePath = getFixturePath('reuseProtective.svg');
const uncategorizedPath = getFixturePath('uncategorized.svg');

describe('Main file', function () {
  it('should throw with a bad output path', async () => {
    let err;
    try {
      await licenseBadger({outputPath: ''});
    } catch (error) {
      err = error;
    }
    expect(err.message).to.equal('Bad output path provided.');
  });

  it('should work with default output path', async function () {
    await licenseBadger({
      packagePath,
      licenseInfoPath,
      textColor: 'orange,s{blue}'
    });
    const contents = await readFile(coverageBadgePath, 'utf8');
    const expected = await readFile(coverageBadgeFixturePath, 'utf8');
    expect(contents).to.equal(expected);
  });

  describe('Main functionality', function () {
    this.timeout(5000);
    const fixturePaths = [];
    for (let i = 0; i <= 6; i++) {
      fixturePaths.push(join(__dirname, `fixtures/temp${i}.svg`));
    }
    const unlinker = async () => {
      try {
        await Promise.all(fixturePaths.map((fixturePath) => {
          return unlink(fixturePath);
        }));
      } catch (err) {}
    };
    before(unlinker);
    after(unlinker);
    it('should work with string text color', async function () {
      await licenseBadger({
        packagePath,
        licenseInfoPath,
        outputPath: fixturePaths[0],
        textColor: 'orange,s{blue}'
      });
      const contents = await readFile(fixturePaths[0], 'utf8');
      const expected = await readFile(esmAndMochaPath, 'utf8');
      expect(contents).to.equal(expected);
    });

    it('should work with license type color', async function () {
      await licenseBadger({
        packagePath,
        licenseInfoPath,
        outputPath: fixturePaths[1],
        licenseTypeColor: ['publicDomain=red,s{white}']
      });
      const contents = await readFile(fixturePaths[1], 'utf8');
      const expected = await readFile(redPublicDomainPath, 'utf8');
      expect(contents).to.equal(expected);
    });

    it('should work with `filteredTypes`', async function () {
      await licenseBadger({
        packagePath,
        licenseInfoPath,
        outputPath: fixturePaths[2],
        filteredTypes: 'nonempty'
      });
      const contents = await readFile(fixturePaths[2], 'utf8');
      const expected = await readFile(nonemptyFilteredTypes, 'utf8');
      expect(contents).to.equal(expected);
    });

    it('should work with "see license in"', async function () {
      await licenseBadger({
        corrections: true,
        packagePath,
        licenseInfoPath: licenseInfoPathSeeLicenseIn,
        outputPath: fixturePaths[3]
      });
      const contents = await readFile(fixturePaths[3], 'utf8');
      const expected = await readFile(seeLicenseInPath, 'utf8');
      expect(contents).to.equal(expected);
    });

    it('should work with "UNLICENSED"', async function () {
      await licenseBadger({
        corrections: true,
        packagePath,
        licenseInfoPath: licenseInfoPathUnlicensed,
        outputPath: fixturePaths[4]
      });
      const contents = await readFile(fixturePaths[4], 'utf8');
      const expected = await readFile(unlicensedPath, 'utf8');
      expect(contents).to.equal(expected);
    });

    it('should work with Parity', async function () {
      await licenseBadger({
        corrections: true,
        packagePath,
        licenseInfoPath: licenseInfoPathReuseProtective,
        outputPath: fixturePaths[5]
      });
      const contents = await readFile(fixturePaths[5], 'utf8');
      const expected = await readFile(reuseProtectivePath, 'utf8');
      expect(contents).to.equal(expected);
    });

    it('should work with an "uncategorized" license', async function () {
      await licenseBadger({
        corrections: true,
        packagePath,
        licenseInfoPath: licenseInfoPathUncategorized,
        outputPath: fixturePaths[6]
      });
      const contents = await readFile(fixturePaths[6], 'utf8');
      const expected = await readFile(uncategorizedPath, 'utf8');
      expect(contents).to.equal(expected);
    });
  });
});
