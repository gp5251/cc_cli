module.exports = (api, options) => {
	api.extendPackage({
		babel: {
			"presets": [
				[
					"@babel/preset-env",
					{
						"modules": false,
						"useBuiltIns": "usage"
					}
				]
			],
			"plugins": [
				"@babel/plugin-transform-runtime",
				"@babel/plugin-syntax-dynamic-import"
			]
		},
		dependencies: {
			'core-js': '^2.6.5',
			"@babel/plugin-syntax-dynamic-import": "^7.2.0",
			"@babel/plugin-transform-runtime": "^7.0.0"
		}
	})
}