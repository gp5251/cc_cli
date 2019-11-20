const path = require('path')

module.exports = api => {
	api.chainWebpack(config => {
		config.module
			.rule('babel')
				.test(/\.js$/)
				.exclude
					.add(/node_modules/)
					.end()
				.use('babel')
					.loader('babel-loader')
	})
}