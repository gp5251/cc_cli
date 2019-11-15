const execa = require('execa')
const inquirer = require('inquirer')
const chalk = require('chalk')
const { clearConsole, hasGit, writeFileTree, loadModule, installDeps, logWithSpinner, stopSpinner } = require('./utils')
const Generator = require('./generator')

class Creator {
	constructor(projectName, context, prompts) {
		this.name = projectName;
		this.context = context;
		this.prompts = prompts;
		this.createCompleteCbs = [];
	}

	async create() {
		// resolve prompts
		const answers = await inquirer.prompt(this.prompts);
		const preset = this.resolvePreset(answers);
		const context = this.context;

		await clearConsole()
		logWithSpinner(`✨`, `Creating project in ${chalk.yellow(context)}.`)

		// 生成package.json
		const pkg = {
			name: this.name,
			version: '0.1.0',
			private: true,
			devDependencies: {}
		}

		Object.assign(pkg.devDependencies, preset.plugins);

		await writeFileTree(context, {
			"package.json": JSON.stringify(pkg, null, 2)
		});

		// 安装依赖
		stopSpinner();
		console.log(`⚙  Installing CLI plugins. This might take a while...`)
		await installDeps(context);

		// 执行插件代码，生成文件目录
		console.log(`🚀  Invoking generators...`)
		const plugins = this.resolvePlugins(preset.features, context);
		const generator = new Generator(context, {
			pkg,
			plugins,
			completeCbs: this.createCompleteCbs
		})
		await generator.generate();

		// 安装其他由插件generator增加的依赖
		await installDeps(context);

		// 完成回调
		for (const cb of this.createCompleteCbs) await cb();

		// 初始化git状态
		if (hasGit()) {
			await execa('git', ['init'], { cwd: context })

			let msg = typeof git === 'string' ? git : 'init'
			// await execa('git', ['add', '-A'], { cwd: context })
			await execa('git', ['commit', '-Am', msg], { cwd: context })
		}

		// 输出说明
		console.log('')
		console.log(`🎉  Successfully created project ${chalk.yellow(this.name)}.`)
	}

	resolvePreset(answers) {
		const options = {
			features: ['cc_service'],
			plugins: {}
		};

		if (answers.preset === 'default') {
			options.vue_router = true;
			options.routerHistoryMode = true;
			options.vuex = true;
			options.preset = 'default';
			options.features.push('vuex', 'vue_router');
		} else {
			answers.features.forEach(f => {
				options[f] = true;
				options.features.push(f);
				if (f === 'vue_router') {
					options.routerHistoryMode = answers.routerHistoryMode;
				}
			});

			if (answers.cssPreprocessor) {
				options.vuex = answers.cssPreprocessor;
			}
		}

		options.features.forEach(plg => options.plugins[plg === 'cc_service' ? plg : 'cc_plugin_' + plg] = "0.0.0");

		writeFileTree(this.context, {
			".presetrc": JSON.stringify(options, null, 2)
		});

		return options;
	}

	resolvePlugins(plugins, context) {
		return Object.values(plugins)
						.map(plg => ({ name: plg, apply: loadModule(`${plg === 'cc_service' ? plg : 'cc_plugin_' + plg}/generator`, context) }));
	}

}


module.exports = Creator;