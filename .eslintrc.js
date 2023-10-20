module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'max-len': 'off',
    'import/extensions': 'off',
    'class-methods-use-this': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-useless-constructor': 'off',
    'import/prefer-default-export': 'off',
    'consistent-return': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    'import/no-extraneous-dependencies': 'off',
  },
};
