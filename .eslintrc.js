module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: ['vue', 'standard'],
  // required to lint *.vue files
  plugins: [
    'vue',
    'import',
    'html'
  ],
  // add your custom rules here
  'rules': {
    "template-curly-spacing": ["error", "always"],
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-use-before-define': 0,
    'import/no-webpack-loader-syntax': 0
  }
}
