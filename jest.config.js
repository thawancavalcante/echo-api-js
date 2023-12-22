/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ["<rootDir>/test/utils/setEnvVars.js"],
  moduleNameMapper: {
    "^@infra/(.*)$": ["<rootDir>/src/infra/$1"],
    "^@domain/(.*)$": ["<rootDir>/src/domain/$1"],
    "^@application/(.*)$": ["<rootDir>/src/application/$1"],
    "^@utils/(.*)$": ["<rootDir>/src/utils/$1"],
    "^@/(.*)$": ["<rootDir>/src/$1"],
  }
};