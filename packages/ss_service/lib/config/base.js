const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')

module.exports = (api, options) => {
	const context = api.service.context;
	const isProduction = process.env.NODE_ENV === 'production';
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
				vue$: isProduction ? 'vue/dist/vue.runtime.esm.js' : 'vue/dist/vue.esm.js'
			},
			extensions: [ '.js', '.jsx', '.vue', '.json' ],
		},
		module: {
			noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
			rules: [{
				test: /\.vue$/,
				exclude: /node_modules/,
				use: [ 'vue-loader' ]
			}, {
				test: /\.(woff|svg|eot|ttf)\??.*$/,
				use: [{
					loader: "url-loader",
					// options: {
					// 	limit: 8192,
					// 	name: "[name].[hash:6].[ext]",
					// 	publicPath: '/fonts/',
					// 	outputPath: path.resolve('./dist/fonts')
					// }
				}]
			// }, {
			// 	test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
			// 	use: {
			// 		loader: 'url-loader',
			// 		// options: {
			// 		// 	limit: 10000,
			// 		// 	name: path.resolve('./dist/img/[name].[hash:7].[ext]')
			// 		// }
			// 	}
			}]
		},
		plugins: [
			new VueLoaderPlugin,
			new webpack.HashedModuleIdsPlugin,
			new ProgressPlugin,
			// new HtmlWebpackPlugin({ 
			// 	template: path.resolve(context, './public/index.html'), 
			// 	filename: 'index.html' 
			// })
		]
	}

	api.configureWebpack(config);

	api.chainWebpack(config => {
		config
			.plugin("HtmlWebpackPlugin")
			.use(HtmlWebpackPlugin, [ { 
				template: path.resolve(context, './public/index.html'), filename: 'index.html' 
			} ]);
	});
}
	