module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  testMatch: ['<rootDir>/tests/**/*.test.(js|jsx|ts|tsx)'],
  collectCoverageFrom: [
    'lib/**/*.{js,jsx,ts,tsx}',
    '!lib/**/*.d.ts',
    '!lib/partialFn.ts',  // Exclude partialFn.ts from coverage
  ],
  moduleNameMapper: {
    '^@rorsach/sonic-form$': '<rootDir>/lib/index.js',
    '^@/(.*)$': '<rootDir>/lib/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
  },
};
