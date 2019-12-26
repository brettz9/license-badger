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
    description: 'Color for "Licenses" subject. Follow by comma for ' +
      'additional (e.g., to add a stroke color)',
    typeLabel: getBracketedChalkTemplateEscape(
      'underline <typeName>=<color> (<color>: CSS-Color|Hex as: ' +
        'ffffff|Hex stroke as s{ffffff})'
    )
  },
  {
    name: 'licenseTypeColor', type: String,
    multiple: true,
    description: 'Key-value set for mapping a license type name to color. ' +
      'Reuse for different types. Follow by comma for additional (e.g., to ' +
      'add a stroke color)',
    typeLabel: getBracketedChalkTemplateEscape(
      'underline <typeName>=<color> (<color>: CSS-Color|Hex as: ' +
        'ffffff|Hex stroke as s{ffffff})'
    )
  },
  {
    name: 'textTemplate', type: String,
    description: 'Template for text of license badge; defaults to: ' +
      '"License"; passed `licenseCount`; remember to escape `$` with ' +
      'backslash for CLI use',
    typeLabel: '{underline textTemplate}'
  },
  {
    name: 'licenseTemplate', type: String,
    description: 'Template for listing individual licenses; defaults ' +
      // eslint-disable-next-line no-template-curly-in-string
      'to: "\n${index}. ${license}"; passed `license` and `index` (1-based); ' +
      'remember to escape `$` with backslash for CLI use',
    typeLabel: '{underline licenseTemplate}'
  },
  {
    name: 'licenseTypeTemplate', type: String,
    description: 'Template for listing individual license types; defaults ' +
      // eslint-disable-next-line no-template-curly-in-string
      'to: "${text}"; passed `text` and `licenseCount`; remember to escape ' +
      '`$` with backslash for CLI use',
    typeLabel: '{underline licenseTypeTemplate}'
  },
  {
    name: 'path', type: String, defaultOption: true,
    description: 'Path to which to save the file',
    typeLabel: '{underline path}'
  },
  {
    name: 'licensePath', type: String, alias: 'l',
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
