import ashNazg from 'eslint-config-ash-nazg';

export default [
  {
    ignores: [
      'coverage',
      '.nyc_output'
    ]
  },
  ...ashNazg(['sauron', 'node']),
  {
    files: ['*.md/*.js'],
    languageOptions: {
      globals: {
        require: 'readonly',
        license: 'readonly',
        licenseBadger: 'readonly'
      }
    },
    rules: {
      'import/no-unresolved': ['error', {
        ignore: [String.raw`license-badger/src/getLicenseType\.js`]
      }],
      'n/no-missing-import': ['error', {
        allowModules: ['license-badger']
      }]
    }
  },
  {
    rules: {
      // Not used by Node
      'compat/compat': 0,

      // fs/promises
      'n/no-missing-require': 0,

      // We need multiple exports
      'n/exports-style': 0
    }
  }
];
