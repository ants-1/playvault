const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  roots: ["<rootDir>/src"],
  testMatch: ["**/tests/**/*.test.ts"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  moduleFileExtensions: ["ts", "js", "json", "node"],
  clearMocks: true,
  collectCoverage: true,
  coveragePathIgnorePatterns: ["/node_modules/", "/generated/", "/dist/"],
  coverageDirectory: "coverage",
  
};
