/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/**/*.test.ts"],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  setupFiles: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^.*/config/database$": "<rootDir>/src/config/database",
  },
};
