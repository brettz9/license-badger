import {readFile} from 'fs/promises';

const pkg = JSON.parse(await readFile(
  import.meta.dirname + '/../package.json'
));

// Todo: We really need a comamnd-line-args-TO-typedef-jsdoc generator!
/* eslint-disable jsdoc/require-property -- See schema below */
/**
* @typedef {PlainObject} GetLicenseTypeOptions
*/
/* eslint-enable jsdoc/require-property -- See schema below */

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

export {optionDefinitions as definitions, cliSections as sections};
