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
  extends: ['ash-nazg/sauron-node-script-overrides'],
  parserOptions: {
    ecmaVersion: 2018
  },
  overrides: [
    {
      files: '*.md/*.js',
      extends: ['ash-nazg/sauron-node-script-overrides'],
      globals: {
        require: 'readonly',
        license: 'readonly',
        licenseBadger: 'readonly'
      },
      rules: {
        'node/no-missing-require': ['error', {
          allowModules: ['license-badger']
        }]
      }
    },
    {
      extends: [
        'ash-nazg/sauron-node-script-overrides',
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
        ecmaVersion: 2018
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
    'node/no-missing-require': 0,

    // We need multiple exports
    'node/exports-style': 0
  }
};
