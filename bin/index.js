#!/usr/bin/env node

import {cliBasics} from 'command-line-basics';
import mainScript from '../src/index.js';

const optionDefinitions = await cliBasics(
  import.meta.dirname + '/../src/optionDefinitions.js',
  {
    packageJsonPath: import.meta.dirname + '/../package.json'
  }
);

if (!optionDefinitions) { // cliBasics handled
  process.exit(0);
}

// Use `optionDefinitions`
await mainScript(optionDefinitions);
