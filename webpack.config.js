const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const miniCss = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const pages = ["index", "error", "success"];
var webpack = require("webpack");
require('dotenv').config({path: './.env'})

// module.exports = {
//   entry: 'index.js',
//   output: {
//     path: path.resolve(__dirname, './dist'),
//     filename: 'index_bundle.js',
//   },
//   plugins: [new HtmlWebpackPlugin()],
// };

console.log(process.env.VPN_REST_HTTPS)

module.exports = (env, argv) => ({
  entry: "./src/js/app.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "app.js",
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new miniCss({
      filename: 'style.css'
    }),
    new webpack.DefinePlugin({
      'process.env.VPN_REST_HTTPS': JSON.stringify(process.env.VPN_REST_HTTPS)
    })
    // new Dotenv(),
    // new HtmlWebpackPlugin(),
    // new HtmlWebpackPlugin({
    //   // inject: true,
    //   template: path.resolve(__dirname, `./src/index.html`),
    //   // filename: `index.html`,
    //   // chunks: ['index'],
    // })
  ]
  .concat(
    pages.map(
      (page) =>
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, `./src/${page}.html`),
          filename: `${page}.html`
        })
    )
  ),
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, "src"),
      },
      {
        test:/\.(s*)css$/,
        use: [
           miniCss.loader,
           'css-loader',
           'sass-loader',
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ],
  },
  devtool: argv.mode === "development" ? "eval-source-map" : undefined,
});
