const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require('path');

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;
const fileName = ext => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`

const PATHS = {
  src: path.join(__dirname, "./src"),
  dist: path.join(__dirname, "./public")
};

const devServer = () => {
  return {
    contentBase: path.join(__dirname, `public`),
    host: 'localhost',
    port: 8084,
    compress: false,
    overlay: {
      warnings: true,
      errors: true
    }
  }
}

const optimization = () => {
  const config = {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: "vendors",
          test: /node_modules/,
          chunks: "all",
          enforce: true
        }
      }
    }
  }

  if (isProd) {

    config.minimize = true;

    config.minimizer = [
      new TerserPlugin({
            extractComments: true,
            cache: true,
            parallel: true
      })
    ]
  }

  return config;
};

const plugins = () => {

  const pluginConf = [
    new CleanWebpackPlugin(),

    new CopyWebpackPlugin({
        patterns: [
          { from: `${PATHS.src}/images`, to: "images"},
          { from: `${PATHS.src}/css`, to: "css"},
        ]
      }
    ),

    new HtmlWebpackPlugin({
      template: `${path.join(__dirname, './src/index.html')}`,
      filename: './index.html',
    }),
  ]

  return pluginConf;
};



module.exports = {
  entry: {
    index: './src/index.ts'
  },
  output: {
    filename: `js/${fileName("js")}`,
    path: PATHS.dist
  },
  devtool: isDev ? "source-map" : false,
  devServer: isDev ? devServer() : {},
  resolve: {
    extensions: ['.js', '.ts']
  },
  module: {
    rules: [
      {
        // TypeScript
        test: /\.ts$/,
        use: ["babel-loader", "ts-loader"],
        exclude: "/node_modules/"
      },
    ]
  },

  optimization: optimization(),

  plugins: plugins(),
};
