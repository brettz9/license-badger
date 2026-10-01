/*
1. Waiting on whether might avoid need for specifying `licenses`/`packages`
   as alluded to in comment at https://github.com/jslicense/licensee.js/pull/61
*/

import {readFile, writeFile} from 'node:fs/promises';
import {join, resolve} from 'node:path';

import BadgeUp from '@cumulusds/badge-up';
import {getLicenseTypeInfo} from 'license-types';
import template from 'es6-template-strings';

import {getLicenses, getTypeInfoForLicense} from './getLicenses.js';

const licenseTypes = getLicenseTypeInfo();

const badgeUp = BadgeUp.v2;

const defaultTextColor = ['navy'];

/**
 * @param {{
 *   allDevelopment?: boolean,
 *   packagePath?: string,
 *   corrections?: boolean,
 *   licenseInfoPath?: string|false,
 *   production?: boolean,
 *   packageJson?: boolean
 * }} cfg
 */
const getLicensesMap = async function ({
  allDevelopment,
  packagePath,
  corrections,
  licenseInfoPath,
  production,
  packageJson
}) {
  let licenses;
  try {
    if (allDevelopment) {
      ({licenses} = await getLicenses({
        packagePath, corrections, allDevelopment
      }));
    } else if (licenseInfoPath) {
      ({licenses} = await getLicenses({
        licenseInfoPath, packagePath, corrections
      }));
    } else if (!production && !packageJson) {
      throw new TypeError(
        'You must specify at least `allDevelopment`, `licenseInfoPath`, ' +
        '`packageJson`, or `production`'
      );
    }
    if (packageJson) {
      const {name, version, license} = JSON.parse(
        // @ts-expect-error Ok
        await readFile(
          join(packagePath || process.cwd(), 'package.json')
        )
      );
      licenses = getTypeInfoForLicense({
        licenses, license, name, version
      });
    }
    if (production) {
      ({licenses} = await getLicenses({
        packagePath, corrections,
        licenses,
        production
      }));
    }
  } catch (err) {
    // eslint-disable-next-line no-console -- More info
    console.log('err', err);
    throw err;
  }
  return licenses;
};

/**
 * @typedef {{
 *   color: string[],
 *   text: string,
 *   licenseCount: number,
 *   licenseList: string[]
 * }} LicenseTypeInfo
 */

/**
 * @param {import('./optionDefinitions.js').LicenseBadgerOptions} options
 * @returns {Promise<void>}
 */
const licenseBadger = async ({
  packagePath,
  packageJson,
  corrections,
  production,
  allDevelopment,
  outputPath = resolve(process.cwd(), './license-badge.svg'),
  licenseInfoPath = !allDevelopment &&
    resolve(process.cwd(), './licenseInfo.json'),
  logging = false,
  textTemplate = 'Licenses',
  /* eslint-disable no-template-curly-in-string -- User templates */
  licenseTemplate = '\n${index}. ${license}',
  licenseTypeTemplate = '${text}',
  uncategorizedLicenseTemplate = '${name} (${version})',
  /* eslint-enable no-template-curly-in-string -- User templates */
  filteredTypes = null,
  completePackageList = null,
  textColor = defaultTextColor,
  licenseTypeColor = []
}) => {
  if (!outputPath || typeof outputPath !== 'string') {
    throw new TypeError('Bad output path provided.');
  }
  if (typeof textColor === 'string') {
    textColor = textColor.split(',');
  }

  const licenseTypeColorInfo = /** @type {[string, string[]][]} */ (
    licenseTypeColor.map((typeAndColor) => {
      const [type, colors] = typeAndColor.split('=', 2);
      return [type, colors.split(',')];
    })
  );
  const customLicenseTypeToColor = new Map(
    licenseTypeColorInfo
  );

  const licenses = completePackageList || await getLicensesMap({
    allDevelopment,
    packagePath,
    corrections,
    licenseInfoPath,
    production,
    packageJson
  });
  /* c8 ignore next 3 -- Defensive; only for type narrowing */
  if (!licenses) {
    throw new Error('No licenses found');
  }

  const usedLicenses = [];
  const licenseTypesWithUncategorized = Object.entries(licenseTypes).map((
    [type, {color, text}]
  ) => {
    if (!licenses.has(type)) {
      licenses.set(type, new Set());
    }

    /**
     * @param {"custom" | "missing" | "uncategorized" | "unlicensed"} typ
     * @param {string} templ
     */
    const specialTemplate = (typ, templ) => {
      const mapped = [...(
        /** @type {import('./getLicenses.js').LicensesSet} */ (
          licenses.get(typ)
        )
      )].map((licenseInfo) => {
        const {name, version, custom, license} =
          /**
           * @type {{
           *   name: string,
           *   version: string,
           *   custom: string,
           *   license: string
           * }}
           */ (
            licenseInfo
          );

        return template(templ, {
          // `license` is `null` for these types (uncategorized/custom/
          //  unlicensed/missing); avoid interpolating the literal
          //  string "null" into user-supplied templates that reference
          //  `${license}`.
          name, version, custom, license: license ?? ''
        });
      });
      if (!mapped.length) {
        return;
      }

      // Get rid of objects now that data mapped
      const set = /** @type {import('./getLicenses.js').LicensesSet} */ (
        licenses.get(type)
      );
      set.clear();
      mapped.forEach((item) => {
        set.add(item);
      });
    };

    switch (type) {
    case 'uncategorized':
    case 'custom':
    case 'unlicensed':
    case 'missing':
      specialTemplate(type, uncategorizedLicenseTemplate);
      break;
    default:
      break;
    }

    // Special types were mapped to strings by `specialTemplate` above
    const licenseList = /** @type {string[]} */ ([...(
      /** @type {import('./getLicenses.js').LicensesSet} */ (
        licenses.get(type)
      )
    )]);
    const licenseCount = licenseList.length;
    usedLicenses.push(...licenseList);
    return /** @type {[string, LicenseTypeInfo]} */ ([
      type, {color, text, licenseCount, licenseList}
    ]);
  });

  const filteredTypesArr = filteredTypes
    ? filteredTypes.split(',')
    : [];

  let filteredLicenseTypes = licenseTypesWithUncategorized;
  if (filteredTypesArr.length) {
    const nonemptyPos = filteredTypesArr.indexOf('nonempty');
    const checkNonempty = nonemptyPos !== -1;
    if (checkNonempty) {
      filteredTypesArr.splice(nonemptyPos, 1);
    }
    filteredLicenseTypes = filteredLicenseTypes.filter((
      [type, {licenseCount}]
    ) => {
      return (checkNonempty && licenseCount) || filteredTypesArr.includes(type);
    }).toSorted(([typeA], [typeB]) => {
      return filteredTypesArr.indexOf(typeA) - filteredTypesArr.indexOf(typeB);
    });
  }

  const licensesWithColors = filteredLicenseTypes.map((
    [type, {color, text, licenseCount, licenseList}]
  ) => {
    /**
     * @param {string} license
     * @param {string} index
     */
    const glue = (license, index) => {
      return template(licenseTemplate, {
        license,
        index
      });
    };
    return [
      `${template(licenseTypeTemplate, {
        text,
        licenseCount: String(licenseCount)
      })}\n${licenseCount
        // eslint-disable-next-line unicorn/require-array-sort-compare -- Ok
        ? licenseList.toSorted().map((license, i) => {
          return glue(license, String(i + 1));
        }).join('')
        : ''
      }`,
      ...(/** @type {string[]} */ (customLicenseTypeToColor.has(type)
        ? customLicenseTypeToColor.get(type)
        : color))
    ];
  });

  const sections = [
    [template(textTemplate, {
      licenseCount: String(usedLicenses.length)
    }), ...textColor],
    ...licensesWithColors
  ];

  if (logging === 'verbose') {
    // eslint-disable-next-line no-console -- CLI
    console.log('Using licenses', licenses, '\nprinting sections:\n', sections);
  }

  const svg = await badgeUp(sections);
  await writeFile(outputPath, svg);
};

export {getLicensesMap};

export default licenseBadger;
