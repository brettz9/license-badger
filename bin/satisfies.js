#!/usr/bin/env node

import {cliBasics} from 'command-line-basics';
import satisfies from '../src/satisfies.js';

const optionDefinitions = await cliBasics(
  import.meta.dirname + '/../src/satisfies-optionDefinitions.js',
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
