#!/usr/bin/env node

import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

import {cliBasics} from 'command-line-basics';
import getLicenseType from '../src/getLicenseType.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const optionDefinitions = await cliBasics(
  join(__dirname, '../src/glt-optionDefinitions.js')
);

if (!optionDefinitions) { // cliBasics handled
  process.exit(0);
}

if (!optionDefinitions.licenseExpression) {
  // eslint-disable-next-line no-console -- CLI
  console.error(
    'Please provide a single license argument'
  );
  process.exit();
}

// eslint-disable-next-line no-console -- CLI
console.log(getLicenseType(optionDefinitions.licenseExpression));
