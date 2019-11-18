const merge = require('webpack-merge');
const base = require('./base')
const webpack = require('webpack')

module.exports = merge(base, {
	mode: 'development',
	devtool: 'cheap-module-eval-source-map',
	plugins: [
		new webpack.DefinePlugin(
			{
				'process.env': {
					NODE_ENV: '"development"',
					BASE_URL: '"/"'
				}
			}
		),
		// new HotModuleReplacementPlugin()
	]

});
