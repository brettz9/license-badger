/**
 * @file returns licensee type
 * @todo Move this with `checkMiscTypes.js` and `satisfies.js` to new
 * `license-types-utils`.
 */

'use strict';

const licenseTypes = require('license-types');
const satisfies = require('./satisfies.js');

const types = [
  'publicDomain',
  'permissive',
  'weaklyProtective',
  'protective',
  'networkProtective',
  'useProtective',
  'modifyProtective'
];

module.exports = function getLicenseType (license) {
  const typeInfos = Object.entries(licenseTypes).flatMap(([
    testLicense, info
  ]) => {
    if (satisfies(license, testLicense)) {
      return types.filter((prop) => {
        return info[prop];
      });
    }
    return null;
  }).filter((info) => {
    return info;
  });

  return typeInfos.length ? typeInfos : ['uncategorized'];
};
