module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb-typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    // latest React & Typescript no longer require an explict React import in jsx
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',

    // named exports are better
    'import/prefer-default-export': 'off',

    // prefer default parameters instead
    'react/require-default-props': 'off',
  },
};
