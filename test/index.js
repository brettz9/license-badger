import {readFile, unlink} from 'fs/promises';
import {fileURLToPath} from 'url';
import {dirname, join} from 'path';
import licenseBadger from '../src/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const logging = 'verbose';
const packagePath = join(__dirname, '../');

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
const licenseInfoPathUseProtective = getFixturePath(
  'licenseInfo-useProtective.json'
);
const licenseInfoPathModifyProtective = getFixturePath(
  'licenseInfo-modifyProtective.json'
);
const licenseInfoPathUseAndModifyProtective = getFixturePath(
  'licenseInfo-useAndModifyProtective.json'
);
const licenseBadgePath = join(__dirname, '../license-badge.svg');
const licenseBadgeFixturePath = getFixturePath('license-badge.svg');
const esmAndMochaPath = getFixturePath('esm-mocha-and-missing.svg');
const redPublicDomainPath = getFixturePath('redPublicDomain.svg');
const allDevelopmentPath = getFixturePath('allDevelopment.svg');
const productionPath = getFixturePath('production.svg');
const packageJsonPath = getFixturePath('packageJson.svg');
const packageJsonAndLicensePath = getFixturePath('packageJsonAndLicense.svg');
const nonemptyFilteredTypes = getFixturePath('nonemptyFilteredTypes.svg');
const otherFilteredTypes = getFixturePath('otherFilteredTypes.svg');
const seeLicenseInPath = getFixturePath('seeLicenseIn.svg');
const unlicensedPath = getFixturePath('unlicensed.svg');
const useAndModifyProtectivePath = getFixturePath('useAndModifyProtective.svg');
const useProtectivePath = getFixturePath('useProtective.svg');
const modifyProtectivePath = getFixturePath('modifyProtective.svg');
const uncategorizedPath = getFixturePath('uncategorized.svg');
const completePackageList = getFixturePath('completePackageList.svg');

describe('Main file', function () {
  this.timeout(15000);
  it('should throw with a bad output path', async () => {
    let err;
    try {
      await licenseBadger({outputPath: '', logging});
    } catch (error) {
      err = error;
    }
    expect(err.message).to.equal('Bad output path provided.');
  });

  it('should throw with insufficient package type info', async function () {
    let err;
    try {
      await licenseBadger({outputPath: 'test', licenseInfoPath: '', logging});
    } catch (error) {
      err = error;
    }
    expect(err.message).to.equal(
      'You must specify at least `allDevelopment`, `licenseInfoPath`, ' +
      '`packageJson`, or `production`'
    );
  });

  it('should work with default output path', async function () {
    await licenseBadger({
      packagePath,
      licenseInfoPath,
      textColor: 'orange,s{blue}',
      logging
    });
    const contents = await readFile(licenseBadgePath, 'utf8');
    const expected = await readFile(licenseBadgeFixturePath, 'utf8');
    expect(contents).to.equal(expected);
  });

  describe('Main functionality', function () {
    const fixturePaths = [];
    for (let i = 0; i <= 14; i++) {
      fixturePaths.push(join(__dirname, `fixtures/temp${i}.svg`));
    }
    let j = 0;
    /**
     * @returns {void}
     */
    function getNextFixturePath () {
      return fixturePaths[j++];
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
      const outputPath = getNextFixturePath();
      await licenseBadger({
        packagePath,
        licenseInfoPath,
        outputPath,
        textColor: 'orange,s{blue}',
        logging
      });
      const contents = await readFile(outputPath, 'utf8');
      const expected = await readFile(esmAndMochaPath, 'utf8');
      expect(contents).to.equal(expected);
    });

    it('should work with license type color', async function () {
      const outputPath = getNextFixturePath();
      await licenseBadger({
        packagePath,
        licenseInfoPath,
        outputPath,
        licenseTypeColor: ['publicDomain=red,s{white}'],
        logging
      });
      const contents = await readFile(outputPath, 'utf8');
      const expected = await readFile(redPublicDomainPath, 'utf8');
      expect(contents).to.equal(expected);
    });

    it('should work with `filteredTypes`', async function () {
      const outputPath = getNextFixturePath();
      await licenseBadger({
        packagePath,
        licenseInfoPath,
        outputPath,
        filteredTypes: 'missing',
        logging
      });
      const contents = await readFile(outputPath, 'utf8');
      const expected = await readFile(otherFilteredTypes, 'utf8');
      expect(contents).to.equal(expected);
    });

    it('should work with `filteredTypes` (nonempty)', async function () {
      const outputPath = getNextFixturePath();
      await licenseBadger({
        packagePath,
        licenseInfoPath,
        outputPath,
        filteredTypes: 'nonempty',
        logging
      });
      const contents = await readFile(outputPath, 'utf8');
      const expected = await readFile(nonemptyFilteredTypes, 'utf8');
      expect(contents).to.equal(expected);
    });

    it('should work with `allDevelopment`', async function () {
      const outputPath = getNextFixturePath();
      await licenseBadger({
        allDevelopment: true,
        packagePath,
        outputPath,
        logging
      });
      const contents = await readFile(outputPath, 'utf8');
      const expected = await readFile(allDevelopmentPath, 'utf8');
      expect(contents).to.equal(expected);
    });

    it('should work with `production`', async function () {
      const outputPath = getNextFixturePath();
      await licenseBadger({
        production: true,
        licenseInfoPath: '',
        packagePath,
        outputPath,
        logging
      });
      const contents = await readFile(outputPath, 'utf8');
      const expected = await readFile(productionPath, 'utf8');
      expect(contents).to.equal(expected);
    });

    it('should work with `packageJson` (packagePath)', async function () {
      const outputPath = getNextFixturePath();
      await licenseBadger({
        packageJson: true,
        licenseInfoPath: '',
        packagePath,
        outputPath,
        logging
      });
      const contents = await readFile(outputPath, 'utf8');
      const expected = await readFile(packageJsonPath, 'utf8');
      expect(contents).to.equal(expected);
    });

    it('should work with `packageJson` (chdir)', async function () {
      const cwd = process.cwd();
      process.chdir(join(__dirname, '../'));
      const outputPath = getNextFixturePath();
      await licenseBadger({
        packageJson: true,
        licenseInfoPath: '',
        outputPath,
        logging
      });
      process.chdir(cwd);
      const contents = await readFile(outputPath, 'utf8');
      const expected = await readFile(packageJsonPath, 'utf8');
      expect(contents).to.equal(expected);
    });

    it(
      'should work with `packageJson` and `licenseInfoPath`',
      async function () {
        const cwd = process.cwd();
        process.chdir(join(__dirname, '../'));
        const outputPath = getNextFixturePath();
        await licenseBadger({
          packageJson: true,
          licenseInfoPath,
          outputPath,
          logging
        });
        process.chdir(cwd);
        const contents = await readFile(outputPath, 'utf8');
        const expected = await readFile(packageJsonAndLicensePath, 'utf8');
        expect(contents).to.equal(expected);
      }
    );

    describe('License categories', function () {
      it('should work with "see license in"', async function () {
        const outputPath = getNextFixturePath();
        await licenseBadger({
          corrections: true,
          packagePath,
          licenseInfoPath: licenseInfoPathSeeLicenseIn,
          outputPath,
          logging
        });
        const contents = await readFile(outputPath, 'utf8');
        const expected = await readFile(seeLicenseInPath, 'utf8');
        expect(contents).to.equal(expected);
      });

      it('should work with "UNLICENSED"', async function () {
        const outputPath = getNextFixturePath();
        await licenseBadger({
          corrections: true,
          packagePath,
          licenseInfoPath: licenseInfoPathUnlicensed,
          outputPath,
          logging
        });
        const contents = await readFile(outputPath, 'utf8');
        const expected = await readFile(unlicensedPath, 'utf8');
        expect(contents).to.equal(expected);
      });

      it('should work with CC-BY-NC-4.0', async function () {
        const outputPath = getNextFixturePath();
        await licenseBadger({
          corrections: true,
          packagePath,
          licenseInfoPath: licenseInfoPathUseProtective,
          outputPath,
          logging
        });
        const contents = await readFile(outputPath, 'utf8');
        const expected = await readFile(useProtectivePath, 'utf8');
        expect(contents).to.equal(expected);
      });

      it('should work with CC-BY-ND-4.0', async function () {
        const outputPath = getNextFixturePath();
        await licenseBadger({
          corrections: true,
          packagePath,
          licenseInfoPath: licenseInfoPathModifyProtective,
          outputPath,
          logging
        });
        const contents = await readFile(outputPath, 'utf8');
        const expected = await readFile(modifyProtectivePath, 'utf8');
        expect(contents).to.equal(expected);
      });

      it('should work with CC-BY-NC-ND-4.0', async function () {
        const outputPath = getNextFixturePath();
        await licenseBadger({
          corrections: true,
          packagePath,
          licenseInfoPath: licenseInfoPathUseAndModifyProtective,
          outputPath,
          logging
        });
        const contents = await readFile(outputPath, 'utf8');
        const expected = await readFile(useAndModifyProtectivePath, 'utf8');
        expect(contents).to.equal(expected);
      });

      it('should work with an "uncategorized" license', async function () {
        const outputPath = getNextFixturePath();
        await licenseBadger({
          corrections: true,
          packagePath,
          licenseInfoPath: licenseInfoPathUncategorized,
          outputPath
          // No `logging` is deliberate for the sake of full coverage
        });
        const contents = await readFile(outputPath, 'utf8');
        const expected = await readFile(uncategorizedPath, 'utf8');
        expect(contents).to.equal(expected);
      });
    });
  });

  describe('`completePackageList`', function () {
    const fixturePaths = [];
    ['completePackageList'].forEach((path) => {
      fixturePaths.push(join(__dirname, `fixtures/temp-${path}.svg`));
    });
    const unlinker = async () => {
      try {
        await Promise.all(fixturePaths.map((fixturePath) => {
          return unlink(fixturePath);
        }));
      } catch (err) {}
    };
    before(unlinker);
    after(unlinker);
    it('Should allow use of `completePackageList`', async function () {
      const outputPath = join(
        __dirname, `fixtures/temp-completePackageList.svg`
      );

      const licenseMap = new Map();
      const permissiveSet = new Set();
      permissiveSet.add('MIT');
      permissiveSet.add('ISC');
      licenseMap.set('permissive', permissiveSet);

      const protectiveSet = new Set();
      protectiveSet.add('GPL-3.0-only');
      protectiveSet.add('GPL-3.0-or-later');
      licenseMap.set('protective', protectiveSet);

      await licenseBadger({
        packagePath,
        completePackageList: licenseMap,
        licenseInfoPath,
        outputPath,
        textColor: 'orange,s{blue}',
        logging
      });
      const contents = await readFile(outputPath, 'utf8');
      const expected = await readFile(completePackageList, 'utf8');
      expect(contents).to.equal(expected);
    });
  });
});
