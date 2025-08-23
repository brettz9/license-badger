#!/usr/bin/env node

import {cliBasics} from 'command-line-basics';
import getLicenseType from '../src/getLicenseType.js';

const optionDefinitions = await cliBasics(
  import.meta.dirname + '/../src/glt-optionDefinitions.js',
  {
    packageJsonPath: import.meta.dirname + '/../package.json'
  }
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
