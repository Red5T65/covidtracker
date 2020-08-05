const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const ctxDir = path.resolve(__dirname)
const outDir = path.resolve(ctxDir, 'dist');
const srcDir = path.resolve(ctxDir, 'src');

const config = {
    mode: 'development',
    context: ctxDir,
    entry: {
        main: ['normalize.css', srcDir],
        react: ['react', 'react-dom'],
    },
    output: {
        path: outDir,
        filename: '[name].[chunkhash].js',
    },
    module: {
        rules: [{
            test: /\.js$/,
            include: [srcDir],
            use: [{
                loader: 'babel-loader',
            }]
        }, {
            test: /\.css$/,
            include: [srcDir, /node_modules/],
            use: [{
                loader: MiniCssExtractPlugin.loader,
            }, {
                loader: 'css-loader',
                options: {
                    sourceMap: true,
                    modules: {
                        mode: 'local',
                        localIdentName: '[path][name]__[local]-[hash:base64:5]',
                        context: ctxDir,
                    },
                },
            }],
        }, {
            test: /\.svg$/,
            include: [srcDir],
            use: [{
                loader: 'file-loader',
            }],
        }]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            cache: false,
            hash: true,
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[chunkhash].css',
        }),
    ],
};

module.exports = config;

