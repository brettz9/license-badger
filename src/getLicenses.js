'use strict';

const {promisify} = require('util');
const {join, resolve} = require('path');

const getLicenseType = require('npm-consider/lib/getLicenseType');

// May change implementation of `licensee` to Promise but only after
//  Arborist may replace `read-package-tree`:
//  https://github.com/jslicense/licensee.js/pull/62#discussion_r352206031
// const licensee = require('licensee');
const licensee = promisify(require('licensee'));

const getWhitelistedRootPackagesLicenses = require(
  './getWhitelistedRootPackagesLicenses.js'
);

// Todo: When stabilized, list more specific types than `Map` and `GenericArray`
/**
* @typedef {PlainObject} LicenseInfo
* @property {Map} licenses
* @property {GenericArray} approved
* @property {GenericArray} nonApproved
* @property {string[]} manuallyCorrected
*/

/**
 * @param {LicenseBadgerOptions#licensePath} licensePath
 * @returns {Promise<LicenseInfo>}
 */
module.exports = async ({licensePath}) => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const {bundledRootPackages} = require(
    resolve(process.cwd(), licensePath)
  );
  // console.log('bundledRootPackages', bundledRootPackages);

  // This doesn't filter; it affects whether an `approved` property is added
  const approvedLicenses = {
    // osi: true
    spdx: [
      'MIT', 'ISC', 'BSD-3-Clause', 'BSD-2-Clause', 'Apache-2.0', 'Unlicense'
    ]
  };

  const filterPackages = getWhitelistedRootPackagesLicenses(
    bundledRootPackages
  );

  let results;
  try {
    results = await licensee(
      {
        // The manual corrections are useful but automatic ones are critical
        //   handling old objects, arrays of objects etc.
        corrections: true,
        packages: {
          // 'load-stylesheets': '*'
        },
        filterPackages,
        licenses: approvedLicenses
      },
      join(__dirname, '../')
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('Error', err);
    throw err;
  }

  // console.log('results', results);
  const approved = results.filter(
    (r) => r.approved
  ).reduce((obj, {name, version, license, repository}) => {
    const {url} = repository || {};
    if (!obj[license]) {
      obj[license] = [];
    }
    // obj[license].push(url);
    // Might be in here as a different version
    if (!obj[license].find(({name: n, version: v}) => {
      return name === n && version === v;
    })) {
      obj[license].push({name, version, url});
      obj[license].sort();
    }
    return obj;
  }, {});

  const nonApproved = results.filter(
    (r) => !r.approved
  ).reduce((obj, {license, name, version, repository}) => {
    const {url} = repository || {};
    if (!obj[license]) {
      obj[license] = [];
    }
    // obj[license].push(url);
    // Might be in here as a different version
    if (!obj[license].find(({name: n, version: v}) => {
      return name === n && version === v;
    })) {
      obj[license].push({name, version, url});
      obj[license].sort();
    }
    return obj;
  }, {});

  // To get automatic corrections, really need to omit `corrections` and
  //  look at non-approved, since `correct-license-metadata.js` does
  //  not return a value distinguishing a valid from corrected and
  //  `licensee.js` does not do its own checking
  const manuallyCorrected = results.filter(
    (r) => r.corrected === 'manual'
  ).map(({name}) => (name)).sort();

  const licenses = new Map();
  [...new Set(results)].forEach(({license, name, version}) => {
    let type, custom;
    if (!license) {
      type = 'missing';
      license = null;
    } else if (license === 'UNLICENSED') {
      type = 'unlicensed';
      license = null;
    } else if (license.startsWith('SEE LICENSE IN ')) {
      type = 'custom';
      custom = license.replace('SEE LICENSE IN ', '');
      license = null;
    } else if ((/^(?:rpl|parity)-/u).test(license)) {
      type = 'reuseProtective';
    } else {
      type = getLicenseType(license);
    }

    if (!licenses.has(type)) {
      licenses.set(type, new Set());
    }
    const set = licenses.get(type);
    set.add(license || {name, version, license, ...(
      type === 'custom'
        ? {
          custom
        }
        : {}
    )});
    licenses.set(type, set);
  });

  // console.log('license approvals', approved, nonApproved, manuallyCorrected);

  return {
    licenses,
    approved,
    nonApproved,
    manuallyCorrected
  };
};
