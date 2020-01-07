'use strict';

/*
1. Waiting on whether might avoid need for specifying `licenses`/`packages`
   as alluded to in comment at https://github.com/jslicense/licensee.js/pull/61
*/

const fs = require('fs');
const {promisify} = require('util');
const {resolve} = require('path');

const bu = require('badge-up');
const template = require('es6-template-strings');

const writeFile = promisify(fs.writeFile);
const badgeUp = promisify(bu.v2.bind(bu.v2));

const getLicenses = require(
  './getLicenses.js'
);

const defaultTextColor = ['navy'];
const licenseTypes = [
  ['publicDomain', {
    color: ['darkgreen'],
    text: 'Public\ndomain'
  }],
  ['permissive', {
    color: ['green'],
    text: 'Permissive'
  }],
  ['weaklyProtective', {
    color: ['yellow'],
    text: 'Weakly\nprotective'
  }],
  ['protective', {
    color: ['pink'],
    text: 'Protective'
  }],
  ['networkProtective', {
    color: ['FF69B4'],
    text: 'Network\nprotective'
  }],
  ['reuseProtective', {
    color: ['red'],
    text: 'Reuse\nprotective'
  }],
  ['unlicensed', {
    color: ['black'],
    text: 'Unlicensed'
  }],
  ['custom', {
    color: ['gray'],
    text: 'Custom'
  }],
  ['uncategorized', {
    // darkgray is lighter than gray!
    color: ['darkgray'],
    text: 'Uncategorized'
  }],
  ['missing', {
    color: ['lightgray'],
    text: 'Missing'
  }]
];

/**
 * @param {LicenseBadgerOptions} options
 * @returns {Promise<void>}
 */
module.exports = async ({
  packagePath,
  corrections,
  production,
  allDevelopment,
  outputPath = resolve(process.cwd(), './coverage-badge.svg'),
  licenseInfoPath = !allDevelopment &&
    resolve(process.cwd(), './licenseInfoPath.json'),
  logging = false,
  textTemplate = 'Licenses',
  /* eslint-disable no-template-curly-in-string */
  licenseTemplate = '\n${index}. ${license}',
  licenseTypeTemplate = '${text}',
  uncategorizedLicenseTemplate = '${name} (${version})',
  /* eslint-enable no-template-curly-in-string */
  filteredTypes = null,
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
    }
    if (production) {
      ({licenses} = await getLicenses({
        packagePath, corrections,
        licenses,
        production
      }));
    }
  } catch (err) {
    /* istanbul ignore next */
    // eslint-disable-next-line no-console
    console.log('err', err);
    /* istanbul ignore next */
    throw err;
  }

  const usedLicenses = [];
  const licenseTypesWithUncategorized = licenseTypes.map((
    [type, {color, text}]
  ) => {
    if (!licenses.has(type)) {
      licenses.set(type, new Set());
    }

    const specialTemplate = (typ, templ) => {
      const mapped = [...licenses.get(typ)].map((
        {name, version, custom}
      ) => {
        return template(templ, {
          name, version, custom
        });
      });
      if (mapped.length) {
        // Get rid of objects now that data mapped
        licenses.get(type).clear();
        licenses.get(type).add(...mapped);
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
  const nonemptyPos = filteredTypes.indexOf('nonempty');
  if (nonemptyPos > -1) {
    filteredTypes.splice(nonemptyPos, 1);
    filteredLicenseTypes = filteredLicenseTypes.filter((
      [type, {licenseCount}]
    ) => {
      return licenseCount || filteredTypes.includes(type);
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
    // eslint-disable-next-line no-console
    console.log('Using licenses', licenses, '\nprinting sections:\n', sections);
  }

  const svg = await badgeUp(sections);
  await writeFile(outputPath, svg);
};
