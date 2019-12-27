'use strict';

const {readFile: rf, unlink: ul} = require('fs');
const {promisify} = require('util');
const {join} = require('path');
const licenseBadger = require('../src/index.js');

const readFile = promisify(rf);
const unlink = promisify(ul);
const licensePath = join(__dirname, 'fixtures/licenseInfo.json');
const esmAndMochaPath = join(__dirname, 'fixtures/esm-and-mocha.svg');

describe('Main file', function () {
  const fixturePath = join(__dirname, 'fixtures/temp1.svg');
  const unlinker = async () => {
    try {
      await unlink(fixturePath);
    } catch (err) {}
  };
  before(unlinker);
  after(unlinker);
  it('should work with string text color', async function () {
    await licenseBadger({
      path: fixturePath,
      textColor: 'orange,s{blue}',
      licensePath
    });
    const contents = await readFile(fixturePath, 'utf8');
    const expected = await readFile(esmAndMochaPath, 'utf8');
    expect(contents).to.equal(expected);
  });
});
