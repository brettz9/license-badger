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
  }
};
