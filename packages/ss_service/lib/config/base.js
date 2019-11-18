const path = require('path');

module.exports = {
  context: '/Users/paul/Desktop/My Files/formMaker',
  output: {
    path: '/Users/paul/Desktop/My Files/formMaker/dist',
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
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
			use: [ 'vue-loader' ]
		}, {
			test: /\.(less|css)$/,
			use: [
				// isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
				'css-loader',
				'postcss-loader',
				'less-loader'
			],
		}, {
			test: /\.(woff|svg|eot|ttf)\??.*$/,
			loader: "url-loader",
			options: {
				limit: 8192,
				name: "[name].[hash:6].[ext]",
				publicPath: '/fonts/',
				outputPath: path.resolve('./build/fonts')
			}
		}]
  },
  plugins: [
    /* config.plugin('vue-loader') */
    new VueLoaderPlugin(),
    /* config.plugin('case-sensitive-paths') */
    new CaseSensitivePathsPlugin(),
		/* config.plugin('friendly-errors') */
		new FriendlyErrorsWebpackPlugin(),
    // new FriendlyErrorsWebpackPlugin(
    //   {
    //     additionalTransformers: [
    //       function () { /* omitted long function */ }
    //     ],
    //     additionalFormatters: [
    //       function () { /* omitted long function */ }
    //     ]
    //   }
    // ),
    /* config.plugin('progress') */
    new ProgressPlugin(),
    /* config.plugin('html') */
    new HtmlWebpackPlugin(
      {
        templateParameters: function () { /* omitted long function */ },
        template: '/Users/paul/Desktop/My Files/formMaker/public/index.html'
      }
    ),
    /* config.plugin('preload') */
    new PreloadPlugin(
      {
        rel: 'preload',
        include: 'initial',
        fileBlacklist: [
          /\.map$/,
          /hot-update\.js$/
        ]
      }
    ),
    /* config.plugin('prefetch') */
    new PreloadPlugin(
      {
        rel: 'prefetch',
        include: 'asyncChunks'
      }
    ),
    /* config.plugin('copy') */
    new CopyWebpackPlugin(
      [
        {
          from: '/Users/paul/Desktop/My Files/formMaker/public',
          to: '/Users/paul/Desktop/My Files/formMaker/dist',
          toType: 'dir',
          ignore: [
            '.DS_Store',
            {
              glob: 'index.html',
              matchBase: false
            }
          ]
        }
      ]
    )
  ],
  entry: {
    app: [
      './src/main.js'
    ]
  }
}
