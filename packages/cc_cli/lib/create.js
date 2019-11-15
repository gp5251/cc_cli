const fs = require('fs-extra')
const path = require('path')
const execa = require('execa')
const inquirer = require('inquirer')
const prompts = require('./prompts')
const { clearConsole, hasGit, writeFileTree, loadModule, installDeps } = require('./utils')
const Generator = require('./generator')

module.exports = async function create(projectName, {git, force}) {
	const cwd = process.cwd();
	const targetDir = path.resolve(cwd, projectName || '.');
	const createCompleteCbs = [];

	if (fs.existsSync(targetDir)) {
		// handle the targetDir exist
		if (force) await fs.remove(targetDir)
		else {
			await clearConsole()
			// todo
		}
	}

	// resolve prompts
	const answers = await inquirer.prompt(prompts);
	const options = resolveOptions(answers);
	
	// log
	await clearConsole()
	// logWithSpinner(`✨`, `Creating project in ${chalk.yellow(context)}.`)

	// 生成package.json
	const pkg = {
		name: projectName,
		version: '0.1.0',
		private: true,
		devDependencies: { }
	}

	options.plugins.forEach(plg => pkg.devDependencies[plg === 'cc_service'? plg : 'cc_plugin_' + plg] = "0.0.0") // todo

	await writeFileTree(targetDir, {
		"package.json": JSON.stringify(pkg, null, 2)
	});

	// 安装依赖
	console.log(`⚙  Installing CLI plugins. This might take a while...`)
	await installDeps(targetDir);

	// 执行插件代码，生成文件目录
	console.log(`🚀  Invoking generators...`)
	const plugins = resolvePlugins(options.plugins, targetDir);
	const generator = new Generator(targetDir, {
		pkg,
		plugins,
		completeCbs: createCompleteCbs
	})
	await generator.generate();

	// 安装其他由插件generator增加的依赖
	await installDeps(targetDir)

	// 完成回调
	for (const cb of createCompleteCbs) await cb();

	// 初始化git状态
	if (git && hasGit()) {
		await execa('git', ['init'], { cwd: targetDir })

		let msg = typeof git === 'string' ? git : 'init'
			// await execa('git', ['add', '-A'], { cwd: targetDir })
		await execa('git', ['commit', '-Am', msg], { cwd: targetDir })
	}

	// 输出说明
	console.log('')
	console.log(`🎉  Successfully created project ${chalk.yellow(projectName)}.`)
}

function resolveOptions(answers) {
	const options = { 
		plugins: ['cc_service'] 
	};

	if (answers.preset === 'default') {
		options.vue_router = true; 
		options.routerHistoryMode = true;
		options.vuex = true; 
		options.preset = 'default';
		options.plugins.push('vuex', 'vue_router');
	} else {
		answers.features.forEach(f => {
			options[f] = true; 
			options.plugins.push(f);
			if (f === 'vue_router') {
				options.routerHistoryMode = answers.routerHistoryMode;
			}
		});

		if (answers.cssPreprocessor) {
			options.vuex = answers.cssPreprocessor; 
		}
	}

	return options;
}

function resolvePlugins(plugins, context) {
	// 初始化只有这三个插件，现在这样处理就ok了
	const plugins = [];
	
	['vuex', 'vue_router'].forEach(plugin => {
		if (fromPlugins.includes[plugin]) {
			plugins.push()
		}
	});

	return plugins.map(plg => ({name: plugin, apply: loadModule(`${plg === 'cc_service' ? plg : 'cc_plugin_' + plg}/generator`, context)}));
}
