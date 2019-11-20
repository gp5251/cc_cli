const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')

module.exports = (api, options) => {
	const context = api.service.context;
	const config = {
		context,
		output: {
			path: path.resolve(context, options.outputDir),
			filename: '[name].js',
			publicPath: options.publicPath || '/'
		},
		resolve: {
			alias: {
				'@': path.resolve(context, './src'),
				vue$: 'vue/dist/vue.runtime.esm.js'
			},
			extensions: [ '.js', '.jsx', '.vue', '.json' ],
		},
		module: {
			noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
			rules: [{
				test: /\.vue$/,
				exclude: /node_modules/,
				use: [ 'vue-loader' ]
			}]
		},
		plugins: [
			new VueLoaderPlugin,
			new webpack.HashedModuleIdsPlugin,
			new ProgressPlugin,
			new HtmlWebpackPlugin({ 
				template: path.resolve(context, './public/index.html'), 
				filename: 'index.html' 
			})
		]
	}

	api.configureWebpack(config);
}
	