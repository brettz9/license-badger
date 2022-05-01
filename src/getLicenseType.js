/**
 * @file returns licensee type
 * @todo Move this with `checkMiscTypes.js` and `satisfies.js` to new
 * `license-types-utils`.
 */

import {getLicenseTypes} from 'license-types';
import satisfies from './satisfies.js';

const licenseTypes = await getLicenseTypes();

const types = [
  'publicDomain',
  'permissive',
  'weaklyProtective',
  'protective',
  'networkProtective',
  'useProtective',
  'modifyProtective'
];

/**
 * @param {string} license
 * @returns {string[]}
 */
function getLicenseType (license) {
  const typeInfos = Object.entries(licenseTypes).flatMap(([
    testLicense, info
  ]) => {
    if (satisfies(license, testLicense)) {
      return types.filter((type) => {
        return info[type];
      });
    }
    return null;
  }).filter(Boolean);

  return typeInfos.length ? typeInfos : ['uncategorized'];
}

export default getLicenseType;
