const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');

module.exports = {
  entry:  './editor/index.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'app.js'
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.ttf$/,
      use: ['file-loader']
    }]
  },
  plugins: [
    new MonacoWebpackPlugin(
      { languages: ['typescript', 'json'] }
    ),
    {
      apply: (compiler) => {
        compiler.hooks.done.tap('AfterEmitPlugin', (compilation) => {
          const args = process.argv[process.argv.length - 1];

          if (args && args == "editor") {
            const fs = require('fs');
            const p = path.join(__dirname, "../dist/app.js");
            let app = fs.readFileSync(p).toString();
            app = app.replace('return o.p+""+e+".app.js"', 'return global.app_path + "/" + e + ".app.js"');
            app = app.replace('i.p+"223490291528837216424bf892a36810.ttf','global.ttf_path + "223490291528837216424bf892a36810.ttf');
            fs.writeFileSync(p, app);
          }
        });
      }
    }
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        monacoCommon: {
          test: /[\\/]node_modules[\\/]monaco\-editor/,
          name: 'monaco-editor-common',
          chunks: 'async'
        }
      }
    }
  },
};