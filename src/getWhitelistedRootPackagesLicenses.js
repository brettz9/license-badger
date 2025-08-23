import {readFile} from 'fs/promises';
import {join} from 'path';

import {load} from 'js-yaml';

/**
 * @callback PackageFilterer
 * @param {LicenseeUnflattenedPackages} unflattenedPackages
 * @returns {LicenseeFilterPackages} Filtered packages
 */

/**
 * @param {boolean|string[]} bundledRootPackages
 * @param {string} packagePath
 * @param {boolean} production
 * @returns {Promise<PackageFilterer>}
 */
async function getWhitelistedRootPackagesLicenses (
  bundledRootPackages, packagePath, production
) {
  let packageLock;
  let pnpm;
  // let yarn;
  try {
    packageLock = (
      JSON.parse(await readFile(join(packagePath, 'package-lock.json')))
    ).packages;
  } catch (e) {
    try {
      packageLock = load(await readFile(
        join(packagePath, 'pnpm-lock.yaml'),
        'utf8'
      )).packages;
      pnpm = true;
    } catch (pnpmErr) {
      /* eslint-disable no-console -- CLI */
      console.error(
        'No package-lock.json file found and yarn.lock ' +
        'files are not currently supported'
      );
      /* eslint-enable no-console -- CLI */
      throw pnpmErr;

      // packageLock = yaml.load(await readFile(
      //   join(packagePath, 'yarn.lock'),
      //   'utf8'
      // )).packages;
      // yarn = true;
      // // Todo: Yarn lock
      // if (yarn) {
      //   // Add this condition below as needed when may be ready
      // }
    }
  }

  return (unflattenedPackages) => {
    const packages = [];
    const flatten = (pkg) => {
      packages.push(pkg);
      // Not able to replicate, but keeping as condition
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
        let target;
        if (pnpm) {
          target = (!pkg.resolved || (/file:.pnpm\/[^.]*@/v).test(pkg.resolved))
            ? `/${name}@${version}`
            // No better way to match github.com URL packages?
            : new URL(pkg.resolved).pathname.
              replace(/^\/.pnpm\//v, '').
              replaceAll('+', '/').
              replaceAll('@', '/').
              replace(/\/node_modules.*$/v, '');
        }

        return (
          (pnpm && packageKey === target) ||
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
     * @param {PackageInfo} pkgs
     * @returns {void}
     */
    function getDeps (pkgs) {
      pkgs.forEach((pkg) => {
        // Not able to replicate, but keeping as condition
        /* c8 ignore next 3 */
        if (!pkg) {
          return;
        }
        const {package: {dependencies}} = pkg;
        if (dependencies) {
          const pkgsToCheck = [];
          Object.keys(dependencies).forEach((dep) => {
            const findPkg = (pk) => {
              // Not able to replicate, but keeping as condition
              /* c8 ignore next 3 */
              if (!pk) {
                return false;
              }
              const {name} = pk;
              return dep === name;
            };
            if (filteredPackages.some((item) => findPkg(item))) {
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
}

export default getWhitelistedRootPackagesLicenses;
