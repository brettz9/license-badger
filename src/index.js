/*
1. Waiting on whether might avoid need for specifying `licenses`/`packages`
   as alluded to in comment at https://github.com/jslicense/licensee.js/pull/61
*/

import {readFile, writeFile} from 'fs/promises';
import {join, resolve} from 'path';

import BadgeUp from '@rpl/badge-up';
import {getLicenseTypeInfo} from 'license-types';
import template from 'es6-template-strings';

import {getLicenses, getTypeInfoForLicense} from './getLicenses.js';

const licenseTypes = await getLicenseTypeInfo();

const badgeUp = BadgeUp.v2;

const defaultTextColor = ['navy'];

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
      const {name, version, license} = JSON.parse(await readFile(
        join(packagePath || process.cwd(), 'package.json')
      ));
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
 * @param {LicenseBadgerOptions} options
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

  const licenseTypeColorInfo = licenseTypeColor.map((typeAndColor) => {
    const [type, colors] = typeAndColor.split('=');
    return [type, colors.split(',')];
  });
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

  const usedLicenses = [];
  const licenseTypesWithUncategorized = Object.entries(licenseTypes).map((
    [type, {color, text}]
  ) => {
    if (!licenses.has(type)) {
      licenses.set(type, new Set());
    }

    const specialTemplate = (typ, templ) => {
      const mapped = [...licenses.get(typ)].map((
        {name, version, custom, license}
      ) => {
        return template(templ, {
          name, version, custom, license
        });
      });
      if (mapped.length) {
        // Get rid of objects now that data mapped
        const set = licenses.get(type);
        set.clear();
        mapped.forEach((item) => {
          set.add(item);
        });
      }
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

    const licenseList = [...licenses.get(type)];
    const licenseCount = licenseList.length;
    usedLicenses.push(...licenseList);
    return [type, {color, text, licenseCount, licenseList}];
  });

  filteredTypes = filteredTypes
    ? filteredTypes.split(',')
    : [];

  let filteredLicenseTypes = licenseTypesWithUncategorized;
  if (filteredTypes.length) {
    const nonemptyPos = filteredTypes.indexOf('nonempty');
    const checkNonempty = nonemptyPos > -1;
    if (checkNonempty) {
      filteredTypes.splice(nonemptyPos, 1);
    }
    filteredLicenseTypes = filteredLicenseTypes.filter((
      [type, {licenseCount}]
    ) => {
      return (checkNonempty && licenseCount) || filteredTypes.includes(type);
    }).sort(([typeA], [typeB]) => {
      return filteredTypes.indexOf(typeA) > filteredTypes.indexOf(typeB);
    });
  }

  const licensesWithColors = filteredLicenseTypes.map((
    [type, {color, text, licenseCount, licenseList}]
  ) => {
    const glue = (license, index) => {
      return template(licenseTemplate, {
        license,
        index
      });
    };
    return [
      `${template(licenseTypeTemplate, {
        text,
        licenseCount
      })}\n${licenseCount
        ? licenseList.sort().map((license, i) => {
          return glue(license, i + 1);
        }).join('')
        : ''
      }`,
      ...(customLicenseTypeToColor.has(type)
        ? customLicenseTypeToColor.get(type)
        : color)
    ];
  });

  const sections = [
    [template(textTemplate, {
      licenseCount: usedLicenses.length
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
