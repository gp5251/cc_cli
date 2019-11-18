const webpack = require('webpack');

module.exports = (api, options) => {
	api.chainWebpack(webpackConfig => {
		//
	});

	api.registerCommand('build', (args, rawArgs) => {
		console.log('running build');
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
	build: 'development'
};

