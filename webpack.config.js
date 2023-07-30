const dotenv = require('dotenv');
var fs = require('fs');
var webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const smp = new SpeedMeasurePlugin();
const handler = (percentage, message, ...args) => {
  // e.g. Output each progress message directly to the console:
  // console.info(percentage, message, ...args);
};

new webpack.ProgressPlugin(handler);

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

const config = smp.wrap({
  cache: {
    type: 'filesystem',
    allowCollectingMemory: true,
    compression: 'gzip',
  },
  resolve: {
    // Add '.ts' and '.tsx' as a resolvable extension.
    extensions: [
      '.webpack.js',
      '.html',
      '.hbs',
      '.csv',
      '.png',
      '.web.js',
      '.ts',
      '.tsx',
      '.js',
      '.mjs'
    ],
  },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
    minimize: false,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  module: {
    rules: [{
        test: /\.hbs$/,
        use: [{
          loader: 'handlebars-loader',
        }, ],
      },
      {
        test: /\.html$/,
        use: [{
          loader: 'file-loader',
          options: {
            emitFile: false,
            outputPath: 'dist/server/images',
          },
        }, ],
      },
      {
        test: /\.csv$/,
        loader: 'csv-loader',
        options: {
          dynamicTyping: true,
          header: true,
          skipEmptyLines: true,
        },
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true, // webpack@1.x
              disable: true, // webpack@2.x and newer
            },
          },
        ],
      },
      // All files with a '.ts' or '.tsx'
      // extension will be handled by 'ts-loader'
      {
        test: /\.tsx?$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          target: 'es6',
          tsconfigRaw: require('./tsconfig.json'),
        },
      },
      {
        test: /\.(jsx|js)$/i,
        // include: path.resolve(__dirname, 'src'),
        use: ['esbuild-loader'],
      },
      {
        test: /\.scss$/,
        use: [{
            loader: 'file-loader',
            options: {
              name: '[name].build.css',
              context: './',
              outputPath: '/',
              publicPath: '/dist',
            },
          },
          {
            loader: 'extract-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [{
            loader: MiniCssExtractPlugin.loader,
          },
        ],
      },
    ],
  },
  plugins: [

    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.config().parsed)
    }),
    new CompressionPlugin({
      algorithm: 'gzip',
    }),
  ],
});

const serverConfig = Object.assign({}, config, {
  entry: {
    server: './server/server.ts',
  },
  mode: 'development',
  output: {
    path: path.resolve(__dirname, `dist/server`),
    filename: 'server.js',
  },
  target: 'node',
  externals: nodeModules,
});

module.exports = [serverConfig];