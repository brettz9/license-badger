'use strict';

const {join} = require('path');

const getLicenseType = require('npm-consider/lib/getLicenseType');

// May change implementation of `licensee` to Promise but only after
//  Arborist may replace `read-package-tree`:
//  https://github.com/jslicense/licensee.js/pull/62#discussion_r352206031
// const licensee = require('licensee');
const promisify = require('./promisify.js');
// eslint-disable-next-line import/order
const licensee = promisify(require('licensee'));

const getWhitelistedRootPackagesLicenses = require(
  './getWhitelistedRootPackagesLicenses.js'
);

module.exports = async () => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const {bundledRootPackages} = require(
    join(process.cwd(), 'test/licenseInfo.json')
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
  ).reduce((obj, {name, version, license /* , repository: {url} */}) => {
    if (!obj[license]) {
      obj[license] = [];
    }
    // obj[license].push(url);
    // Might be in here as a different version
    if (!obj[license].includes(name)) {
      obj[license].push(name);
      obj[license].sort();
    }
    return obj;
  }, {});

  const nonApproved = results.filter(
    (r) => !r.approved
  ).map(({license, version, repository: {url}}) => {
    return {license, url, version};
  });

  // To get automatic corrections, really need to omit `corrections` and
  //  look at non-approved, since `correct-license-metadata.js` does
  //  not return a value distinguishing a valid from corrected and
  //  `licensee.js` does not do its own checking
  const manuallyCorrected = results.filter(
    (r) => r.corrected === 'manual'
  ).map(({name}) => (name)).sort();

  const licenses = new Map();
  [...new Set(results)].forEach(({license}) => {
    const type = license ? getLicenseType(license) : null;
    if (!licenses.has(type)) {
      licenses.set(type, new Set());
      return;
    }
    const set = licenses.get(type);
    set.add(license);
    licenses.set(type, set);
  });

  // eslint-disable-next-line no-console
  console.log('licenses', licenses);

  return {
    // Todo: Need to probably shape results
    licenses,
    approved,
    nonApproved,
    manuallyCorrected
  };
};
