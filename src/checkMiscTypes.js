'use strict';

/**
 * @todo Move this with `getLicenseType.js` and `satisfies.js` to new
 * `license-types-utils`.
 * @param {?string} license
 * @returns {{type: string, license: null, custom: string}}
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

module.exports = checkMiscTypes;
