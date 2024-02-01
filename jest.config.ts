/**
 * For a detailed explanation regarding each configuration property, visit:
 * https:
 */

import type { Config } from "jest";

const config: Config = {
    clearMocks: true,

    collectCoverage: true,

    coverageDirectory: "coverage",

    coverageProvider: "v8",

    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },

    roots: ["<rootDir>", "<rootDir>/src"],

    setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],

    testEnvironment: "jsdom",

    transform: {
        "^.+\\.(t|j)sx?$": "@swc/jest",
    },
};

export default config;
