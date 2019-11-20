const path = require('path')

module.exports = api => {
	api.chainWebpack(config => {
		const isProduction = process.env.NODE_ENV === 'production'
		const MiniCssExtractPlugin = require('mini-css-extract-plugin');

		if (isProduction)
			config.module
				.rule('less')
				.test(/\.(less|css)$/)
				.exclude
					.add(/node_modules/)
					.end()
				.use('MiniCssExtractPlugin')
					.loader(MiniCssExtractPlugin.loader)
		else 
			config.module
				.rule('less')
				.test(/\.(less|css)$/)
				.exclude
					.add(/node_modules/)
					.end()
				.use('vue-style')
					.loader('vue-style-loader')
				
		config.module
			.rule('less')
				.use('css')
				.loader('css-loader')

		config.module
			.rule('less')
				.use('postcss')
				.loader('postcss-loader')

		config.module
			.rule('less')
				.use('less')
				.loader('less-loader')
	})
}