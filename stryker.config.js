/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
module.exports = {
  testRunner: 'jest',
  // 'perTest' is fine here — no module-level state issues like in the frontend
  coverageAnalysis: 'perTest',
  jest: {
    configFile: 'jest.stryker.config.js',
    enableFindRelatedTests: true,
  },
  // TypeScript checker validates that mutants don't produce type errors
  // (avoids running tests on mutants that would fail to compile)
  checkers: ['typescript'],
  tsconfigFile: 'tsconfig.stryker.json',
  // Only mutate the tested business logic files.
  // Excluded: controllers (no unit tests), models (type-only), entry points,
  //           middleware setup, routing, prisma client wrappers.
  mutate: [
    'src/app/routes/auth/auth.service.ts',
    'src/app/routes/auth/token.utils.ts',
    'src/app/routes/article/article.service.ts',
    'src/app/routes/article/article.mapper.ts',
    'src/app/routes/article/author.mapper.ts',
    'src/app/routes/profile/profile.service.ts',
    'src/app/routes/profile/profile.utils.ts',
    'src/app/routes/tag/tag.service.ts',
  ],
  reporters: ['html', 'clear-text', 'progress'],
  htmlReporter: {
    fileName: 'reports/mutation/mutation.html',
  },
  thresholds: {
    high: 80,
    low: 60,
    break: null, // Don't fail on low score (experiment mode)
  },
  timeoutMS: 15000,
  timeoutFactor: 2.5,
};
