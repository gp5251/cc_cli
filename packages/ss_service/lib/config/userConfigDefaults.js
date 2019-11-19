module.exports = {
	publicPath: '/',
	outputDir: 'dist',
	// assetsDir: ''
	devServer: {
		historyApiFallback: true,
		hot: true,
		inline: true,
		publicPath: '/',
		overlay: true,
		open: true,
		port: 8080,
		// contentBase: 'dist'
	}
};
