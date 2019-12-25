'use strict';

module.exports = function (bundledRootPackages) {
  return (packages) => {
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
  };
};
