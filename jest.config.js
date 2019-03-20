module.exports = {
  setupFilesAfterEnv: ['./jest.setup.js'],
  verbose: true,
  testEnvironment: 'node',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  coverageReporters: ['lcov']
};
