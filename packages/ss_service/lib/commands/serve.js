const deepClone = require('lodash.clonedeep')

module.exports = (api, options) => {
	api.registerCommand('serve', ({port = 8080, host='localhost', mode='development'}, rawArgs) => {
		console.log('running serve');

		// const path = require('path');
		const webpack = require('webpack');
		const webpackDevServer = require('webpack-dev-server');

		api.chainWebpack(config => {
			config.plugin('HMT')
				.use(webpack.HotModuleReplacementPlugin)
		});

		const webpackConfig = api.resolveWebpackConfig();
		const devServerOptions = deepClone(
			webpackConfig.devServer || {},
			options.devServer
		);

		// console.log(webpackConfig);

		const compiler = webpack(webpackConfig);

		new webpackDevServer(compiler, devServerOptions);

		// console.log(webpackConfig);

		// const compiler = webpack(webpackConfig);
		// webpackDevServer(compiler, {
		// 	port, 
		// 	inline: true,
		// 	hot: true
		// });
	})
}

module.exports.defaultModes = {
	serve: 'development'
};
