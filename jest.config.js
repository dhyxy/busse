/* eslint-disable no-undef */
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    useStderr: true,
    setupFiles: ['dotenv/config'],
    setupFilesAfterEnv: ['./api/db.test.ts'],
};
