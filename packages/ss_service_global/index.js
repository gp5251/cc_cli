const fs = require('fs');
const path = require('path');
const Service = require('ss_service');
const babel = {
	id: "ss_plungin_babel",
	apply: require("ss_plugin_babel")
};
const less = {
	id: "ss_plungin_less",
	apply: require("ss_plugin_less")
};
const context = process.cwd();

function createService() {
	return new Service(context, {plugins: [
		babel,
		less
	]});
}

function findExisting(context, entries) {
	return entries.find(entry => {
		return fs.existsSync(path.join(context, entry));
	});
}

function resolveEntry(entry) {
	entry = entry || findExisting(context, [
		'main.js',
		'index.js',
		'App.vue',
		'app.vue'
	])

	if (!entry) {
		console.log(chalk.red(`没有找到入口文件： ${chalk.yellow(context)}.`))
		console.log(chalk.red(`有效入口文件需要是这些文件之一: main.js, index.js, App.vue 或者 app.vue.`))

		console.log()
		process.exit(1)
	}

	if (!fs.existsSync(path.join(context, entry))) {
		console.log(chalk.red(`入口文件 ${chalk.yellow(entry)} 不存在.`))

		console.log()
		process.exit(1)
	}

	process.env.SS_ENTRY = entry;

	// return entry;
}

exports.serve = function (entry, args){
	resolveEntry(entry);
	createService().run('serve', args)
};

exports.build = function (entry, args){
	resolveEntry(entry);
	createService().run('build', args)
};

