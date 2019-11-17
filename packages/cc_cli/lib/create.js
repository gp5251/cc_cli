const fs = require('fs-extra')
const path = require('path')
const { clearConsole } = require('cc_utils')
const prompts = require('./prompts')
const Creator = require('./creator')

async function create(projectName, {git, force}) {
	const cwd = process.cwd();
	const targetDir = path.resolve(cwd, projectName || '.');

	if (fs.existsSync(targetDir)) {
		// handle the targetDir exist
		if (force) await fs.remove(targetDir)
		else {
			await clearConsole()
			// todo
		}
	}

	const creator = new Creator(projectName, targetDir, prompts);
  await creator.create();
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    console.error(err);
    process.exit(1);
  });
};
