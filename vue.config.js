const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        extraResources: [
          {
            from: 'public/updater.exe',
            to: 'updater.exe'
          },
          {
            from: 'public/launcher.exe',
            to: 'launcher.exe'
          }
        ]
      }
    }
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    }
  }
})
