'use strict';
module.exports = {
  env: {
    browser: false,
    node: true,
    es6: true
  },
  settings: {
    polyfills: [
    ]
  },
  extends: ['ash-nazg/sauron', 'plugin:node/recommended-script'],
  overrides: [
    {
      files: '*.md',
      extends: ['plugin:node/recommended-module'],
      globals: {
        require: 'readonly',
        license: 'readonly',
        licenseBadger: 'readonly'
      },
      rules: {
        'import/no-anonymous-default-export': 0,
        strict: 0
      }
    },
    {
      files: '*.html',
      rules: {
        'import/unambiguous': 0
      }
    },
    {
      extends: [
        'plugin:chai-expect/recommended',
        'plugin:chai-friendly/recommended'
      ],
      files: ['test/**'],
      globals: {
        expect: true
      },
      env: {
        mocha: true
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'script'
  },
  rules: {
    'import/no-commonjs': 0,

    // Not used by Node
    'compat/compat': 0,
    // Added back by `plugin:node/recommended-script` above, so disable
    'no-process-exit': 0
  }
};
