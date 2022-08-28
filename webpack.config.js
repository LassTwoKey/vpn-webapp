const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const miniCss = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const pages = ["index", "error", "success"];

module.exports = (env, argv) => ({
  entry: "./src/js/app.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "app.js",
  },
  plugins: [
    new miniCss({
      filename: 'style.css'
    }),
    new Dotenv({
      path: '../.env'
    })
  ].concat(
    pages.map(
      (page) =>
        new HtmlWebpackPlugin({
          inject: true,
          template: path.resolve(__dirname, `./src/${page}.html`),
          filename: `${page}.html`,
          chunks: [page],
        })
    )
  ),
  // plugins: [
  //     // new HtmlWebpackPlugin({
  //     //     template: path.resolve(__dirname, './src/index.html')
  //     // }),
  //     new miniCss({
  //       filename: 'style.css',
  //     }),
  //     [].concat(
  //       pages.map(
  //         (page) =>
  //           new HtmlWebpackPlugin({
  //             inject: true,
  //             template: `./${page}.html`,
  //             filename: `${page}.html`,
  //             chunks: [page],
  //           })
  //       )
  //     ),
  // ],
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
