import path from 'path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const env = dotenv.config().parsed || {};

export default {
  entry: './src/server.js',
  target: 'node',
  experiments: {
    outputModule: true,
  },
  externalsType: 'module',
  externals: [nodeExternals({
    importType: 'module'
  })],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    module: true,
    chunkFormat: 'module',
    library: {
      type: 'module'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/')
    },
    extensions: ['.js']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(env)
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'package.json', to: 'package.json' },
        { from: 'package-lock.json', to: 'package-lock.json' },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
