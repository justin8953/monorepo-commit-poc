// jest.config.ts

export default {
    // The root directory that Jest should scan for tests and modules within
    rootDir: '.',

    // The test environment that will be used for testing
    testEnvironment: 'node',

    // The test match patterns
    testMatch: ['<rootDir>/**/*.spec.(ts|tsx)'],

    // The module file extensions that Jest should recognize
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],

    // The transform configuration for Jest
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },

    // The coverage report configuration
    coverageReporters: ['lcov', 'text-summary'],
};
