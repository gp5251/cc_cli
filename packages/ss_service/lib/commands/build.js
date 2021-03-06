const fs = require('fs-extra')
const {logWithSpinner, stopSpinner} = require('ss_utils')

module.exports = (api, options) => {
	api.registerCommand('build', async args => {
		console.log('running build');

		const merge = require('webpack-merge');
		const MiniCssExtractPlugin = require('mini-css-extract-plugin');
		const OptimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin');
		const webpack = require('webpack');
		let webpackConfig = api.resolveWebpackConfig();
		
		webpackConfig.entry = {
			app: api.resolve(api.service.entry)
		}

		webpackConfig = merge(webpackConfig, {
			mode: api.service.mode,
			devtool: api.service.mode === 'production' ? 'source-map' : 'cheap-module-source-map',
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
				console.error(JSON.stringify(info.errors, null, 2));
			}

			// console.log('webpack', stat);

			console.log('构建完成');
		});

	});
}

module.exports.defaultModes = {
	build: 'production'
};
