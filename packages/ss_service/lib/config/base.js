const path = require('path');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
// const ProgressPlugin = require('webpack/lib/ProgressPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (api, options) => {
	const context = api.service.context;
	// const {pages} = options;
	// const HtmlWebpackPlugins = [];
	// const eytries = {};
	
	// if (pages) {
	// 	Object.keys(pages).forEach(pageName => {
	// 		const {
	// 			entry, 
	// 			template = path.resolve(context, './public/index.html'),
	// 			filename = pageName
	// 		} = pages[pageName];

	// 		HtmlWebpackPlugins.push(new HtmlWebpackPlugin({
	// 			entry, template, filename
	// 		}));
	// 	})
	// } else {
	// }

	const config = {
		entry: {
			app: path.resolve(context, './src/main.js')
		},
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
			extensions: [
				'.js',
				'.jsx',
				'.vue',
				'.json'
			],
		},
		module: {
			noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
			rules: [{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [{
					loader: 'babel-loader?cacheDirectory=true',
				}],
			}, {
				test: /\.vue$/,
				exclude: /node_modules/,
				use: ['vue-loader']
			}, {
				test: /\.(woff|svg|eot|ttf)\??.*$/,
				loader: "url-loader",
				options: {
					limit: 8192,
					name: "[name].[hash:6].[ext]",
					publicPath: '/fonts/',
					outputPath: path.resolve('./dist/fonts')
				}
			}]
		},
		plugins: [
			new VueLoaderPlugin(),
			// new CaseSensitivePathsPlugin(),
			new FriendlyErrorsWebpackPlugin(),
			// new ProgressPlugin(),
			// new CopyWebpackPlugin( [
			//     {
			//       from: path.resolve(context, './public'),
			//       to: path.resolve(context, './dist'),
			//       toType: 'dir',
			//       ignore: [
			//         '.DS_Store',
			//         {
			//           glob: 'index.html',
			//           matchBase: false
			//         }
			//       ]
			//     }
			// 	]),
			// ...HtmlWebpackPlugins

			new HtmlWebpackPlugin({ 
				template: path.resolve(context, './public/index.html'), 
				filename: '[name].html' 
			})
		]
	}

	api.configureWebpack(config);
}
	