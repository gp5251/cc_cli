module.exports = api => {
	api.chainWebpack(config => {
		config.module
			.rule('babel')
				.test(/\.js$/)
				.include('src')
				.end()
			.use('babel')
				.loader('babel-loader')
	})
}