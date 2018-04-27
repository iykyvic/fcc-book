import path from 'path'
import webpackDev from 'webpack-dev-middleware'
import webpackHot from 'webpack-hot-middleware'
import webpack from 'webpack'
import webpackConfig from '../../webpack.config'

export default function devMiddleware (app) {
  const compiler = webpack(webpackConfig)
  app.use(webpackDev(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }))
  app.use(webpackHot(compiler))

  app.use('*', (req, res, next) => {
    var filename = path.join(compiler.outputPath, '../index.html')

    return compiler.outputFileSystem.readFile(filename, function (err, result) {
      if (err) {
        return next(err)
      }
      res.set('content-type', 'text/html')
      res.send(result)

      return res.end()
    })
  })
};
