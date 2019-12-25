'use strict';

const pkg = require('../package.json');

// Todo: We really need a comamnd-line-args-TO-typedef-jsdoc generator!
/**
* @typedef {PlainObject} LicenseBadgerOptions
*/

const getBracketedChalkTemplateEscape = (s) => {
  return '{' + s.replace(/[{}\\]/gu, (ch) => {
    return `\\\\u${ch.codePointAt().toString(16).padStart(4, '0')}`;
  }) + '}';
};

const optionDefinitions = [
  {
    name: 'textColor', type: String,
    description: 'Color for "Licenses" subject',
    typeLabel: getBracketedChalkTemplateEscape(
      'underline <typeName>=<color> (<color>: CSS-Color|Hex as: ' +
        '{ffffff}|Hex stroke as s{ffffff})'
    )
  },
  {
    name: 'licenseTypeColor', type: String,
    multiple: true,
    description: 'Key-value set for mapping a license type name to color. ' +
      'Reuse for different types.',
    typeLabel: getBracketedChalkTemplateEscape(
      'underline <typeName>=<color> (<color>: CSS-Color|Hex as: ' +
        '{ffffff}|Hex stroke as s{ffffff})'
    )
  },
  {
    name: 'textTemplate', type: String,
    description: 'Template for text of license badge; defaults to: ' +
      'License\\\\n$\\{licenses.join("\\\\n")\\}',
    typeLabel: '{underline textTemplate}'
  },
  {
    name: 'licensePath', type: String, defaultOption: true,
    description: 'Path of licensesType.json file relative to the current ' +
      'working directory; defaults to "./licensesType.json"',
    typeLabel: '{underline licensePath}'
  }
];

const cliSections = [
  {
    // Add italics: `{italic textToItalicize}`
    content: pkg.description +
      '\n\n{italic license-badger [--textColor=aColor] output}'
  },
  {
    optionList: optionDefinitions
  }
];

exports.definitions = optionDefinitions;
exports.sections = cliSections;
