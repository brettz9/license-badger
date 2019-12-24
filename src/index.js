'use strict';

/*
1. Waiting on whether might avoid need for specifying `licenses`/`packages`
   as alluded to in comment at https://github.com/jslicense/licensee.js/pull/61
*/

const badgeUp = require('badge-up');

const getWhitelistedRootPackagesLicenses = require(
  './getWhitelistedRootPackagesLicenses.js'
);

/**
 * @param {LicenseBadgerOptions} options
 * @returns {void}
 */
module.exports = (options) => {
  getWhitelistedRootPackagesLicenses();

  badgeUp.v2();
};
