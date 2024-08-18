module.exports = {
  testEnvironment: "jsdom", // Since you're testing a React component, you need a DOM-like environment
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"], // Adds custom jest matchers for asserting on DOM nodes.
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy", // Mocks CSS imports for Jest, as Jest can't handle non-JavaScript imports.
  },
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest' // Transform JavaScript and JSX files with babel-jest
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!axios)']
  // moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
};
