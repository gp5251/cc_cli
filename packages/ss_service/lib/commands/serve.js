const deepClone = require('lodash.clonedeep')

module.exports = (api, options) => {
	const defaults = {
		host: '0.0.0.0',
		port: 8080,
		contentBase: 'dist',
		publicPath: '/'
	}

	api.registerCommand('serve', args => {
		console.log('running serve');

		const webpack = require('webpack');
		const webpackDevServer = require('webpack-dev-server');
		const merge = require('webpack-merge');
		// const {publicPath, outputDir} = options;

		const webpackConfig = api.resolveWebpackConfig();

		// 用户自定义的devServer覆盖掉默认自定义
		const devServerOptions = deepClone(
			webpackConfig.devServer || {},
			options.devServer
		);
		
		// ss_service serve xxx.js
		const entry = args._[0];
		if (entry) {
			webpackConfig.entry = {
				app: [api.resolve(entry)]
			}
		} else {
			webpackConfig.entry = {
				app: [api.resolve(api.service.entry)]
			}
		}

		webpackConfig.entry.app.push(
			'webpack/hot/dev-server',
			'webpack-dev-server/client?http://localhost:8080',
		);

		let config = merge(webpackConfig, {
			mode: 'development',
			module: {
				rules: [
					{
						test: /\.css$/,
						use: [
							'vue-style-loader',
							'css-loader',
							'postcss-loader'
						]
					}, {
						test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
						use: ['url-loader']
					}, {
						test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
						use: ['url-loader']
					}, {
						test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
						use: ['url-loader']
					}
				]
			},
			plugins: [
				new webpack.HotModuleReplacementPlugin
			]
		})

		const server = new webpackDevServer(webpack(config), Object.assign(defaults, {
			publicPath: '/',
			historyApiFallback: true,
			contentBase: './dist',
			hot: true,
			logLevel: 'silent',
			clientLogLevel: 'silent',
			progress: true,
			// watchContentBase: true,
			quiet: true
		}));

		server.listen(8080, 'localhost', (err) => {
			if (err) console.error(err);
			console.log('server is running');
		});
	})
}

module.exports.defaultModes = {
	serve: 'development'
};
