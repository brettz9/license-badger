/**
 * @file checks if spdx expressions are matching
 * @todo Move this with `getLicenseType.js` and `checkMiscTypes.js` to new
 * `license-types-utils`.
 */

import spdxSatisfies from 'spdx-satisfies';
import correct from 'spdx-correct';

/**
 *
 * @param {string} spdx
 * @returns {string}
 */
function correcting (spdx) {
  if (spdx === 'UNLICENSED') { // See https://github.com/jslicense/spdx-correct.js/issues/3#issuecomment-279799556
    return spdx;
  }
  return correct(spdx);
}

/**
 * @param {string} a spdx
 * @param {string} b spdx
 * @returns {boolean} [description]
 */
function satisfies (a, b) {
  if (a === b) {
    return true;
  }
  const ac = correcting(a);
  const bc = correcting(b);
  if (!ac || !bc) {
    return false;
  }
  try {
    return spdxSatisfies(ac, bc);
  } catch (e) {
    return ac === bc;
  }
}

export default satisfies;
