#!/usr/bin/env node
'use strict';

const {join} = require('path');
const satisfies = require('npm-consider/lib/satisfies');
const {cliBasics} = require('command-line-basics');

const optionDefinitions = cliBasics(
  join(__dirname, '../src/satisfies-optionDefinitions.js')
);

if (!optionDefinitions) { // cliBasics handled
  process.exit();
}

// eslint-disable-next-line no-console
console.log(satisfies(...optionDefinitions.licenseExpressions));
