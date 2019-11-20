module.exports = (api, options) => {
	api.extendPackage({
		babel: {
			"presets": [ "@babel/preset-env" ],
			"plugins": [
				"@babel/plugin-transform-runtime",
				"@babel/plugin-syntax-dynamic-import"
			]
		},
		dependencies: {
			'core-js': '^2.6.5'
		}
	})
}