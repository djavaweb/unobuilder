var webpack = require('webpack'),
path = require('path')

module.exports = {
    entry: {
        unobuilder: './src/js/core/uno.app.js',
        'unobuilder.viewer': './src/js/core/uno.viewer.js'
    },
    output: {
        path: './app',
        publicPath: 'app/',
        filename: "[name].js"
    },
    module: {
        noParse: /es6-promise\.js$/,
        loaders: [
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?name=assets/[hash].[ext]&limit=10000&minetype=application/font-woff"
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader?name=assets/[hash].[ext]"
            },
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            { test: /\.json$/, loader: 'json' },
            {
                test: /\.js$/,
                exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
                loader: 'babel'
            },
            {
                test: require.resolve("./src/js/core/uno.client.js"),
                loader: "expose?uno"
            }
        ]
    },
    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
    }
}

if (process.env.NODE_ENV === 'production') {
    var WebpackShellPlugin = require('./webpack.shell.js')

    module.exports.plugins = [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new WebpackShellPlugin({
                onBuildStart: ['echo "Start Build"'], 
                onBuildEnd: ['./postbuild.sh']
        })
    ]
} else {
    module.exports.devtool = '#source-map'
}

