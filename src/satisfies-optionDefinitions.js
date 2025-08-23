import {readFile} from 'fs/promises';

const pkg = JSON.parse(await readFile(
  import.meta.dirname + '/../package.json'
));

// Todo: We really need a comamnd-line-args-TO-typedef-jsdoc generator!
/* eslint-disable jsdoc/require-property -- See schema below */
/**
* @typedef {PlainObject} SatisfiesOptions
*/
/* eslint-enable jsdoc/require-property -- See schema below */

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

export {optionDefinitions as definitions, cliSections as sections};
