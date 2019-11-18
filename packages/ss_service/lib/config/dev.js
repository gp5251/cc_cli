const merge = require('webpack-merge');
const base = require('./base')

module.exports = merge(base, {
	mode: 'development',
	devtool: 'cheap-module-eval-source-map',
	plugins: [
		new DefinePlugin(
			{
				'process.env': {
					NODE_ENV: '"development"',
					BASE_URL: '"/"'
				}
			}
		),
		new HotModuleReplacementPlugin()
	]

});
