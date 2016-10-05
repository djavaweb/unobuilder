const config = require('./webpack.default.config'),
webpack = require('webpack')

module.exports = config
module.exports.plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '"production"'
        }
    }),
    new webpack.optimize.UglifyJsPlugin({
		sourceMap: false,
		compress: {
			warnings: false
		}
	}),
    new webpack.optimize.OccurenceOrderPlugin()
]
