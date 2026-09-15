import {expect} from 'chai';

import {getPnpmProdReachablePackages} from
  '../src/getWhitelistedRootPackagesLicenses.js';

describe('getPnpmProdReachablePackages', function () {
  it('returns an empty set when there is no root importer', () => {
    const reachable = getPnpmProdReachablePackages({});
    expect(reachable).to.be.a('Set');
    expect(reachable.size).to.equal(0);
  });

  it(
    'dedupes a dependency reachable through more than one path ' +
    '(and tolerates cycles)',
    () => {
      // `b` and `c` both depend on the shared `d`, and `d` depends back
      //  on `b`, forming a cycle; none of this should cause `d` (or `b`)
      //  to be visited/queued more than once.
      const pnpmLock = {
        importers: {
          '.': {
            dependencies: {
              b: {version: '1.0.0'},
              c: {version: '1.0.0'}
            }
          }
        },
        snapshots: {
          'b@1.0.0': {
            dependencies: {d: '1.0.0'}
          },
          'c@1.0.0': {
            dependencies: {d: '1.0.0'}
          },
          'd@1.0.0': {
            dependencies: {b: '1.0.0'}
          }
        }
      };
      const reachable = getPnpmProdReachablePackages(pnpmLock);
      const sorted = [...reachable].toSorted((a, b) => a.localeCompare(b));
      expect(sorted).to.deep.equal(['b@1.0.0', 'c@1.0.0', 'd@1.0.0']);
    }
  );

  it(
    'tolerates a dependency with no matching `snapshots` entry ' +
    '(e.g., a skipped optional dependency)',
    () => {
      const pnpmLock = {
        importers: {
          '.': {
            dependencies: {
              e: {version: '1.0.0'}
            }
          }
        },
        snapshots: {
          'e@1.0.0': {
            optionalDependencies: {
              'skipped-optional': '1.0.0'
            }
          }
        }
      };
      const reachable = getPnpmProdReachablePackages(pnpmLock);
      const sorted = [...reachable].toSorted((a, b) => a.localeCompare(b));
      expect(sorted).to.deep.equal(['e@1.0.0', 'skipped-optional@1.0.0']);
    }
  );

  it('strips peer-dependency suffixes from reachable keys', () => {
    const pnpmLock = {
      importers: {
        '.': {
          dependencies: {
            f: {version: '1.0.0(peer@2.0.0)'}
          }
        }
      },
      snapshots: {
        'f@1.0.0(peer@2.0.0)': {}
      }
    };
    const reachable = getPnpmProdReachablePackages(pnpmLock);
    expect([...reachable]).to.deep.equal(['f@1.0.0']);
  });
});
