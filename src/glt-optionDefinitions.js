'use strict';

const pkg = require('../package.json');

// Todo: We really need a comamnd-line-args-TO-typedef-jsdoc generator!
/* eslint-disable jsdoc/require-property */
/**
* @typedef {PlainObject} LicenseBadgerOptions
*/
/* eslint-enable jsdoc/require-property */

const optionDefinitions = [
  {
    name: 'licenseExpression', type: String, defaultOption: true, alias: 'l',
    description: 'License expression for which to obtain a type (degree of ' +
      'permissiveness)',
    typeLabel: '{underline licenseExpression}'
  }
];

const cliSections = [
  {
    // Add italics: `{italic textToItalicize}`
    content: pkg.description +
      '\n\n{italic get-license-type licenseExpressions}'
  },
  {
    optionList: optionDefinitions
  }
];

exports.definitions = optionDefinitions;
exports.sections = cliSections;
