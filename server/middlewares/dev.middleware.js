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

  app.use('*', (req, res) => {
    res.set('content-type', 'text/html')
    return res.send(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>FCC BOOK</title>
        <meta name="viewport" content="width=device-width" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
      </head>
      <body>
        <div id="book"></div>
        <script type="text/javascript" src="/public/assets/bundle.js"></script>
      </body>
    </html>
    `)
  })
};
