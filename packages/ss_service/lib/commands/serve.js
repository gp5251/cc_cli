const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');

module.exports = (api, options) => {
	api.chainWebpack(webpackConfig => {
		//
	});

	api.registerCommand('serve', ({port = 3000}, rawArgs) => {
		console.log('running serve');
		// const webpackConfig = api.resolveChainableWebpackConfig();
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
