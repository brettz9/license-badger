'use strict';

const utils = require('util');
const {join} = require('path');

// May change implementation of `licensee` to Promise but only after
//  Arborist may replace `read-package-tree`:
//  https://github.com/jslicense/licensee.js/pull/62#discussion_r352206031
const licensee = utils.promisify(require('licensee'));

module.exports = async () => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const {bundledRootPackages} = require(
    join(process.cwd(), 'licenseInfo.json')
  );

  const licenses = {
    // osi: true
    spdx: [
      'MIT', 'ISC', 'BSD-3-Clause', 'BSD-2-Clause', 'Apache-2.0', 'Unlicense'
    ]
  };

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
        filterPackages (packages) {
          const filteredPackages = packages.filter((pkg) => {
            // Ensure we are getting a package with the version set in the
            //  user's package.json
            // Could also be a normal dep. if, e.g., copying for browser;
            //   but normally will be whitelisting devDep. that we are copying
            //   over
            // const isRootDep = pkg.package._requiredBy.includes('#USER');
            const isRootDevDep = pkg.package._requiredBy.includes('#DEV:/');
            return isRootDevDep && bundledRootPackages.includes(pkg.name);
          });

          // eslint-disable-next-line jsdoc/require-jsdoc
          function getDeps (pkgs) {
            pkgs.forEach(({package: {dependencies}}) => {
              if (dependencies) {
                const pkgsToCheck = [];
                Object.keys(dependencies).forEach((dep) => {
                  const findPkg = ({name}) => dep === name;
                  /* eslint-disable unicorn/no-fn-reference-in-iterator */
                  if (filteredPackages.find(findPkg)) {
                    return;
                  }
                  const pk = packages.find(findPkg);
                  /* eslint-enable unicorn/no-fn-reference-in-iterator */
                  pkgsToCheck.push(pk);
                  filteredPackages.push(pk);
                });
                getDeps(pkgsToCheck);
              }
            });
          }

          getDeps(filteredPackages);

          /*
          console.log(
            'filteredPackages',
            filteredPackages.map((fp) => fp.name).sort()
          );
          */
          return filteredPackages;
        },
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
