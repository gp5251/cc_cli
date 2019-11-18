
module.exports = (api, options) => {
	api.registerCommand('serve', ({port = 8080, host='localhost'}, rawArgs) => {
		console.log('running serve');

		const webpack = require('webpack');
		const webpackDevServer = require('webpack-dev-server');

		const webpackConfig = api.resolveChainableWebpackConfig();
		const devServerOptions = Object.assign(
			webpackConfig.devServer || {},
			options.devServer
		);
		const compiler = webpack(webpackConfig);

		webpackDevServer(compiler, devServerOptions);

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
