const fs = require('fs-extra')
// const readline = require('readline')
const path = require('path')

const utils = {
	getPluginLink (id) {
		let pkg = {}
		try {
			pkg = require(`${id}/package.json`)
		} catch (e) { }
		return (
			pkg.homepage ||
			(pkg.repository && pkg.repository.url) ||
			`https://www.npmjs.com/package/${id.replace(`/`, `%2F`)}`
		)
	},

	hasGit() {
		return true
	},

	async writeFileTree(dir, files) {
		if (process.env.CC_CLI_SKIP_WRITE) {
			return
		}

		Object.keys(files).forEach((name) => {
			const filePath = path.join(dir, name)
			fs.ensureDirSync(path.dirname(filePath))
			fs.writeFileSync(filePath, files[name])
		})
	}
};

[ 'logger', 'module', 'installDeps', 'spinner', 'runCodemod' ].forEach(mod => {
	Object.assign(utils, require('./' + mod))
})

module.exports = utils;