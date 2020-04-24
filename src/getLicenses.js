'use strict';

const {promisify} = require('util');
const {resolve} = require('path');

const parse = require('spdx-expression-parse');
const getLicenseType = require('npm-consider/lib/getLicenseType');

// May change implementation of `licensee` to Promise but only after
//  Arborist may replace `read-package-tree`:
//  https://github.com/jslicense/licensee.js/pull/62#discussion_r352206031
// const licensee = require('licensee');
const licensee = promisify(require('licensee'));

const getWhitelistedRootPackagesLicenses = require(
  './getWhitelistedRootPackagesLicenses.js'
);

// Todo: Have stringification avoid extra parentheses when multiple joined
//  conjunctions of the same type?
const stringifyLicense = (ast) => {
  if (ast.license) {
    return ast.license +
      // Todo: Is this correct?
      (ast.plus ? '-or-later' : '') +
      (ast.exception ? ('-with-' + ast.exception) : '');
  }
  return `(${stringifyLicense(ast.left)} ${ast.conjunction.toUpperCase()} ` +
      `${stringifyLicense(ast.right)})`;
};

/**
 * @param {PlainObject} typeInfo
 * @param {Map} [typeInfo.licenses = new Map()]
 * @param {string} typeInfo.license
 * @param {string} [typeInfo.name] Optional if license is known to be
 * a positive-length string, and is not "UNLICENSED", with "SEE LICENSE IN ",
 * beginning with "RPL-" or "Parity-", or of type "uncategorized"
 * @param {string} [typeInfo.version] See `typeInfo.name`.
 * @returns {Map}
 */
const getTypeInfoForLicense = exports.getTypeInfoForLicense = function ({
  licenses = new Map(), license: licns, name, version, licenseAsAST
}) {
  const addType = (type, license) => {
    if (!licenses.has(type)) {
      licenses.set(type, new Set());
    }
    const set = licenses.get(type);
    set.add(
      type !== 'uncategorized' && license
        ? license
        : {name, version, license, ...(
          type === 'custom'
            ? {
              custom
            }
            : {}
        )}
    );
    licenses.set(type, set);
  };

  const getTypeInfo = (license, noParsing) => {
    let type, custom;
    if (!licenseAsAST) {
      if (!license || typeof license !== 'string') {
        type = 'missing';
        license = null;
      } else if (license === 'UNLICENSED') {
        type = 'unlicensed';
        license = null;
      } else if (license.startsWith('SEE LICENSE IN ')) {
        type = 'custom';
        custom = license.replace('SEE LICENSE IN ', '');
        license = null;
      } else if ((/^(?:RPL|Parity)-/u).test(license)) {
        type = 'reuseProtective';
      } else if (noParsing) {
        type = getLicenseType(license);
      }
    }
    if (!type) {
      const getTypes = (ast) => {
        licenseAsAST = false;
        let typ, lic;
        if ('license' in ast) {
          // Todo: also may have `plus` (i.e., "or later") and/or `exception`
          //  (also more permissive) with `license`
          [typ] = getTypeInfo(ast.license, true);
          lic = ast.license;
        } else if (ast.conjunction === 'or') {
          // Todo: This is more complex than the commented out, as
          //  we'd only want to add these items if more permissive
          //  than the other branch (faster if not safer if can
          //  first be normalized); for now, we just reserialize
          //  this branch and add the type of evaluating the
          //  whole expression.
          // getTypeInfoForLicense({license: ast.left});
          // getTypeInfoForLicense({license: ast.right});
          const stringified = stringifyLicense(ast);
          [typ, , lic] = getTypeInfo(stringified, true);
        } else {
          getTypeInfoForLicense({
            licenses, name, version,
            license: ast.left,
            licenseAsAST: true
          });
          getTypeInfoForLicense({
            licenses, name, version,
            license: ast.right,
            licenseAsAST: true
          });
        }
        return [typ, undefined, lic];
      };
      let parsed;
      if (!licenseAsAST) {
        try {
          parsed = parse(licns);
        } catch (err) {
          return [getLicenseType(licns), undefined, licns];
        }
      }
      [type, , license] = getTypes(licenseAsAST ? licns : parsed);
    }

    return [type, custom, license];
  };

  let type, custom;
  [type, custom, licns] = getTypeInfo(licns);

  if (type) {
    addType(type, licns);
  }
  return licenses;
};

// Todo: When stabilized, list more specific types than `Map` and `GenericArray`
/**
* @typedef {PlainObject} LicenseInfo
* @property {Map} licenses
*/

/*
If adding back to `LicenseInfo`
* @property {GenericArray} approved
* @property {GenericArray} nonApproved
* @property {string[]} manuallyCorrected
 */

/* eslint-disable max-len */
/**
 * @param {PlainObject} cfg
 * @param {LicenseBadgerOptions#licenseInfoPath} [cfg.licenseInfoPath=resolve(process.cwd(), './licenseInfo.json')]
 * Not used, nor default obtained, when `filter` is `false`.
 * @param {LicenseBadgerOptions#packagePath} [cfg.packagePath=process.cwd()]
 * @param {LicenseBadgerOptions#corrections} [cfg.corrections=false]
 * @param {LicenseBadgerOptions#production} [cfg.production=false]
 * @param {LicenseBadgerOptions#allDevelopment} [cfg.allDevelopment=false]
 * @param {Map} [cfg.licenses=new Map()]
 * @returns {Promise<LicenseInfo>}
 */
exports.getLicenses = async ({
  /* eslint-enable max-len */
  licenseInfoPath,
  packagePath = process.cwd(),
  corrections = false,
  production = false,
  allDevelopment = false,
  licenses = new Map()
} = {}) => {
  let bundledRootPackages;
  if (allDevelopment) {
    bundledRootPackages = true;
  } else if (licenseInfoPath) {
    // eslint-disable-next-line import/no-dynamic-require
    ({bundledRootPackages} = require(
      resolve(process.cwd(), licenseInfoPath)
    ));
  }
  // console.log('bundledRootPackages', bundledRootPackages);

  // This doesn't filter; it affects whether an `approved` property is added
  const approvedLicenses = {
    // osi: true
    spdx: [
      'MIT', 'ISC', 'BSD-3-Clause', 'BSD-2-Clause', 'Apache-2.0', 'Unlicense'
    ]
  };

  const filterPackages = allDevelopment || licenseInfoPath
    ? getWhitelistedRootPackagesLicenses(
      bundledRootPackages
    )
    : undefined;

  let results;
  try {
    results = await licensee(
      {
        // The manual corrections are useful but automatic ones are critical
        //   handling old objects, arrays of objects etc.
        disableLsErrorAborting: true,
        corrections,
        packages: {
          // 'load-stylesheets': '*'
        },
        filterPackages,
        productionOnly: production,
        licenses: approvedLicenses
      },
      // Path to check
      packagePath
    );
  } catch (err) {
    /* istanbul ignore next */
    // eslint-disable-next-line no-console
    console.log('Error', err);
    /* istanbul ignore next */
    throw err;
  }

  /*
  // console.log('results', [...results.map(({name}) => name)].sort());
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
  */

  /*
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
  */

  /*
  // To get automatic corrections, really need to omit `corrections` and
  //  look at non-approved, since `correct-license-metadata.js` does
  //  not return a value distinguishing a valid from corrected and
  //  `licensee.js` does not do its own checking
  const manuallyCorrected = results.filter(
    (r) => r.corrected === 'manual'
  ).map(({name}) => (name)).sort();
  */

  /**
  * @typedef {GenericArray} TypeInfoArray
  * @property {string} 0 type
  * @property {string|null} 1 license
  * @property {string|undefined} 2 custom
  */

  [...new Set(results)].forEach(({license, name, version}) => {
    getTypeInfoForLicense({licenses, license, name, version});
  });

  // console.log('license approvals', approved, nonApproved, manuallyCorrected);

  return {
    licenses
    // approved,
    // nonApproved,
    // manuallyCorrected
  };
};
