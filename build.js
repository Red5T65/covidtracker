#!/usr/bin/env node

const action = process.argv[2];

const webpack = require('webpack');
const webpackConfig = require('./webpackConfig');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const ProgressBar = require('progress');

function webpackBuildFinished(err, stats) {
    if (err) {
        console.log('\n\n===== WEBPACK BUILD FAILED =====');
        throw err;
    }

    console.log('\n\n===== WEBPACK BUILD FINISHED =====');
    console.log(stats.toString({ colors: true, timings: true, cached: false }));
}

const webpackCompiler = webpack(webpackConfig);

const webpackProgress = new ProgressBar(
    '[:bar] :percent eta :etas  :msg', {
        total: 100, complete: '=', incomplete: ' ', width: 10
    }
);

new ProgressPlugin(function(percent, msg) {
    webpackProgress.update(percent, { msg });
}).apply(webpackCompiler);

switch (action) {
    case 'watch':
        webpackCompiler.watch({}, webpackBuildFinished);
        return;
    case 'dist':
        webpackCompiler.run(webpackBuildFinished);
        return;
    default:
        console.log(`Error: unknown action "${action}"`);
        process.exit(1);
}

