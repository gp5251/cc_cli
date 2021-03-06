const path = require('path')
const inquirer = require('inquirer')
const chalk = require('chalk')
const execa = require('execa')
const semver = require('semver')
const { clearConsole, hasGit, hasProjectGit, writeFileTree, loadModule, installDeps, logWithSpinner, stopSpinner } = require('ss_utils')
const Generator = require('./generator')
const featuresHandler = require('./features')

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
		logWithSpinner(`✨`, `正在创建项目： ${chalk.yellow(this.name)}.`)

		// 生成package.json
		const pkg = {
			name: this.name,
			version: '0.1.0',
			private: true,
			devDependencies: {}
		}

		const version = require('../package.json').version;
		Object.keys(preset.plugins).forEach(plg => pkg.devDependencies[plg] = `^${semver.major(version)}.${semver.minor(version)}.0`);

		await writeFileTree(context, {
			"package.json": JSON.stringify(pkg, null, 2)
		});

		// 安装依赖
		stopSpinner();
		console.log(`⚙  正在安装CLI插件，可能需要花一点时间...`)
		await installDeps(context);

		// 执行插件代码，生成文件目录
		console.log(`🚀  正在执行 generators...`)
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
		console.log(`🎉  创建项目成功；${chalk.yellow(this.name)}. 位于 ${chalk.yellow(context)}`)
	}

	resolvePreset({preset, features, routerHistoryMode}) {
		const _preset = {
			plugins: {
				'ss_service' : { }
			}
		};

		if (preset === 'default') {
			featuresHandler('vuex')(_preset);
			featuresHandler('vue_router')(_preset, {routerHistoryMode: true});

			_preset.plugins.ss_service = {
				vuex: true,
				router: true,
				routerHistoryMode: true
			}
		} else {
			features.forEach(feature => {
				const fn = featuresHandler(feature);
				if (fn) fn(_preset, {routerHistoryMode})
			});
		}

		writeFileTree(this.context, {
			".presetrc": JSON.stringify(_preset, null, 2)
		});

		return _preset;
	}

	resolvePlugins(plugins, context) {
		return Object.keys(plugins)
						.map(plg => ({ id: plg, apply: loadModule(`${plg}/generator`, context), options: plugins[plg] }));
	}

}


module.exports = Creator;