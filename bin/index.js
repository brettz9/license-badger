#!/usr/bin/env node

import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

import {cliBasics} from 'command-line-basics';
import mainScript from '../src/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const optionDefinitions = await cliBasics(
  join(__dirname, '../src/optionDefinitions.js')
);

if (!optionDefinitions) { // cliBasics handled
  process.exit(0);
}

// Use `optionDefinitions`
await mainScript(optionDefinitions);
