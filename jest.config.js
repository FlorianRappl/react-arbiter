module.exports = {
  setupFiles: ['./test/setup.ts'],
  transform: {
    '^.+\\.(ts|tsx?)$': './node_modules/ts-jest/preprocessor.js',
    '^.+\\.js?$': 'babel-jest',
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(jsx?|tsx?)$',
  snapshotSerializers: ['enzyme-to-json/serializer'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  modulePaths: ['src', 'node_modules'],
  globals: {
    NODE_ENV: 'test',
    'ts-jest': {
      diagnostics: false,
    },
  },
  testURL: 'http://localhost',
  verbose: true
};
