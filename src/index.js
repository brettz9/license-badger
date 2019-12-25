'use strict';

/*
1. Waiting on whether might avoid need for specifying `licenses`/`packages`
   as alluded to in comment at https://github.com/jslicense/licensee.js/pull/61
*/

const utils = require('util');
const badgeUp = utils.promisify(require('badge-up'));

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
    ({licenses} = await getLicenses());
  } catch (err) {
    console.log('err', err);
    throw err;
  }

  const sections = [
    ['Licenses', textColor],
    // Todo: Filter out specific unwanted categories when empty
    // Todo: Make version that only iterates what user has
    ...[...licenseTypeMap].map(([type, {color, text}]) => {
      return [
        `${text}:\n\n${licenses[type].join('\n')}`,
        customLicenseTypeToColor.has(type)
          ? customLicenseTypeToColor.get(type)
          : color
      ];
    })
  ];

  return licenses;
  // return badgeUp.v2(sections);
};
