const binaries = "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$";

module.exports = {
  moduleFileExtensions: ["ts", "tsx", "js"],
  setupFiles: [
    "<rootDir>/polyfills/index.js"
  ],
  transform: {
    "^.+\\.tsx?$": "<rootDir>/dev/jest/tsPreprocessor.js",
  },
  testMatch: [
    "**/*.test.(ts|tsx|js)"
  ],
  moduleNameMapper: {
    [binaries]: "<rootDir>/dev/jest/mock/empty.js",
    "\\.css$": "<rootDir>/dev/jest/mock/empty.js",
    "^image-size-loader$": "<rootDir>/dev/jest/mock/imageSize.js"
  }
};
