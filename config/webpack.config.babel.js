import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import url from 'url';
import _ from 'lodash';

const hmrOrigin = 'http://localhost:9090';

const sharedConfig = {
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

const mainConfig = {
    ...sharedConfig,
    target: 'electron-main',
    entry: {
        'main': 'q2studio-main'
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, '../dist')
    }
}


const mainDevConfig = {
    ...mainConfig,
    plugins: [
        ...mainConfig.plugins,
        new webpack.DefinePlugin({
            HMR_ORIGIN: JSON.stringify(hmrOrigin)
        })
    ]
}


const rendererEntry = {
    // Each of these is a seperate bundle
    'main': 'q2studio/window/main',
    'action': 'q2studio/window/action',
    'job': 'q2studio/window/job',
    'result': 'q2studio/window/result'
}

const rendererConfig = {
    ...sharedConfig,
    target: 'electron-renderer',
    plugins: [
        ...sharedConfig.plugins,
        ...Object.keys(rendererEntry).map(
            (chunkName) => new HtmlWebpackPlugin({
                chunks: [chunkName, 'shared'],
                template: path.resolve(__dirname, '../app/renderer/template.html'),
                // Just use main.html, action.html, job.html, etc
                filename: `${chunkName}.html`
            })),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'shared',
            filename: 'js/shared.js'
        })
    ],
    entry: rendererEntry,
    output: {
        // [name] is the key used in `entry` (without selector, file would be
        // overwritten for each entry-point)
        filename: 'js/[name].js',
        path: path.resolve(__dirname, '../dist/window'),
        publicPath: '/window/' // needed for dev-server hmr
    },
}


const rendererDevConfig = {
    ...rendererConfig,
    entry: _.mapValues(rendererEntry, 
        entry => [
            entry, // append hmr code to each entry-point
            'webpack/hot/only-dev-server', 
            `webpack-dev-server/client?${hmrOrigin}`
        ]
    ),
    devServer: {
        contentBase: path.resolve(__dirname, '../dist'),
        inline: true,
        port: url.parse(hmrOrigin).port
    },
    plugins: [
        ...rendererConfig.plugins,
        new webpack.HotModuleReplacementPlugin()
    ]
}


export default (env = {}) => {
    if (env.DEV_MAIN !== undefined) {
        return mainDevConfig;
    } else if (env.DEV_RENDERER !== undefined) {
        return rendererDevConfig;
    } else {
        return [mainConfig, rendererConfig];
    }
}
