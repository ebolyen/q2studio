import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import _ from 'lodash';

const config = {
    // disable node polyfill, electron has everything and it changes __dirname
    // to "/" which makes it impossible to load our assets
    node: false,
    plugins: [],
    resolve: {
        // hoist app source as a importable module
        alias: { 
            'q2studio': path.resolve(__dirname, '../app/renderer'),
            'q2studio-main': path.resolve(__dirname, '../app/main')
        },
        // make these extensions optional when importing
        extensions: [ '.js', '.jsx' ]
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: path.resolve(__dirname, '../node_modules/')
            }
        ]
    }
}

const renderEntry = {
    // Each of these is a seperate bundle
    'main': 'q2studio/window/main',
    'action': 'q2studio/window/action',
    'job': 'q2studio/window/job',
    'result': 'q2studio/window/result'
}

// only render chunks need an html page (they become electron windows)
const htmlPlugins = Object.keys(renderEntry).map(
    (chunkName) => new HtmlWebpackPlugin({
        chunks: [chunkName, 'shared'],
        template: path.resolve(__dirname, '../app/renderer/template.html'),
        // Just use main.html, action.html, job.html, etc
        filename: `${chunkName}.html`
    }));

const rendererConfig = {
    ...config,
    target: 'electron-renderer',
    plugins: [
        ...config.plugins,
        ...htmlPlugins,
        new webpack.optimize.CommonsChunkPlugin({
            name: 'shared',
            filename: 'js/shared.js'
        })
    ],
    entry: renderEntry,
    output: {
        // [name] is the key used in `entry` (without selector, file would be
        // overwritten for each entry-point)
        filename: 'js/[name].js',
        path: path.resolve(__dirname, '../dist/window'),
        publicPath: '/window/' // needed for dev-server
    },
}

const mainConfig = {
    ...config,
    target: 'electron-main',
    entry: {
        'main': 'q2studio-main'
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, '../dist')
    }
}

const port = 9090;
const devConfig = {
    ...rendererConfig,
    entry: _.mapValues(renderEntry, 
        v => [
            v, // append hmr code to each entry-point
            'webpack/hot/only-dev-server', 
            `webpack-dev-server/client?http://localhost:${port}`
        ]
    ),
    devServer: {
        contentBase: path.resolve(__dirname, '../dist'),
        inline: true,
        port
    },
    plugins: [
        ...rendererConfig.plugins,
        new webpack.HotModuleReplacementPlugin()
    ]
}


export default (env = {}) => {
    if (env.MAINONLY !== undefined) {
        return mainConfig;
    } else if (env.DEV !== undefined) {
        return devConfig;
    } else {
        return [mainConfig, rendererConfig];
    }
}
