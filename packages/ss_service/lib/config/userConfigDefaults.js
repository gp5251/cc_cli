module.exports = {
	publicPath: '/',
	outputDir: 'dist',
	devServer: {
		historyApiFallback: true,
		publicPath: '/',
		contentBase: './dist',
		hot: true,
		logLevel: 'silent',
		clientLogLevel: 'silent',
		progress: true,
		quiet: true,
		open: true
		// watchContentBase: true,
	}
};
