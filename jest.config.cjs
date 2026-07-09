module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|js)$': 'babel-jest',
  },
  testMatch: ['**/tests/**/*.test.(ts|js)'],
};
