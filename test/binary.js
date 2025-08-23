import {promisify} from 'util';
import {join} from 'path';
import {execFile as ef} from 'child_process';
import {expect} from 'chai';

const __dirname = import.meta.dirname;

const execFile = promisify(ef);

const binFile = join(__dirname, '../bin/index.js');

const getLicenseTypeFile = join(__dirname, '../bin/get-license-type.js');
const satisfiesFile = join(__dirname, '../bin/satisfies.js');

describe('Binary', function () {
  this.timeout(8000);
  it('should log help', async function () {
    const {stdout} = await execFile(binFile, ['-h']);
    expect(stdout).to.contain(
      "Builds a badge indicating your project's license(s)"
    );
  });

  it('should log sections', async function () {
    const {stdout, stderr} = await execFile(
      binFile,
      [
        '-l', 'test/fixtures/licenseInfo.json',
        '--packagePath', './',
        '--logging', 'verbose',
        'test.svg'
      ]
    );
    if (stderr) {
      // eslint-disable-next-line no-console -- Test info
      console.log('stderr', stderr);
    }
    expect(stdout).to.contain('printing sections');
    expect(stderr).to.equal('');
  });
});

describe('getLicenseType', function () {
  this.timeout(8000);
  it('should return help', async function () {
    const {stdout} = await execFile(getLicenseTypeFile, ['-h']);
    expect(stdout).to.contain(
      'License expression for which to'
    );
  });
  it('should log type of passed argument', async function () {
    const {stdout, stderr} = await execFile(
      getLicenseTypeFile,
      [
        'MIT'
      ]
    );
    if (stderr) {
      // eslint-disable-next-line no-console -- Test info
      console.log('stderr', stderr);
    }
    expect(stdout).to.contain('permissive');
    expect(stderr).to.equal('');
  });
  it("should report error if user doesn't supply argument", async function () {
    const {stdout, stderr} = await execFile(
      getLicenseTypeFile,
      [
      ]
    );
    if (stderr) {
      // eslint-disable-next-line no-console -- Test info
      console.log('stderr', stderr);
    }
    expect(stdout).to.equal('');
    expect(stderr).to.contain('Please provide a single license argument\n');
  });
});

describe('satisfies', function () {
  this.timeout(8000);
  it('should return help', async function () {
    const {stdout} = await execFile(satisfiesFile, ['-h']);
    expect(stdout).to.contain(
      'License expressions'
    );
  });
  it('should log result of comparing expressions', async function () {
    const {stdout, stderr} = await execFile(
      satisfiesFile,
      [
        'MIT',
        '(ISC OR MIT)'
      ]
    );
    if (stderr) {
      // eslint-disable-next-line no-console -- Test info
      console.log('stderr', stderr);
    }
    expect(stdout).to.contain('true');
    expect(stderr).to.equal('');
  });

  it('should handle UNLICENSED special case', async function () {
    const {stdout, stderr} = await execFile(
      satisfiesFile,
      [
        'UNLICENSED',
        'UNLIC`'
      ]
    );
    if (stderr) {
      // eslint-disable-next-line no-console -- Test info
      console.log('stderr', stderr);
    }
    expect(stdout).to.contain('false');
    expect(stderr).to.equal('');
  });

  it(
    'should report error if user provides inadequate arguments',
    async function () {
      const {stdout, stderr} = await execFile(
        satisfiesFile,
        [
          'MIT'
        ]
      );
      if (stderr) {
        // eslint-disable-next-line no-console -- Test info
        console.log('stderr', stderr);
      }
      expect(stdout).to.equal('');
      expect(stderr).to.equal(
        'Please provide at least two license arguments ' +
          '(the `licenseExpressions`).\n'
      );
    }
  );
});
