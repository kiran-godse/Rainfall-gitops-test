// jest.config.js
export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\\.ts$': 'ts-jest',
      '^.+\\.js$': 'babel-jest', 
    },
    moduleFileExtensions: ['ts', 'js'],
  };
  

// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   transform: {
//     '^.+\\.[jt]sx?$': 'babel-jest', // Transpile both .js and .ts(x) files using Babel
//   },
//   moduleFileExtensions: ['ts', 'js', 'jsx', 'json'],
//   testMatch: ['**/*.test.[jt]s[x]'],
//   globals: {
//     'ts-jest': {
//       tsconfig: 'tsconfig.json',
//       diagnostics: {
//         ignoreCodes: [151001], // Ignore "Cannot find module" error
//       },
//     },
//   },
// };


