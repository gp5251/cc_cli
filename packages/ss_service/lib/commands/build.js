const deepClone = require('lodash.clonedeep')
const {logWithSpinner, stopSpinner} = require('ss_utils')

module.exports = (api, options) => {
	api.registerCommand('build', args => {
		console.log('running build');

		const merge = require('webpack-merge');
		const MiniCssExtractPlugin = require('mini-css-extract-plugin');
		const webpack = require('webpack');
		let webpackConfig = api.resolveWebpackConfig();

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

		webpackConfig = merge(webpackConfig, {
			mode: 'production',
			devtool: 'source-map',
			module: {
				rules: [
					{
						test: /\.css$/,
						use: [
							MiniCssExtractPlugin.loader,
							'css-loader',
							'postcss-loader'
						]
					}
				]
			},
			plugins: [
				new MiniCssExtractPlugin({
					filename: '[name].css'
				})
			]
		})

		logWithSpinner(`正在构建 ...`);

		webpack(webpackConfig)
			.run((err, state) => {
				stopSpinner(false);
				if (err) console.error(err);

				console.log('建构完成');
			});
	})
}

module.exports.defaultModes = {
	build: 'production'
};
