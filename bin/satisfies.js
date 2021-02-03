#!/usr/bin/env node
'use strict';

const {join} = require('path');
const {cliBasics} = require('command-line-basics');
const satisfies = require('../src/satisfies.js');

const optionDefinitions = cliBasics(
  join(__dirname, '../src/satisfies-optionDefinitions.js')
);

if (!optionDefinitions) { // cliBasics handled
  process.exit();
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
