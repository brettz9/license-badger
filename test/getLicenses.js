'use strict';

const {join} = require('path');
const {getLicenses} = require('../src/getLicenses.js');

const packagePath = join(__dirname, '../');

process.chdir(packagePath);

describe('Main file', function () {
  this.timeout(5000);
  it('should work with no arguments', async () => {
    const {licenses} = await getLicenses();
    expect(licenses).to.be.a('Map');
    const permissive = licenses.get('permissive');
    expect(permissive).to.be.a('Set');
    expect(permissive.has('MIT')).to.be.true;
  });
});
