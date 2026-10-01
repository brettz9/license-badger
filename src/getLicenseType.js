/**
 * @file Returns licensee type.
 * @todo Move this with `checkMiscTypes.js` and `satisfies.js` to new
 * `license-types-utils`.
 */

import {getLicenseTypes} from 'license-types';
import satisfies from './satisfies.js';

const licenseTypes = getLicenseTypes();

const types = /** @type {const} */ ([
  'publicDomain',
  'permissive',
  'weaklyProtective',
  'protective',
  'networkProtective',
  'useProtective',
  'modifyProtective'
]);

/**
 * @param {string} license
 * @returns {(keyof import('license-types').LicenseInfo|"uncategorized")[]}
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

  return typeInfos.length
    ? /** @type {(keyof import('license-types').LicenseInfo)[]} */ (typeInfos)
    : ['uncategorized'];
}

export default getLicenseType;
