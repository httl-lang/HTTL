const { createDefaultEsmPreset } = require('ts-jest')

const defaultEsmPreset = createDefaultEsmPreset()

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    ...defaultEsmPreset,
    testEnvironment: 'node',
    testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
    verbose: true,
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
}