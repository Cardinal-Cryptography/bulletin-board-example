module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  parser: '@typescript-eslint/parser',
  extends: ['airbnb', 'airbnb/hooks', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'no-use-before-define': 'off',
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md
    '@typescript-eslint/no-use-before-define': ['error'],
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
    'import/extensions': ['error', 'always', { ts: 'never', tsx: 'never' }],
    '@typescript-eslint/no-explicit-any': ['error'],
    'prettier/prettier': ['warn'],
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [{ pattern: 'components/**', group: 'external', position: 'after' }],
        'newlines-between': 'always',
      },
    ],
    'react/require-default-props': ['warn', { ignoreFunctionalComponents: true }],
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['state'] }],
    'react/jsx-props-no-spreading': 0,
    'react/jsx-curly-newline': 'warn',
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'import/prefer-default-export': 'off',
    'react/function-component-definition': [
      2,
      {
        namedComponents: ['arrow-function', 'function-declaration'],
        unnamedComponents: 'arrow-function',
      },
    ],
    'no-restricted-exports': [
      'error',
      {
        restrictedNamedExports: ['then'],
      },
    ],
  },
  settings: {
    /**
     * This setting with eslint-import-resolver-typescript package
     * solves the issue with resolving paths (import/no-unresolved)
     */
    'import/resolver': {
      typescript: {},
    },
  },
};
