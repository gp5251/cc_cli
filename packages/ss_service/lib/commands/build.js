const fs = require('fs-extra')
// const deepClone = require('lodash.clonedeep')
const {logWithSpinner, stopSpinner} = require('ss_utils')

module.exports = (api, options) => {
	api.registerCommand('build', async args => {
		console.log('running build');

		const merge = require('webpack-merge');
		const MiniCssExtractPlugin = require('mini-css-extract-plugin');
		const OptimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin');
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
				app: api.resolve(api.service.entry)
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
				}),
				new OptimizeCssnanoPlugin
			]
		});

		if (args.clean) {
			const targetDir = api.resolve(options.outputDir)
			await fs.remove(targetDir)
		}

		logWithSpinner(`正在构建 ...`);
		webpack(webpackConfig, (err, stats) => {
			stopSpinner(false);

			if (err) console.error(err);

			// if (stat.hasErrors()) {
			// 	console.error('hasErrors');
			// }

			const info = stats.toJson();

			if (stats.hasErrors()) {
				console.error(info.errors);
			}

			// console.log('webpack', stat);

			console.log('构建完成');
		});

	});
}

module.exports.defaultModes = {
	build: 'production'
};
