'use strict';

const {join} = require('path');

const licensee = require('licensee');

module.exports = () => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const {bundledRootPackages} = require(
    join(process.cwd(), 'licenseInfo.json')
  );

  return licensee(
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
      licenses: {
        // osi: true
        spdx: [
          'MIT', 'ISC', 'BSD-3-Clause', 'BSD-2-Clause', 'Apache-2.0', 'Unlicense'
        ]
      }
    },
    join(__dirname),
    // Rejected changing implementation of `licensee` to Promise: https://github.com/jslicense/licensee.js/pull/55#issuecomment-558437231
    // eslint-disable-next-line promise/prefer-await-to-callbacks
    (err, results) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('Error', err);
        return;
      }
      /**/
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
    }
  );
};
