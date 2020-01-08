'use strict';

const {join} = require('path');
const {getLicenses, getTypeInfoForLicense} = require('../src/getLicenses.js');

const packagePath = join(__dirname, '../');

process.chdir(packagePath);

describe('getLicenses', function () {
  this.timeout(5000);
  it('should work with no arguments', async () => {
    const {licenses} = await getLicenses();
    expect(licenses).to.be.a('Map');
    const permissive = licenses.get('permissive');
    expect(permissive).to.be.a('Set');
    expect(permissive.has('MIT')).to.be.true;
  });
  it('should work with empty `licenses`', () => {
    const licenses = getTypeInfoForLicense({license: 'MIT'});
    const permissive = licenses.get('permissive');
    expect(permissive).to.be.a('Set');
    expect(permissive.has('MIT')).to.be.true;
  });
  it('should work with AND and OR', () => {
    const licenses = getTypeInfoForLicense({
      name: 'svgedit',
      version: '6.0.0',
      license: '((MIT AND (X11 OR GPL-3.0)) AND ISC)'
    });
    const permissive = licenses.get('permissive');
    expect(permissive).to.be.a('Set');
    expect(permissive.has('MIT')).to.be.true;
    expect(permissive.has('ISC')).to.be.true;
    const protective = licenses.get('permissive');
    expect(protective).to.be.a('Set');
    expect(protective.has('GPL-3.0')).to.be.false;
    /*
    // Todo: Should add this if we can process the OR properly
    expect(permissive.has('X11')).to.be.true;
    */
  });
  it('should work with OR and "+" and "WITH"', () => {
    const license = '(X11 OR GPL-3.0+ OR ' +
      'AGPL-1.0+ WITH LLVM-exception OR ' +
      'GPL-2.0 WITH Font-exception-2.0)';
    const licenseStringified = '(X11 OR (GPL-3.0-or-later OR ' +
      '(AGPL-1.0-or-later-with-LLVM-exception OR ' +
      'GPL-2.0-with-Font-exception-2.0)))';
    const licenses = getTypeInfoForLicense({
      name: 'svgedit',
      version: '6.0.0',
      license
    });
    const permissive = licenses.get('networkProtective');
    expect(permissive).to.be.a('Set');
    expect(permissive.has(licenseStringified)).to.be.true;
    /*
    // Todo: Should add this if we can process the OR properly
    expect(permissive.has('X11')).to.be.true;
    */
  });
});
