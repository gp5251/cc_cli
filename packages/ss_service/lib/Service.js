const path = require('path');
const merge = require('webpack-merge')
const WebpackChain = require('webpack-chain')
const deepClone = require('lodash.clonedeep')
const fs = require('fs-extra');
const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')
const PluginApi = require('./PluginApi')
const { warn } = require('ss_utils')

class Service{
	constructor(context) {
		process.SS_CLI_SERVICE = this
		this.initialized = false
		this.context = context
		this.webpackChainFns = []
		this.webpackRawConfigFns = []
		this.commands = {}
		// this.pkgContext = context
		this.pkg = require(path.resolve(context, 'package.json'))
		this.plugins = this.resolvePlugins()
		this.modes = this.plugins.reduce((modes, { apply: { defaultModes } }) => {
			return Object.assign(modes, defaultModes)
		}, {})
	}

	init(mode = process.env.SS_CLI_MODE) {
		if (this.initialized) return;
		this.initialized = true;

		// 加载环境变量
		if (mode) {
			this.loadEnv(mode);
		}

		this.loadEnv()

		// 加载用户配置
		let userOptions = {};
		let userOptionsPath = path.resolve(this.context, 'ss.config.js');
		if (fs.existsSync(userOptionsPath)) {
			userOptions = require(userOptionsPath);
		}

		let defaultOptions = require('./config/userConfigDefaults')
		this.projectOptions = deepClone(defaultOptions, userOptions)

		// 加载插件
		this.plugins.forEach(({id, apply}) => {
			const api = new PluginApi(id, this);
			apply(api, this.projectOptions);
		});

		// 插入用户webpack配置函数
		let {chainWebpack, configureWebpack} = userOptions;
		if (chainWebpack) {
			this.webpackChainFns.push(chainWebpack)
		}
		if (configureWebpack) {
			this.webpackChainFns.push(configureWebpack)
		}
	}

	loadEnv(mode) {
		const basePath = path.resolve(this.context, `.env${mode ? '.' + mode : ''}`)
		const localPath = `${basePath}.local`
		const load = path => {
			if (fs.existsSync(path)) {
				const env = dotenv.config({ path })
				dotenvExpand(env)
			}
		}

		load(localPath);
		load(basePath);
	}

	async run(name, args, rawArgs) {
		const mode = args.mode || this.modes[name];
		process.env.SS_CLI_MODE = mode;

		// 初始化
		this.init(mode);

		const command = this.commands[name]
		if (!command) {
			console.error(`command ${name} 不存在`);
			process.exit(1);
		}

		args._.shift();
		rawArgs.shift();

		// 执行插件注册的代码
		const {fn} = command;
		fn(args, rawArgs);
	}

	resolvePlugins() {
		const buildins = [
			'./commands/serve.js',
			'./commands/build.js',
			'./config/base.js'
		].map(id => ({id: id.replace(/^\./, 'build-in:'), apply: require(id)}));

		const pkgPlugins = Object.keys(this.pkg.devDependencies || {})
			.concat(Object.keys(this.pkg.dependencies || {}))
			.filter(id => id.indexOf('ss_plugin_') === 0 && !['ss_plugin_vuex', 'ss_plugin_vue_router'].includes(id))
			.map(id => {
				let apply = () => {};
				try {
					apply = require(id)
				} catch (e) {
					warn(`插件： ${id} 未正确安装.`)
				}
				return { id, apply}
			})

		return [...buildins, ...pkgPlugins];
	}

	resolveChainableWebpackConfig() {
		const chainableConfig = new WebpackChain();
		this.webpackChainFns.forEach(fn => fn(chainableConfig))
		return chainableConfig
	}

	resolveWebpackConfig(chainableConfig = this.resolveChainableWebpackConfig()) {
		let config = chainableConfig.toConfig();

		this.webpackRawConfigFns.forEach(fn => {
			if (typeof fn === 'function') {
				const res = fn(config)
				if (res) config = merge(config, res)
			} else if (fn) {
				config = merge(config, fn)
			}
		})

		return config;
	}
}

module.exports = Service;