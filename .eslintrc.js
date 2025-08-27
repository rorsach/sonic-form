module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
  ],
  rules: {
    // TypeScript strict rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn', // Allow any but warn - will address with generics later
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    
    // General code quality
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-alert': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'arrow-spacing': 'error',
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
    'eol-last': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    'semi': ['error', 'always'],
    'quotes': ['error', 'single', { avoidEscape: true }],
    
    // React specific
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/prop-types': 'off', // Using TypeScript instead
    'react/display-name': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // Import/Export
    'no-duplicate-imports': 'error',
    
    // Error prevention
    'no-unreachable': 'error',
    'no-unused-expressions': 'error',
    'no-useless-return': 'error',
    'no-useless-concat': 'error',
    'no-useless-escape': 'error',
    'no-throw-literal': 'error',
    
    // Best practices for library code
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    'no-proto': 'error',
    'no-iterator': 'error',
    'no-caller': 'error',
    'no-extend-native': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '*.js', // Ignore compiled JS files
    'examples/',
    'docs/',
    'tests/',
  ],
};
