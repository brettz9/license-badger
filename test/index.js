'use strict';

const {readFile: rf, unlink: ul} = require('fs');
const {promisify} = require('util');
const {join} = require('path');
const licenseBadger = require('../src/index.js');

const readFile = promisify(rf);
const unlink = promisify(ul);

const getFixturePath = (path) => {
  return join(__dirname, `fixtures/${path}`);
};

const licensePath = getFixturePath('licenseInfo.json');
const licensePathSeeLicenseIn = getFixturePath('licenseInfo-seeLicenseIn.json');
const esmAndMochaPath = getFixturePath('esm-and-mocha.svg');
const redPublicDomainPath = getFixturePath('redPublicDomain.svg');
const nonemptyFilteredTypes = getFixturePath('nonemptyFilteredTypes.svg');
const seeLicenseInPath = getFixturePath('seeLicenseIn.svg');

describe('Main file', function () {
  const fixturePaths = [];
  for (let i = 1; i <= 3; i++) {
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
      licensePath,
      path: fixturePaths[0],
      textColor: 'orange,s{blue}'
    });
    const contents = await readFile(fixturePaths[0], 'utf8');
    const expected = await readFile(esmAndMochaPath, 'utf8');
    expect(contents).to.equal(expected);
  });

  it('should work with license type color', async function () {
    await licenseBadger({
      licensePath,
      path: fixturePaths[1],
      licenseTypeColor: ['publicDomain=red,s{white}']
    });
    const contents = await readFile(fixturePaths[1], 'utf8');
    const expected = await readFile(redPublicDomainPath, 'utf8');
    expect(contents).to.equal(expected);
  });

  it('should work with `filteredTypes`', async function () {
    await licenseBadger({
      licensePath,
      path: fixturePaths[2],
      filteredTypes: 'nonempty'
    });
    const contents = await readFile(fixturePaths[2], 'utf8');
    const expected = await readFile(nonemptyFilteredTypes, 'utf8');
    expect(contents).to.equal(expected);
  });

  it('should work with "see license in"', async function () {
    await licenseBadger({
      corrections: true,
      licensePath: licensePathSeeLicenseIn,
      path: fixturePaths[0]
    });
    const contents = await readFile(fixturePaths[0], 'utf8');
    const expected = await readFile(seeLicenseInPath, 'utf8');
    expect(contents).to.equal(expected);
  });
});
