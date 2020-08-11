'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const ctxDir = path.resolve(__dirname);
const outDir = path.resolve(ctxDir, 'dist');
const srcDir = path.resolve(ctxDir, 'src');

const publicPath = '/';

const config = {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    context: ctxDir,
    entry: {
        main: ['normalize.css', srcDir],
        react: ['react', 'react-dom']
    },
    output: {
        path: outDir,
        publicPath,
        filename: '[name].[chunkhash].js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            enforce: 'pre',
            exclude: /node_modules/,
            use: ['eslint-loader']
        }, {
            test: /\.js$/,
            include: [srcDir],
            use: [{
                loader: 'babel-loader'
            }]
        }, {
            test: /\.css$/,
            include: [/node_modules/],
            use: [{
                loader: MiniCssExtractPlugin.loader
            }, {
                loader: 'css-loader'
            }]
        }, {
            test: /\.less$/,
            include: [srcDir],
            use: [{
                loader: MiniCssExtractPlugin.loader
            }, {
                loader: 'css-loader',
                options: {
                    sourceMap: true,
                    modules: {
                        mode: 'local',
                        localIdentName: '[local]-[hash:base64:5]',
                        context: ctxDir
                    },
                    importLoaders: 2
                }
            }, {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true
                }
            }, {
                loader: 'less-loader',
                options: {
                    sourceMap: true
                }
            }]
        }, {
            test: /\.(eot|woff|woff2|ttf|svg|jpg|ico)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }]
        }]
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            cache: false,
            hash: true
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[chunkhash].css'
        })
    ]
};

module.exports = config;

