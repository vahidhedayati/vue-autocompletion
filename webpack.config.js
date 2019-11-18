var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index.js',
    library: {
      root: 'VueAutocompletion',
      amd: 'vue-autocompletion',
      commonjs: 'vue-autocompletion'
    },
    libraryTarget: 'umd',
  },
  externals: {
    vue: 'vue',
  },
}

