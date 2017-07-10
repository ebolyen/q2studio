import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

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
    'main': './app/renderer/window/main/index.jsx',
    'action': './app/renderer/window/action/index.jsx',
    'job': './app/renderer/window/action/index.jsx',
    'result': './app/renderer/window/result/index.jsx'
}

// only render chunks need an html page (they become electron windows)
const htmlPlugins = Object.keys(renderEntry).map(
    (chunkName) => new HtmlWebpackPlugin({
        chunks: [chunkName],
        template: path.resolve(__dirname, '../app/renderer/template.html'),
        // Just use main.html, action.html, job.html, etc
        filename: `${chunkName}.html`
    }));

const rendererConfig = {
    ...config,
    target: 'electron-renderer',
    plugins: [
        ...config.plugins,
        ...htmlPlugins
    ],
    entry: renderEntry,
    output: {
        // [name] is the key used in `entry` (without selector, file would be
        // overwritten for each entry-point)
        filename: 'js/[name].js',
        path: path.resolve(__dirname, '../dist/window')
    },
}

const mainConfig = {
    ...config,
    target: 'electron-main',
    entry: {
        'main': './app/main/main.js'
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, '../dist')
    }
}

export default [ mainConfig, rendererConfig ];
