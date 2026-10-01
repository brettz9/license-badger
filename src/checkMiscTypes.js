/**
 * @import {Info} from 'spdx-expression-parse';
 */
/**
 * @todo Move this with `getLicenseType.js` and `satisfies.js` to new
 * `license-types-utils`.
 * @param {string|null|Info|undefined} license
 * @returns {{
 *   type: string|undefined,
 *   license: string|null,
 *   custom: string|undefined
 * }}
 */
const checkMiscTypes = (license) => {
  let type, custom;
  if (!license || typeof license !== 'string') {
    type = 'missing';
    license = null;
  } else if (license === 'UNLICENSED') {
    type = 'unlicensed';
    license = null;
  } else if (license.startsWith('SEE LICENSE IN ')) {
    type = 'custom';
    custom = license.replace('SEE LICENSE IN ', '');
    license = null;
  }
  return {
    type, license, custom
  };
};

export default checkMiscTypes;
