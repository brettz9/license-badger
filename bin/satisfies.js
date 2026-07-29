#!/usr/bin/env node

import {join} from 'node:path';
import {cliBasics} from 'command-line-basics';
import satisfies from '../src/satisfies.js';

const optionDefinitions = await cliBasics(
  join(import.meta.dirname, '/../src/satisfies-optionDefinitions.js'),
  {
    packageJsonPath: join(import.meta.dirname, '/../package.json')
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
