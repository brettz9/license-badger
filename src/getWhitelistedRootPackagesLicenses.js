'use strict';

const {readFile} = require('fs/promises');
const {join} = require('path');

const yaml = require('js-yaml');

module.exports = async function (
  bundledRootPackages, packagePath, production
) {
  let packageLock;
  let pnpm, yarn;
  try {
    // eslint-disable-next-line max-len -- Long
    // eslint-disable-next-line import/no-dynamic-require, node/global-require -- Runtime detect
    packageLock = require(join(packagePath, 'package-lock.json')).packages;
  } catch (e) {
    // istanbul ignore next
    if (e) {
      /* eslint-disable no-console -- CLI */
      // istanbul ignore next
      console.error(
        'No package-lock.json file found and pnpm-lock.yaml and yarn.lock ' +
        'files are not currently supported'
      );
      /* eslint-enable no-console -- CLI */
      // istanbul ignore next
      return [];
    }
    // istanbul ignore next
    try {
      // istanbul ignore next
      packageLock = yaml.load(await readFile(
        join(packagePath, 'pnpm-lock.yaml')
      )).packages;
      // istanbul ignore next
      pnpm = true;
      // console.log('packageLock', packageLock);
    // istanbul ignore next
    } catch (pnpmErr) {
      // istanbul ignore next
      packageLock = yaml.load(await readFile(
        join(packagePath, 'yarn.lock')
      )).packages;
      // istanbul ignore next
      yarn = true;
      // istanbul ignore next
      if (yarn) {
        // Add this condition below as needed when may be ready
      }
    }
  }

  // Todo: Other lock files
  // yaml.load(await readFile('yarn.lock'));
  // yaml.load(await readFile('pnpm-lock.yaml'));

  return (unflattenedPackages) => {
    const packages = [];
    const flatten = (pkg) => {
      packages.push(pkg);
      // Not able to replicate, but keeping as condition
      /* istanbul ignore else */
      if (pkg.children) {
        pkg.children.forEach((p) => flatten(p));
      }
    };
    unflattenedPackages.forEach((p) => flatten(p));

    /*
    // Helped with logging below
    packages.sort((pkg1, pkg2) => {
      return pkg1.name > pkg2.name ? 1 : pkg1.name < pkg2.name ? -1 : 0;
    });
    */

    // console.log('packages', packages);
    const filteredPackages = packages.filter((pkg) => {
      // Ensure we are getting a package with the version set in the
      //  user's package.json
      // Could also be a normal dep. if, e.g., copying for browser;
      //   but normally will be whitelisting devDep. that we are copying
      //   over
      // const isRootDep = pkg.package._requiredBy.includes('#USER');
      // Wasn't able to replicate by `npm i --no-save`

      // Todo: Per https://github.com/npm/rfcs/blob/latest/implemented/0013-no-package-json-_fields.md ,
      //    this `_requiredBy` is being removed (and doesn't work with pnpm
      //    or Yarn)
      /* istanbul ignore if */
      /*
      if (!pkg.package._requiredBy) {
        // May have been installed in `node_modules` but unused
        console.log('pkg.package', pkg.package);
        return false;
      }
      const isRootDep = pkg.package._requiredBy.includes('#DEV:/');
      */
      // Todo: was `pkg.package` here, but we are checking `package.json` keys
      //   instead of what the name inside the (GitHub) package name is, e.g.,
      //   brettz9-missing points to the package with name `license-missing`.
      const {name, version = pkg.package.version} = pkg;
      const isRootDep = Object.entries(packageLock).some((
        [packageKey, value]
      ) => {
        return (
          // istanbul ignore next
          (pnpm && packageKey === `/${name}/${version}`) ||
          (
            !pnpm && packageKey === `node_modules/${name}` &&
            value.version === version
          )
        ) &&
          (
            !production || !value.dev
          );
      });

      return isRootDep &&
        (production || bundledRootPackages === true ||
          (Array.isArray(bundledRootPackages) &&
            bundledRootPackages.includes(pkg.name)));
    });

    // console.log('filteredPackages', filteredPackages.map(({name}) => {
    //   return name;
    // }));

    /**
     * `package.json` info.
     * @external PackageInfo
     */

    /**
     * @param {external:PackageInfo} pkgs
     * @returns {void}
     */
    function getDeps (pkgs) {
      pkgs.forEach((pkg) => {
        // Not able to replicate, but keeping as condition
        /* istanbul ignore if */
        if (!pkg) {
          return;
        }
        const {package: {dependencies}} = pkg;
        if (dependencies) {
          const pkgsToCheck = [];
          Object.keys(dependencies).forEach((dep) => {
            const findPkg = (pk) => {
              // Not able to replicate, but keeping as condition
              /* istanbul ignore if */
              if (!pk) {
                return false;
              }
              const {name} = pk;
              return dep === name;
            };
            if (filteredPackages.find((item) => findPkg(item)) !== undefined) {
              return;
            }
            const pk = packages.find((item) => findPkg(item));
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
      'filteredPackages', filteredPackages.map(({name}) => name).sort()
    );
    */

    return filteredPackages;
  };
};
