const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const inquirer = require('inquirer')
const download = require('download-git-repo');
const { clearConsole, logWithSpinner, stopSpinner, loadModule, installDeps } = require('ss_utils')
const Metalsmith = require('metalsmith');
const ejs = require('ejs');

module.exports = async function (template, appName, {clone}) {
	const context = process.cwd();
	const gitRepo = template.split('/').join('/ss_template_');
	const tplPath = path.resolve(context, appName + '/.template');

	if (fs.existsSync(tplPath)) fs.removeSync(tplPath);

	await clearConsole()
	logWithSpinner(`✨`, `Downloading template from ${chalk.yellow(gitRepo)}.`)

  download(gitRepo, tplPath, { clone }, async err => {
		stopSpinner()
		if (err) {
			console.error('下载模版失败： ' + template + ': ' + err.message.trim());
			process.exit(1);
		}

		// const downloadPath = path.resolve(process.cwd(), tplPath);
		const appPath = path.resolve(process.cwd(), appName);
		await create(tplPath, appPath, {appName});

		fs.remove(tplPath);

		console.log(`⚙  正在安装依赖, 请稍等...`)
		await installDeps(appPath);

		console.log('')
		console.log(`🎉  成功创建项目 ${chalk.yellow(appName)}.`)
  })
}

async function getPromptsAnswer(context) {
	let answers;
	let promptsPath = path.resolve(context, 'prompts.js');
	if (fs.existsSync(promptsPath)) {
		const prompts = loadModule('prompts.js', context);
		answers = await inquirer.prompt(prompts);
	}

	return answers;
}

async function create(tplPath, targetPath, data){
	const answer = await getPromptsAnswer(tplPath);
	const metadata = Object.assign({}, answer, data);
	
	await createByMetalsmith(tplPath, targetPath, metadata);
}

function createByMetalsmith(tplPath, targetPath, metadata) {
	return new Promise((resolve, reject) => {
		const metalsmith = Metalsmith(tplPath);
		metalsmith
			.metadata(metadata)
			.source('./template')
			.destination(targetPath)
			.use(function (files, metalsmith, done) {
				Object.keys(files).forEach(fileName => {
					const fileContentsString = files[fileName].contents.toString();
					files[fileName].contents = new Buffer(ejs.render(fileContentsString, metalsmith.metadata()));
				});
				done();
			}).build(function (err) {
				if (err) reject(err);
				else resolve()
			});
	})
}