const webpack = require('webpack'),
path = require('path')

let appDir = path.resolve(__dirname, '..', 'src', 'app')
module.exports = {
    entry: {
        unobuilder: path.join(appDir, 'main.js'),
        'unobuilder.viewer': path.join(appDir, 'viewer.js')
    },

    output: {
        path: '../app',
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
                test: /\.(ttf|eot|svg|cur)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader?name=assets/[hash].[ext]"
            },
            {
                test: /\.vue$/,
                loader: 'vue'
            },

            {
                test: /\.pug$/,
                loader: 'pug-loader'
            },

            {
				test: /\.scss$/,
				loader: 'sass-loader'
			},

            {
                test: /\.json$/,
                loader: 'json'
            },

            {
                test: /\.js$/,
                exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
                loader: 'babel'
            },

            {
                test: require.resolve(path.resolve(appDir, 'client.js')),
                loader: "expose?uno"
            }
        ]
    },
    
    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
    }
}
