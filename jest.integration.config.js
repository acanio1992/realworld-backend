module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: './tsconfig.stryker.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  testMatch: ['<rootDir>/src/__integration__/**/*.test.[jt]s?(x)'],
  testTimeout: 30000,
};
