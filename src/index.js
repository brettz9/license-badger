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

const defaultTextColor = 'gray';
const licenseTypeMap = new Map([
  ['publicDomain', {
    color: 'green',
    text: 'Public domain'
  }],
  ['permissive', {
    color: 'green',
    text: 'Permissive'
  }],
  ['weaklyProtective', {
    color: 'yellow',
    text: 'Weakly protective'
  }],
  ['protective', {
    color: 'pink',
    text: 'Protective'
  }],
  ['networkProtective', {
    color: 'red',
    text: 'Network protective'
  }],
  ['reuseProtective', {
    color: 'red',
    text: 'Reuse protective'
  }],
  ['uncategorized', {
    color: 'red',
    text: 'Uncategorized'
  }],
  ['unlicensed', {
    color: 'red',
    text: 'Unlicensed'
  }]
]);

/**
 * @param {LicenseBadgerOptions} options
 * @returns {void}
 */
module.exports = async ({
  textColor = defaultTextColor,
  licenseTypeColor = []
}) => {
  const customLicenseTypeToColor = new WeakMap(
    licenseTypeColor.map((typeAndColor) => {
      return typeAndColor.split('=').slice(0, 2);
    })
  );

  let licenses;
  try {
    // Todo: Ability to request all deps, devDeps, and optionally
    //   specific packages (merged with source?)
    ({licenses} = await getLicenses());
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('err', err);
    throw err;
  }

  const sections = [
    ['Licenses', textColor],
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
      if (oldType === 'uncategorized') {
        licenses.get(oldType).add('unknown');
      }
      return [
        `${text}:\n\n${[...licenses.get(type)].join('\n')}`,
        customLicenseTypeToColor.has(type)
          ? customLicenseTypeToColor.get(type)
          : color
      ];
    })
  ];

  // eslint-disable-next-line no-console
  console.log('sections', sections);
  // eslint-disable-next-line no-console
  console.log('licenses', licenses);
  const svg = await badgeUp(sections);
  await writeFile('test.svg', svg);
};
