const fs = require('fs-extra')
const path = require('path')
const { clearConsole } = require('ss_utils')
const inquirer = require('inquirer')
const prompts = require('./prompts')
const Creator = require('./creator')

async function create(projectName, {git, force}) {
	const cwd = process.cwd();
	const targetDir = path.resolve(cwd, projectName || '.');

	if (fs.existsSync(targetDir)) {
		if (force) await fs.remove(targetDir)
		else {
			let answers = await inquirer.prompt([{
				name: 'confirm',
		    message: "目标目录存在，请选择处理方法",
				type: 'list',
				choices: [
					{name: 'remove', value: 'remove'},
					{name: 'merge', value: 'merge'},
					{name: 'cancel', value: 'cancel'}
				]
			}]);

			if (answers.confirm = 'remove') await fs.remove(targetDir);
			else if (answers.confirm = 'cancel') {
				process.exit(1);
			}

			await clearConsole()
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
