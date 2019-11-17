const inquirer = require('inquirer')
const chalk = require('chalk')
const execa = require('execa')
const { clearConsole, hasGit, hasProjectGit, writeFileTree, loadModule, installDeps, logWithSpinner, stopSpinner } = require('cc_utils')
const Generator = require('./generator')

class Creator {
	constructor(projectName, context, prompts = []) {
		this.name = projectName;
		this.context = context;
		this.prompts = prompts;
		// this.createCompleteCbs = [];
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

		Object.keys(preset.plugins).forEach(plg => pkg.devDependencies[plg] = "0.0.0");

		await writeFileTree(context, {
			"package.json": JSON.stringify(pkg, null, 2)
		});

		// 安装依赖
		stopSpinner();
		console.log(`⚙  Installing CLI plugins. This might take a while...`)
		await installDeps(context);

		// 执行插件代码，生成文件目录
		console.log(`🚀  Invoking generators...`)
		const plugins = this.resolvePlugins(preset.plugins, context);
		const generator = new Generator(context, {
			pkg,
			plugins
		})
		await generator.generate();

		// 安装其他由插件generator增加的依赖
		await installDeps(context);

		// 完成回调
		// for (const cb of this.createCompleteCbs) await cb();

		// 初始化git状态
		if (hasGit() && !hasProjectGit()) {
			await execa('git', ['init'], { cwd: context })

			let msg = typeof git === 'string' ? git : 'init';
			await execa('git', ['add', '-A'], { cwd: context })
			await execa('git', ['commit', '-m', msg], { cwd: context })
		}

		// 输出说明
		console.log('')
		console.log(`🎉  Successfully created project ${chalk.yellow(this.name)}.`)
	}

	resolvePreset({preset, features, routerHistoryMode}) {
		const _preset = {
			plugins: {
				'cc_service' : { }
			}
		};

		if (preset === 'default') {
			this.addVuex(_preset);
			this.addRouter(_preset, true);
			_preset.plugins.cc_service = {
				vuex: true,
				router: true,
				routerHistoryMode: true
			}
		} else {
			features.includes('vuex') && this.addVuex(_preset);
			features.includes('vue_router') && this.addRouter(_preset, routerHistoryMode);

			// if (answers.cssPreprocessor) {
			// 	preset.vuex = answers.cssPreprocessor;
			// }
		}

		writeFileTree(this.context, {
			".presetrc": JSON.stringify(_preset, null, 2)
		});

		return _preset;
	}

	addVuex(preset) {
		preset.vuex = true;
		preset.plugins.cc_plugin_vuex = {};
		preset.plugins.cc_service.vuex = true;
	}

	addRouter(preset, routerHistoryMode) {
		preset.vue_router = true;
		preset.plugins.cc_plugin_vue_router = { routerHistoryMode };
		preset.plugins.cc_service.router = true;
		preset.plugins.cc_service.routerHistoryMode = routerHistoryMode;
	}

	resolvePlugins(plugins, context) {
		return Object.keys(plugins)
						.map(plg => ({ name: plg, apply: loadModule(`${plg}/generator`, context), options: plugins[plg] }));
	}

}


module.exports = Creator;