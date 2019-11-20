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

		// 快速原型
		const entry = args._[0];
		if (entry) {
			webpackConfig.entry = {
				app: api.resolve(entry)
			}
		} else {
			webpackConfig.entry = {
				app: api.resolve('./src/main.js')
			}
		}

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
					// }, {
					// 	test: /\.less$/,
					// 	use: [
					// 		'vue-style-loader',
					// 		'css-loader',
					// 		'postcss-loader',
					// 		'less-loader'
					// 	]
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

		// console.log('config', config);

		const compiler = webpack(config, (err, stats) => {
			if (err) console.error(err);

			// console.log('stats', stats);
		});

		const server = new webpackDevServer(compiler, Object.assign(defaults, {
				clientLogLevel: 'warning',
				hot: true,
				contentBase: 'dist',
				compress: true,
				// open: true,
				overlay: { warnings: false, errors: true },
				publicPath: '/',
				quiet: true
			}));
	})
}

module.exports.defaultModes = {
	serve: 'development'
};
