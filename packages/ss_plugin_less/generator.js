module.exports = api => {
  api.extendPackage({
		devDependences: {
			"postcss-loader": "^3.0.0",
			"less": "^2.7.0",
			"less-loader": "^4.0.5",
			"autoprefixer": "^9.7.2"
		},
    'postcss': {
      'plugins': {
        'autoprefixer': {
					"overrideBrowserslist": ['last 2 version', '>1%']
				}
      }
    }
	})
}