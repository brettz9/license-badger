'use strict';

/*
1. Waiting on whether might avoid need for specifying `licenses`/`packages`
   as alluded to in comment at https://github.com/jslicense/licensee.js/pull/61
*/

const fs = require('fs');
const bu = require('badge-up');
const template = require('es6-template-strings');
const promisify = require('./promisify.js');

const writeFile = promisify(fs.writeFile);
const badgeUp = promisify(bu.v2.bind(bu.v2));

const getLicenses = require(
  './getLicenses.js'
);

const defaultTextColor = ['navy'];
const licenseTypes = [
  ['publicDomain', {
    color: ['darkgreen'],
    text: 'Public domain'
  }],
  ['permissive', {
    color: ['green'],
    text: 'Permissive'
  }],
  ['weaklyProtective', {
    color: ['yellow'],
    text: 'Weakly protective'
  }],
  ['protective', {
    color: ['pink'],
    text: 'Protective'
  }],
  ['networkProtective', {
    color: ['FF69B4'],
    text: 'Network protective'
  }],
  ['reuseProtective', {
    color: ['red'],
    text: 'Reuse protective'
  }],
  ['unlicensed', {
    color: ['black'],
    text: 'Unlicensed'
  }],
  ['uncategorized', {
    color: ['gray'],
    text: 'Uncategorized'
  }]
];

/**
 * @param {LicenseBadgerOptions} options
 * @returns {Promise<void>}
 */
module.exports = async ({
  path,
  textTemplate = 'Licenses',
  /* eslint-disable no-template-curly-in-string */
  licenseTemplate = '\n${index}. ${license}',
  licenseTypeTemplate = '${text}',
  uncategorizedLicenseTemplate = '${name} (${version})',
  /* eslint-enable no-template-curly-in-string */
  licensePath,
  filteredTypes,
  textColor = defaultTextColor,
  licenseTypeColor = []
}) => {
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
    ({licenses} = await getLicenses({licensePath}));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('err', err);
    throw err;
  }

  const usedLicenses = [];
  const licenseTypesWithUncategorized = licenseTypes.map((
    [type, {color, text}]
  ) => {
    const oldType = type;
    if (!licenses.get(type)) {
      type = 'uncategorized';
      if (!licenses.get(type) && type !== null) {
        licenses.set(type, new Set());
      }
    }
    if (oldType === 'uncategorized') {
      licenses.get(oldType).add(...([...licenses.get(null)]).map((
        {name, version}
      ) => {
        return template(uncategorizedLicenseTemplate, {
          name, version
        });
      }));
    }

    const licenseList = [...licenses.get(type)];
    const licenseCount = licenseList.length;
    usedLicenses.push(...licenseList);
    return [type, {color, text, oldType, licenseCount, licenseList}];
  });

  filteredTypes = filteredTypes
    ? filteredTypes.split(',')
    : [];

  let filteredLicenseTypes = licenseTypesWithUncategorized;
  const nonemptyPos = filteredTypes.indexOf('nonempty');
  if (nonemptyPos > -1) {
    filteredTypes.splice(nonemptyPos, 1);
    filteredLicenseTypes = filteredLicenseTypes.filter((
      [, {licenseCount, oldType}]
    ) => {
      return licenseCount || filteredTypes.includes(oldType);
    });
  }

  const licensesWithColors = filteredLicenseTypes.map((
    [type, {color, text, oldType, licenseCount, licenseList}]
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
      ...(customLicenseTypeToColor.has(oldType)
        ? customLicenseTypeToColor.get(oldType)
        : color)
    ];
  });

  const sections = [
    [template(textTemplate, {
      licenseCount: usedLicenses.length
    }), ...textColor],
    ...licensesWithColors
  ];

  // eslint-disable-next-line no-console
  console.log('Printing sections', sections, '\nusing licenses:\n', licenses);

  const svg = await badgeUp(sections);
  await writeFile(path, svg);
};
