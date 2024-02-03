import type { Config } from "jest";

const config: Config = {
    clearMocks: true,

    collectCoverage: true,

    coverageDirectory: "coverage",

    coverageProvider: "v8",

    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },

    roots: ["<rootDir>/src/tests/unit"],

    setupFilesAfterEnv: ["<rootDir>/src/tests/unit/setup.ts"],

    testEnvironment: "jsdom",

    transform: {
        "^.+\\.(t|j)sx?$": "@swc/jest",
    },
};

export default config;
