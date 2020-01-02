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
      return isRootDevDep && bundledRootPackages.includes(pkg.name);
    });

    // eslint-disable-next-line jsdoc/require-jsdoc
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
            /* eslint-disable unicorn/no-fn-reference-in-iterator */
            if (filteredPackages.find(findPkg) !== undefined) {
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
    // eslint-disable-next-line max-len
    // console.log('filteredPackages', filteredPackages.map(({name}) => name).sort());

    return filteredPackages;
  };
};
