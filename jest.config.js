module.exports = {
  moduleFileExtensions: ["ts", "tsx", "js"],
  setupFiles: [
    "<rootDir>/polyfills/index.js"
  ],
  transform: {
    "^.+\\.tsx?$": "<rootDir>/dev/jest-ts-preprocessor.js"
  },
  testMatch: [
    "**/*.test.(ts|tsx|js)"
  ]
};