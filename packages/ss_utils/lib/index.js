const fs = require('fs-extra')
const readline = require('readline')
const path = require('path')

const utils = {
	clearConsole () {
		if (process.stdout.isTTY) {
			const blank = '\n'.repeat(process.stdout.rows)
			console.log(blank)
			readline.cursorTo(process.stdout, 0, 0)
			readline.clearScreenDown(process.stdout)
		}
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

[ 
	'module', 
	'installDeps', 
	'spinner', 
	'runCodemod', 
	'env'
].forEach(mod => {
	Object.assign(utils, require('./' + mod))
})

module.exports = utils;