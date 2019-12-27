'use strict';

const {promisify} = require('util');
const {join} = require('path');
const {execFile: ef} = require('child_process');

const execFile = promisify(ef);

const binFile = join(__dirname, '../bin/index.js');

describe('Binary', function () {
  it('should return help', async function () {
    this.timeout(5000);
    const {stdout} = await execFile(binFile, ['-h']);
    expect(stdout).to.contain(
      "Builds a badge indicating your project's license(s)"
    );
  });

  it('should return execute', async function () {
    this.timeout(5000);
    const {stdout, stderr} = await execFile(
      binFile,
      ['-l', 'test/fixtures/licenseInfo.json', 'test.svg']
    );
    if (stderr) {
      // eslint-disable-next-line no-console
      console.log('stderr', stderr);
    }
    expect(stdout).to.contain('Printing sections');
    expect(stderr).to.equal('');
  });
});
