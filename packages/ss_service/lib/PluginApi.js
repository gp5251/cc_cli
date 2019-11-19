class PluginApi {
	constructor(name, service) {
		this.name = name;
		this.service = service;
	}

	registerCommand(name, opts, fn) {
		if (arguments.length === 2) {
			fn = opts;
			opts = null;
		}
		this.service.commands[name] = {fn, opts: opts || {}}
	}

	configureWebpack(fn) {
		this.service.webpackRawConfigFns.push(fn);
	}

	chainWebpack(fn) {
		this.service.webpackChainFns.push(fn);
	}

	configureDevServer(fn) {
		this.service.devServerConfigFns.push(fn)
	}

	resolveChainableWebpackConfig() {
		return this.service.resolveChainableWebpackConfig()
	}

	resolveWebpackConfig() {
		return this.service.resolveWebpackConfig()
	}
}

module.exports = PluginApi;