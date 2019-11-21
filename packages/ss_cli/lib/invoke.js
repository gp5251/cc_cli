const fs = require('fs-extra')
const path = require('path')
const globby = require('globby')
const inquirer = require('inquirer')
const { isBinaryFileSync } = require('isbinaryfile')
const { loadModule, installDeps } = require('ss_utils')
const Generator = require('./generator')

const findPlg = (plgName, pkg) => {
	return plgName in pkg.devDependencies || plgName in pkg.dependencies
}

const loadMod = (context, modName) => {
	let mod;
	try{
		mod = require(path.resolve(context, modName))
	}catch(e) {}
	return mod;
}

const getPkg = context => {
	return loadMod(context, 'package.json')
}
 
async function runGenerator(context, plugin, pkg = getPkg(context)) {
	const generator = new Generator(context, {
		pkg,
		plugins: [plugin],
		files: await readFiles(context)
	});

	console.log('正在执行generator');
	await generator.generate();

	console.log('正在安装额外依赖');
	await installDeps(context);

	console.log('配置插件结束');
}

async function readFiles(context) {
	const files = await globby(['**'], {
		cwd: context,
		onlyFiles: true,
		gitignore: true,
		ignore: ['**/node_modules/**', '**/.git/**'],
		dot: true
	});
	const res = {}
	for (const file of files) {
		const name = path.resolve(context, file)
		res[file] = isBinaryFileSync(name)
			? fs.readFileSync(name)
			: fs.readFileSync(name, 'utf-8')
	};
	return res;
}

async function invoke(pluginName, context = process.cwd()) {
	// 拿pkg
	const plgName = 'ss_plugin_' + pluginName;
	const pkg = getPkg(context)

	// 检查是否已安装插件
	const foundPlg = findPlg(plgName, pkg);
	if (!foundPlg) {
		console.error(`没有找到插件${plgName}， 是否已经安装？`);
		process.exit(1)
	}

	// 拿prompts
	let prompts = loadModule(plgName + '/prompts', context);
	let options = {};
	if (prompts) {
		options = await inquirer.prompt(prompts);
	}

	// 执行generator
	let generator = loadModule(plgName + '/generator', context);
	if (!generator) {
		console.error(`插件 ${plgName} 没有generator`);
		process.exit(1)
	}

	const plugin = {
		id: plgName,
		apply: generator,
		options
	}

	// run generator
	runGenerator(context, plugin);
}

module.exports = (...args) => {
  return invoke(...args).catch(err => {
    console.error(err);
    process.exit(1);
  });
};
