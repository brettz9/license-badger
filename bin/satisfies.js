#!/usr/bin/env node

import {join, dirname} from 'path';
import {fileURLToPath} from 'url';

import {cliBasics} from 'command-line-basics';
import satisfies from '../src/satisfies.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const optionDefinitions = await cliBasics(
  join(__dirname, '../src/satisfies-optionDefinitions.js'),
  {
    packageJsonPath: import.meta.dirname + '/../package.json'
  }
);

if (!optionDefinitions) { // cliBasics handled
  process.exit(0);
}

if (!optionDefinitions.licenseExpressions ||
  optionDefinitions.licenseExpressions.length < 2
) {
  // eslint-disable-next-line no-console -- CLI
  console.error(
    'Please provide at least two license arguments (the `licenseExpressions`).'
  );
  process.exit();
}

// eslint-disable-next-line no-console -- CLI
console.log(satisfies(...optionDefinitions.licenseExpressions));
