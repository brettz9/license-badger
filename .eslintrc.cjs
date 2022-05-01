'use strict';
module.exports = {
  env: {
    'shared-node-browser': false,
    node: true,
    es6: true
  },
  settings: {
    polyfills: [
    ]
  },
  extends: ['ash-nazg/sauron-node-overrides'],
  parserOptions: {
    ecmaVersion: 2022
  },
  overrides: [
    {
      files: '*.md/*.js',
      extends: ['ash-nazg/sauron-node-overrides'],
      globals: {
        require: 'readonly',
        license: 'readonly',
        licenseBadger: 'readonly'
      },
      rules: {
        'import/no-unresolved': ['error', {
          ignore: ['license-badger/src/getLicenseType\\.js']
        }],
        'n/no-missing-import': ['error', {
          allowModules: ['license-badger']
        }]
      }
    },
    {
      extends: [
        'ash-nazg/sauron-node-overrides',
        'plugin:chai-expect/recommended',
        'plugin:chai-friendly/recommended'
      ],
      files: ['test/**'],
      globals: {
        expect: true
      },
      env: {
        mocha: true
      },
      parserOptions: {
        ecmaVersion: 2022
      },
      rules: {
        'compat/compat': 0
      }
    }
  ],
  rules: {
    // Not used by Node
    'compat/compat': 0,

    // fs/promises
    'n/no-missing-require': 0,

    // We need multiple exports
    'n/exports-style': 0
  }
};
