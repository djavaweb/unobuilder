const webpack = require('webpack'),
path = require('path')

let appDir = path.resolve(__dirname, '..', 'src', 'app'),
distDir = path.resolve(__dirname, '..', 'dist')

module.exports = {
    resolve: {
        root: [appDir],
        modulesDirectories: ['node_modules'],
        alias: {
            uno: 'client.js',
            jquery: 'jquery/src/jquery',
            UIKitCSS: 'uikit/dist/css/uikit.min.css'
        }
    },

    entry: {
        unobuilder: path.join(appDir, 'main.js')
    },

    output: {
        path: distDir,
        publicPath: 'dist/',
        filename: "[name].js",
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
				test: /\.css$/,
				loader: 'style-loader!css-loader'
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
            }
        ]
    },

    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
    }
}
