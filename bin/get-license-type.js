#!/usr/bin/env node
'use strict';

const {join} = require('path');
const getLicenseType = require('npm-consider/lib/getLicenseType');
const {cliBasics} = require('command-line-basics');

const optionDefinitions = cliBasics(
  join(__dirname, '../src/glt-optionDefinitions.js')
);

if (!optionDefinitions) { // cliBasics handled
  process.exit();
}

// eslint-disable-next-line no-console -- CLI
console.log(getLicenseType(optionDefinitions.licenseExpression));
