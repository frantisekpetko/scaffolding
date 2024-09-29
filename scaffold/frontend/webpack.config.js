'use strict';

var CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const AutoCSSModulesWebpackPlugin = require('auto-css-modules-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin");


// Standard style loader (prod and dev covered here)
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); 
const devMode = process.env.NODE_ENV !== 'production';
const styleLoader = devMode ? 'style-loader' : MiniCssExtractPlugin.loader;

const minimizer = devMode ? null : {optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()]
}};

module.exports = {
    mode: process.env.NODE_ENV, //,
    entry: {
        main: ['./src/main.tsx'],
        //'babel-polyfill', 
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|json)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.(ts|tsx)$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            
            {
                test: /\.(scss|css)$/i,
         
                use: [
                    {
                        loader: 'style-loader', // creates style nodes from JS strings
                    },
                    {
                        loader: 'css-loader', options: {
                            importLoaders: 0,
                        } // translates CSS into CommonJS
                    },
                    {
                        loader: 'sass-loader'
                        // compiles Sass to CSS
                    },
                ], 

            },
            
            {
                test: /\.(png|svg|jpg|gif|ico|ttf|woff|eot)$/,
                use: [
                    {
                        loader: 'url-loader?limit=25000',
                        //8192
                    },
                ],
            },
            { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff2' } },
            { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff' } },
            { test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'file-loader' },
        ],
    },
    resolve: {
        extensions: ['*', '.js', '.jsx', '.config.js', '.web.js', '.scss', '.ts', '.tsx'],
        modules: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules')],
        alias: {
            'dom-helpers': 'dom-helpers5', src: path.resolve(__dirname, '@/'),
            '@': path.resolve(__dirname, 'src'),
 },
   
    },
    output: {
        path: __dirname + '/dist/',
        publicPath: '/',
        //filename: 'bundle.js'
        filename: '[name].min.js',
    },
    /*
  node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
  },*/
    /*devtool: "source-map",*/
    //devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
    devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
    //devtool: dev ? 'eval-cheap-module-source-map' : false,

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                PUBLIC_URL: JSON.stringify('http://localhost:8000'),
                DEPLOY_URL: JSON.stringify('https://sweeetheart.herokuapp.com'),
                /*'APP_ID': '698088170574676',
              'APP_SECRET': '48d582d34339686841a66350b041b0aa',
              'ACCESS_TOKEN':'957519524433404|GzGDbpHPgNN4kaKR9_0TVcvkH3s'*/
                /*NODE_ENV: JSON.stringify('development')*/
            },
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './', 'index.html'),
        }),
        new AutoCSSModulesWebpackPlugin(),
        new MiniCssExtractPlugin({ filename: "style.css" }),
        /*
        new CompressionPlugin({
            filename: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        })
        */


    ],
    /*
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()]
    },
    */

    ...minimizer,
    
        /*
    splitChunks: {
       minSize: 10000,
       maxSize: 250000,
    }
    */
        /*splitChunks: {
        chunks: 'all',
    },*/

    devServer: {
        //host: "project.test",
        //contentBase: './public',
        //disableHostCheck: true,
        historyApiFallback: true,

        /*https: {
          key: fs.readFileSync(__dirname +  '/conf/key.pem'),
          cert: fs.readFileSync(__dirname +'/conf/cert.pem')
    },*/
        port: 4000,
    },
    /*
  performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
  }
 */
    performance: {
        hints: false,
    },
};
