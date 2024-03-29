import {readFile} from 'fs/promises';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const pkg = JSON.parse(await readFile(join(__dirname, '../package.json')));

// Todo: We really need a command-line-args-TO-typedef-jsdoc generator!
/* eslint-disable jsdoc/require-property -- See schema below */
/**
* @typedef {object} LicenseBadgerOptions
*/
/* eslint-enable jsdoc/require-property -- See schema below */

const getChalkTemplateSingleEscape = (s) => {
  return s.replaceAll(/[{}\\]/gu, (ch) => {
    return `\\u${ch.codePointAt().toString(16).padStart(4, '0')}`;
  });
};

const getChalkTemplateEscape = (s) => {
  return s.replaceAll(/[{}\\]/gu, (ch) => {
    return `\\\\u${ch.codePointAt().toString(16).padStart(4, '0')}`;
  });
};

const getBracketedChalkTemplateEscape = (s) => {
  return '{' + getChalkTemplateEscape(s) + '}';
};

const optionDefinitions = [
  {
    name: 'outputPath', type: String, defaultOption: true, alias: 'o',
    description: 'Path to which to save the file; defaults to ' +
      '"license-badge.svg" in the current working directory',
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
      'working directory. Set to empty string to avoid checking (e.g., if ' +
      'setting `production` only).',
    typeLabel: '{underline licenseInfoPath}'
  },
  {
    name: 'packageJson', type: Boolean, alias: 'j',
    description: 'Whether to include `license` within the `package.json` ' +
      'pointed to by `packagePath`) (possibly also using name and version); ' +
      'defaults to `false`.'
  },
  {
    name: 'corrections', type: Boolean, alias: 'c',
    description: 'Whether to apply corrections of licensee.js. ' +
      'Defaults to `false`.'
  },
  {
    name: 'production', type: Boolean,
    description: 'Whether to check production dependencies (in addition to ' +
      'any whitelisted by `licenseInfoPath`). Defaults to `false`.'
  },
  {
    name: 'allDevelopment', type: Boolean,
    description: 'Whether to check all development dependencies. Overrides ' +
      '`licenseInfoPath` as will not be limited to the packages whitelisted ' +
      'by `bundledDependencies` in the JSON file at `licenseInfoPath`). ' +
      'Defaults to `false`.'
  },
  {
    name: 'filteredTypes', type: String, alias: 'f',
    description: 'Comma-separated list of specific license types to display ' +
      'and/or "nonempty"; defaults to no filter; can be any of ' +
      '"publicDomain"|"permissive"|"weaklyProtective"|\n' +
      '"protective"|"networkProtective"|"useProtective"|"modifyProtective"|\n' +
      '"unlicensed"|"uncategorized"|"nonempty"',
    typeLabel: '{underline value or list of values}'
  },
  {
    name: 'textColor', type: String,
    description: 'Color for "Licenses" subject. Follow by comma for ' +
      'additional (e.g., to add a stroke color). Defaults to "navy".',
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
      'add a stroke color). See `src/index.js` for default colors of each ' +
      'license type.',
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
      // eslint-disable-next-line no-template-curly-in-string -- User templates
        'to: "\n${index}. ${license}"; passed `license` and `index` (1-based); '
      ) +
      'remember to escape `$` with backslash for CLI use',
    typeLabel: '{underline licenseTemplate}'
  },
  {
    name: 'uncategorizedLicenseTemplate', type: String,
    description: 'Template for listing individual uncategorized projects; ' +
      getChalkTemplateSingleEscape(
      // eslint-disable-next-line no-template-curly-in-string -- User templates
        'defaults to: "${name} (${version})"; passed `license`, `name`, '
      ) +
      '`custom` (license text after "SEE LICENSE IN "), and `version`; ' +
      'remember to escape `$` with backslash for CLI use',
    typeLabel: '{underline uncategorizedLicenseTemplate}'
  },
  {
    name: 'licenseTypeTemplate', type: String,
    description: 'Template for listing individual license types; defaults ' +
      getChalkTemplateSingleEscape(
      // eslint-disable-next-line no-template-curly-in-string -- User templates
        'to: "${text}"; passed `text` and `licenseCount`; remember to escape '
      ) +
      '`$` with backslash for CLI use',
    typeLabel: '{underline licenseTypeTemplate}'
  },
  {
    name: 'logging', type: String,
    description: 'Logging level; defaults to "off".',
    typeLabel: '{underline "verbose"|"off"}'
  }
];

const cliSections = [
  {
    // Add italics: `{italic textToItalicize}`
    content: pkg.description +
      '\n\n{italic license-badger -p=packagePath ' +
        '-l=licenseInfoPath [outputPath]}'
  },
  {
    optionList: optionDefinitions
  }
];

export {
  getChalkTemplateSingleEscape, getBracketedChalkTemplateEscape,
  optionDefinitions as definitions, cliSections as sections
};
