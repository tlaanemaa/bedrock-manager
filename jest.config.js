/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/test/**/*.test.mjs',
    '**/test/**/*.spec.mjs'
  ],
  testTimeout: 30000,
  verbose: true
};
