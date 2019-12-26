'use strict';

/*
1. Waiting on whether might avoid need for specifying `licenses`/`packages`
   as alluded to in comment at https://github.com/jslicense/licensee.js/pull/61
*/

const fs = require('fs');
const bu = require('badge-up');
const promisify = require('./promisify.js');

const writeFile = promisify(fs.writeFile);
const badgeUp = promisify(bu.v2.bind(bu.v2));

const getLicenses = require(
  './getLicenses.js'
);

const defaultTextColor = ['navy'];
const licenseTypeMap = new Map([
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
]);

/**
 * @param {LicenseBadgerOptions} options
 * @returns {void}
 */
module.exports = async ({
  path,
  licensePath,
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
    // Todo: Ability to request all deps, devDeps, and optionally
    //   specific packages (merged with source?)
    ({licenses} = await getLicenses({licensePath}));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('err', err);
    throw err;
  }

  const sections = [
    // Todo: Use `textTemplate`
    ['Licenses', ...textColor],
    // Todo: Filter out specific unwanted categories when empty
    // Todo: Make version that only iterates what user has
    ...[...licenseTypeMap].map(([type, {color, text}]) => {
      const oldType = type;
      if (!licenses.get(type)) {
        type = 'uncategorized';
        if (!licenses.get(type) && type !== null) {
          licenses.set(type, new Set());
        }
      }
      // Todo: List names of uncategorized instead of "unknown"
      if (oldType === 'uncategorized') {
        licenses.get(oldType).add('Unknown');
      }

      // Todo: Make dynamic
      const glue = (license, i) => {
        return `\n${i}. ${license}`;
      };
      const licenseList = [...licenses.get(type)];
      return [
        `${text}\n${licenseList.length
          ? licenseList.sort().map((license, i) => {
            return glue(license, i + 1);
          }).join('')
          : ''
        }`,
        ...(customLicenseTypeToColor.has(oldType)
          ? customLicenseTypeToColor.get(oldType)
          : color)
      ];
    })
  ];

  // eslint-disable-next-line no-console
  console.log('sections', sections);
  // eslint-disable-next-line no-console
  console.log('licenses', licenses);
  const svg = await badgeUp(sections);
  await writeFile(path, svg);
};
