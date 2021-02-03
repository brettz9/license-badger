#!/usr/bin/env node
'use strict';

const {join} = require('path');
const {cliBasics} = require('command-line-basics');
const getLicenseType = require('../src/getLicenseType.js');

const optionDefinitions = cliBasics(
  join(__dirname, '../src/glt-optionDefinitions.js')
);

if (!optionDefinitions) { // cliBasics handled
  process.exit();
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
