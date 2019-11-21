const lodash_merge = require('lodash.merge')
const portfinder = require('portfinder')

module.exports = (api, options) => {
	const defaults = {
		host: 'localhost',
		port: 8080
	}

	api.registerCommand('serve', async args => {
		console.log('running serve');

		const webpack = require('webpack');
		const webpackDevServer = require('webpack-dev-server');
		const merge = require('webpack-merge');
		const host = args.host || process.env.HOST || options.host || defaults.host;
		portfinder.basePort = args.port || process.env.PORT || options.port || defaults.port;
		const port = await portfinder.getPortPromise();
		const webpackConfig = api.resolveWebpackConfig();

		// 用户自定义的devServer覆盖掉默认自定义
		const devServerOptions = lodash_merge(
			webpackConfig.devServer || {},
			options.devServer
		);
		
		// ss_service serve xxx.js
		// const entry = args._[0];
		// if (entry) {
		// 	webpackConfig.entry = {
		// 		app: [api.resolve(entry)]
		// 	}
		// } else {
			webpackConfig.entry = {
				app: [api.resolve(api.service.entry)]
			}
		// }

		webpackConfig.entry.app.push(
			'webpack/hot/dev-server',
			'webpack-dev-server/client?http://localhost:8080',
		);

		let config = merge(webpackConfig, {
			mode: api.service.mode,
			devtool: api.service.mode === 'production' ? 'source-map' : 'cheap-module-source-map',
			module: {
				rules: [{
					test: /\.css$/,
					use: [
						'vue-style-loader',
						'css-loader',
						'postcss-loader'
					]
				}]
			},
			plugins: [
				new webpack.HotModuleReplacementPlugin
			]
		})

		const server = new webpackDevServer(webpack(config), devServerOptions);

		server.listen(port, host, (err) => {
			if (err)
				console.error(err);
			else
				console.log(`server is running at ${host + ':' + port}`);
		});
	})
}

module.exports.defaultModes = {
	serve: 'development'
};
