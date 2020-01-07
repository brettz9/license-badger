#!/usr/bin/env node
'use strict';

const getLicenseType = require('npm-consider/lib/getLicenseType');

// eslint-disable-next-line no-console
console.log(getLicenseType(process.argv[2]));
