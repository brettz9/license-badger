import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

import {getLicenses, getTypeInfoForLicense} from '../src/getLicenses.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
  it('should avoid adding nameless `license`', () => {
    const licenses = getTypeInfoForLicense({license: 'MIT'});
    const permissive = licenses.get('permissive');
    expect(permissive).to.be.undefined;
    expect([...licenses]).to.have.lengthOf(0);
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
    // Changed from networkProtective
    const permissive = licenses.get('protective');
    expect(permissive).to.be.a('Set');
    expect(permissive.has(licenseStringified)).to.be.true;
    /*
    // Todo: Should add this if we can process the OR properly
    expect(permissive.has('X11')).to.be.true;
    */
  });
});
