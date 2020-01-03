'use strict';

const pkg = require('../package.json');

// Todo: We really need a comamnd-line-args-TO-typedef-jsdoc generator!
/* eslint-disable jsdoc/require-property */
/**
* @typedef {PlainObject} LicenseBadgerOptions
*/
/* eslint-enable jsdoc/require-property */

const getChalkTemplateSingleEscape = (s) => {
  return s.replace(/[{}\\]/gu, (ch) => {
    return `\\u${ch.codePointAt().toString(16).padStart(4, '0')}`;
  });
};

const getChalkTemplateEscape = (s) => {
  return s.replace(/[{}\\]/gu, (ch) => {
    return `\\\\u${ch.codePointAt().toString(16).padStart(4, '0')}`;
  });
};

const getBracketedChalkTemplateEscape = (s) => {
  return '{' + getChalkTemplateEscape(s) + '}';
};

const optionDefinitions = [
  {
    name: 'outputPath', type: String, defaultOption: true, alias: 'o',
    description: 'Path to which to save the file; default to ' +
      '"coverage-badge.svg" in the current working directory',
    typeLabel: '{underline outputPath}'
  },
  {
    name: 'packagePath', type: String, alias: 'p',
    description: 'Path to the `package.json` directory; defaults to the ' +
      'current working directory',
    typeLabel: '{underline packagePath}'
  },
  {
    name: 'licenseInfoPath', type: String, alias: 'l',
    description: 'Path of licenseInfo.json file relative to the current ' +
      'working directory; defaults to "licenseInfo.json" of the current ' +
      'working directory',
    typeLabel: '{underline licenseInfoPath}'
  },
  {
    name: 'corrections', type: Boolean, alias: 'c',
    description: 'Whether to apply corrections of licensee.js. ' +
      'Default is `false`.'
  },
  {
    name: 'filteredTypes', type: String, alias: 'f',
    description: 'Comma-separated list of specific license types to display ' +
      'and/or "nonempty"; defaults to no filter; can be one of ' +
      '"publicDomain"|"permissive"|"weaklyProtective"|\n' +
      '"protective"|"networkProtective"|"reuseProtective"|\n' +
      '"unlicensed"|"uncategorized"',
    typeLabel: '{underline list of "nonempty" or value}'
  },
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
      getChalkTemplateSingleEscape(
        // eslint-disable-next-line no-template-curly-in-string
        'to: "\n${index}. ${license}"; passed `license` and `index` (1-based); '
      ) +
      'remember to escape `$` with backslash for CLI use',
    typeLabel: '{underline licenseTemplate}'
  },
  {
    name: 'uncategorizedLicenseTemplate', type: String,
    description: 'Template for listing individual uncategorized projects; ' +
      getChalkTemplateSingleEscape(
        // eslint-disable-next-line no-template-curly-in-string
        'defaults to: "${name} (${version})"; passed `license`, `name`, and '
      ) +
      '`version`; remember to escape `$` with backslash for CLI use',
    typeLabel: '{underline uncategorizedLicenseTemplate}'
  },
  {
    name: 'licenseTypeTemplate', type: String,
    description: 'Template for listing individual license types; defaults ' +
      getChalkTemplateSingleEscape(
        // eslint-disable-next-line no-template-curly-in-string
        'to: "${text}"; passed `text` and `licenseCount`; remember to escape '
      ) +
      '`$` with backslash for CLI use',
    typeLabel: '{underline licenseTypeTemplate}'
  },
  {
    name: 'logging', type: String,
    description: 'Logging level; can be "verbose"; default is empty.',
    typeLabel: '{underline logging}'
  }
];

const cliSections = [
  {
    // Add italics: `{italic textToItalicize}`
    content: pkg.description +
      '\n\n{italic license-badger -p=packagePath -l=licenseInfoPath outputPath}'
  },
  {
    optionList: optionDefinitions
  }
];

exports.getBracketedChalkTemplateEscape = getBracketedChalkTemplateEscape;
exports.definitions = optionDefinitions;
exports.sections = cliSections;
