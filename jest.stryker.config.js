/**
 * Standalone Jest config for Stryker (no Nx preset to avoid Nx-specific overhead).
 * Mirrors jest.config.ts but as a plain CommonJS file that Stryker can load directly.
 */
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: './tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/src/**/*(*.)@(spec|test).[jt]s?(x)',
  ],
};
