'use strict';

const utils = require('util');
const {join} = require('path');

// May change implementation of `licensee` to Promise but only after
//  Arborist may replace `read-package-tree`:
//  https://github.com/jslicense/licensee.js/pull/62#discussion_r352206031
const licensee = utils.promisify(require('licensee'));

const getWhitelistedRootPackagesLicenses = require(
  './getWhitelistedRootPackagesLicenses.js'
);

module.exports = async () => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const {bundledRootPackages} = require(
    join(process.cwd(), 'licenseInfo.json')
  );

  // This doesn't filter; it affects whether an `approved` property is added
  const licenses = {
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
        licenses
      },
      join(__dirname)
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('Error', err);
    return;
  }

  // console.log('results', results);
  console.log('Approved', JSON.stringify(results.filter((r) => r.approved).reduce((obj, {name, version, license /* , repository: {url} */}) => {
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
  }, {}), null, 2));
  console.log('Non-approved', results.filter((r) => !r.approved).map(({license, version, repository: {url}}) => {
    return {license, url, version};
  }));
  // To get automatic corrections, really need to omit `corrections` and
  //  look at non-approved, since `correct-license-metadata.js` does
  //  not return a value distinguishing a valid from corrected and
  //  licensee.js does not do its own checking
  console.log('Manually corrected', results.filter((r) => r.corrected === 'manual').map(({name}) => (name)).sort());
};
