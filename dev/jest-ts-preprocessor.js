const tsc = require('typescript');
const tsConfig = require('../tsconfig.json');

// Transpiles typescript to javascript for jest
module.exports = {
  process(src, path) {
    if (path.endsWith('.ts') || path.endsWith('.tsx')) {
      return tsc.transpile(src, tsConfig.compilerOptions, path, []);
    }
    return src;
  },
};
