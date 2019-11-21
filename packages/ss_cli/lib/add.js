// const path = require('path')
const invoke = require('./invoke')
const { installPackage } = require('ss_utils')

async function add(pluginName, context = process.cwd()) {
	const pkgName = "ss_plugin_" + pluginName;
	
	await installPackage(context, pkgName);

	let generator;
	try{
		generator = require(pkgName + '/generator');
	} catch (e) {}

	if (generator) {
		invoke(pluginName, context);
	} else {
		console.log(`插件：${pluginName} 没有generator`);
	}
}

module.exports = (...args) => {
  return add(...args).catch(err => {
    console.error(err);
    process.exit(1);
  });
};
