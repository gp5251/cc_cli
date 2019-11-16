const path = require('path');
const fs = require('fe-extra');
const inquirer = require('inquirer')
const download = require('download-git-repo');
const { clearConsole, logWithSpinner, stopSpinner, loadModule } = require('./utils')
const Metalsmith = require('metalsmith');
const ejs = require('ejs');

module.exports = async function (template, appName, {clone}) {
	await clearConsole()
	logWithSpinner(`✨`, `Creating project in ${chalk.yellow(context)}.`)

	const tplPath = appName + '/.template';
  download(template, tplPath, { clone }, async err => {
		stopSpinner()
		if (err) logger.fatal('Failed to download repo ' + template + ': ' + err.message.trim())

		const downloadPath = path.resolve(process.cwd(), tplPath);
		const appPath = path.resolve(process.cwd(), appName);
		await create(downloadPath, appPath);
		fs.remove(downloadPath);
  })
}

async function getPromptsAnswer(context) {
	let answers;
	if (fs.existsSync(path.resolve(context, 'prompts'))) {
		const prompts = loadModule(path.resolve(context, 'prompts'));
		answers = await inquirer.prompt(prompts);
	}

	return answers;
}

async function create(from, to){
	const answer = await getPromptsAnswer(context);
	const metalsmith = Metalsmith(from);

	metalsmith
		.metadata(answer)
		.source('.')
		.destination(to)
		.use(function (files, metalsmith, done) {
			//遍历替换模板
			Object.keys(files).forEach(fileName => {
				const fileContentsString = files[fileName].contents.toString();
				// files[fileName].contents = new Buffer(Handlebars.compile(fileContentsString)(metalsmith.metadata()));
				files[fileName].contents = new Buffer(ejs.render(fileContentsString, metalsmith.metadata()))
			});
			done();
		}).build(function (err) {
			if (err) throw err;
		});

	console.log(`⚙  Installing CLI plugins. This might take a while...`)
	await installDeps(context);
}