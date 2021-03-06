/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 80000,
  verbose: true,
  collectCoverage: true,
  moduleNameMapper: {
    '@exmpl/(.*)': '<rootDir>/src/$1',
  },
}
