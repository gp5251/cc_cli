class Generator {
	constructor(context, {pkg = {}, plugins = [], files = {}}) {
		this.context = context;
		this.pkg = pkg;
		this.plugins = plugins;
		this.files = files;
		this.fileMiddlewares = [];
		this.exitLogs = [];
	}

	generate() {
		//
	}

	render() {

	}

	extendPkg() {
		//
	}
}

module.exports = Generator;