'use strict';

module.exports = function (bundledRootPackages) {
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
      /* istanbul ignore if */
      if (!pkg.package._requiredBy) {
        // May have been installed in `node_modules` but unused
        return false;
      }
      const isRootDevDep = pkg.package._requiredBy.includes('#DEV:/');
      return isRootDevDep &&
        (bundledRootPackages === true ||
          (Array.isArray(bundledRootPackages) &&
            bundledRootPackages.includes(pkg.name)));
    });

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
