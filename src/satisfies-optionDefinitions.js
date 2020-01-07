'use strict';

const pkg = require('../package.json');

// Todo: We really need a comamnd-line-args-TO-typedef-jsdoc generator!
/* eslint-disable jsdoc/require-property */
/**
* @typedef {PlainObject} SatisfiesOptions
*/
/* eslint-enable jsdoc/require-property */

const optionDefinitions = [
  {
    name: 'licenseExpressions', type: String,
    multiple: true, defaultOption: true, alias: 'l',
    description: 'License expressions, the first of which is checked ' +
      'against the second to see if it is satisfied by it.',
    typeLabel: '{underline licenseExpressions}'
  }
];

const cliSections = [
  {
    // Add italics: `{italic textToItalicize}`
    content: pkg.description +
      '\n\n{italic satisfies expr1 expr2}'
  },
  {
    optionList: optionDefinitions
  }
];

exports.definitions = optionDefinitions;
exports.sections = cliSections;
