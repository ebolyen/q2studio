import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import url from 'url';
import _ from 'lodash';

const hmrOrigin = 'http://localhost:9090';
const dist = path.resolve(__dirname, '../../dist');

// This array will be mutated if in dev mode
const babelPlugins = ['transform-object-rest-spread']
const sharedConfig = {
    // disable node polyfill, electron has everything and it changes __dirname
    // to "/" which makes it impossible to load our assets
    node: false,
    plugins: [],
    resolve: {
        // hoist app source as a importable module
        alias: { 
            'q2studio': path.resolve(__dirname, '../q2studio'),
            'q2studio-main': path.resolve(__dirname, '../main'),
            'q2studio-renderer': path.resolve(__dirname, '../renderer')
        },
        // make these extensions optional when importing
        extensions: ['.js', '.jsx', '.json']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: path.resolve(__dirname, '../../node_modules/'),
                options: {
                    // override babelrc in package.json (it exists so that this
                    // file can be read)
                    babelrc: false,
                    // disable modules, webpack 2 can do hmr better
                    presets: [['es2015', { modules: false }], 'react'],
                    plugins: babelPlugins
                }
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
        path: dist
    }
}


const mainDevConfig = {
    ...mainConfig,
    plugins: [
        ...mainConfig.plugins,
        new webpack.DefinePlugin({
            HMR_ORIGIN: JSON.stringify(hmrOrigin)
        })
    ],
    output: {
        filename: 'main.dev.js',
        path: dist
    }
}


const rendererEntry = {
    // Each of these is a seperate bundle
    'main': 'q2studio-renderer/entry/main',
    'action': 'q2studio-renderer/entry/action',
    'job': 'q2studio-renderer/entry/job',
    'result': 'q2studio-renderer/entry/result'
}

const rendererConfig = {
    ...sharedConfig,
    target: 'electron-renderer',
    plugins: [
        ...sharedConfig.plugins,
        ...Object.keys(rendererEntry).map(
            (chunkName) => new HtmlWebpackPlugin({
                chunks: [chunkName, 'shared'],
                template: path.resolve(__dirname, '../renderer/template.html'),
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
        path: `${dist}/window`
    },
}


const rendererDevConfig = {
    ...rendererConfig,
    entry: _.mapValues(rendererEntry, 
        entry => [
            'webpack/hot/only-dev-server', 
            `webpack-dev-server/client?${hmrOrigin}`,
            'react-hot-loader/patch',
            entry
        ]
    ),
    devServer: {
        hot: true,
        port: url.parse(hmrOrigin).port
    },
    plugins: [
        ...rendererConfig.plugins,
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    output: {
        ...rendererConfig.output,
        publicPath: '/window/' // needed for dev-server hmr
    }
}


export default (env = {}) => {
    if (env.DEV_MAIN !== undefined) {
        return mainDevConfig;
    } else if (env.DEV_RENDERER !== undefined) {
        babelPlugins.push('react-hot-loader/babel');
        return rendererDevConfig;
    } else {
        return [mainConfig, rendererConfig];
    }
}
