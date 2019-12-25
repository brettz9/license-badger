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
      rules: {

      }
    },
    {
      files: '*.html',
      rules: {
        'import/unambiguous': 0
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
