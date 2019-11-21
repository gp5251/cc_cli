#!/usr/bin/env node

const program = require('commander')

program
  .version(require('../package').version)
  .usage('<command> [options]')

program
  .command('create <app-name>')
  .description('通过ss_service创建一个项目')
  .option('-g, --git [message]', 'git初始化信息')
  .option('-n, --no-git', '跳过git初始化')
  .option('-f, --force', '目标目录存在时覆盖掉目标目录')
  .action((name, cmd) => {
    const options = cleanArgs(cmd)

    // --git makes commander to default git to true
    if (process.argv.includes('-g') || process.argv.includes('--git')) {
      options.forceGit = true
    }

    require('../lib/create')(name, options)
	})

program
  .command('init <template> <app-name>')
  .description('通过远程模版创建项目')
  .option('-c, --clone', '获取远程模版使用clone的方式')
  .action((template, appName, cmd) => {
    require('../lib/init')(template, appName, cleanArgs(cmd))
	})

program
  .command('add <pluginName>')
  .description('安装插件')
  .action((pluginName) => {
    require('../lib/add')(pluginName)
	})

program
  .command('invoke <pluginName>')
  .description('配置插件')
  .action((pluginName) => {
    require('../lib/invoke')(pluginName)
	})

program
  .command('serve [entry]')
  .description('快速原型开发')
  .option('-m, --mode <mode>', '使用模式，默认为 development')
  .option('-p, --port <port>', '使用端口，默认为 8080')
  .option('-h, --host <host>', '使用端口，默认为 localhost')
  .action((entry, cmd) => {
		let func;
		try{
			func = require('../../ss_service_global');
		}catch(e) {
			console.error(e);
		};

		if (func) func.serve(entry, cleanArgs(cmd));
		else process.exit(1);
	})

program
  .command('build [entry]')
  .description('快速原型构建')
  .option('-m, --mode <mode>', '使用模式，默认为 development')
  .action((entry, cmd) => {
		let func;
		try{
			func = require('../../ss_service_global');
		}catch(e) {
			console.error(e);
		};

		if (func) func.build(entry, cleanArgs(cmd));
		else process.exit(1);
  })

program.parse(process.argv)

function camelize (str) {
	return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}
	
function cleanArgs (cmd) {
	const args = {}
	cmd.options.forEach(o => {
		const key = camelize(o.long.replace(/^--/, ''))
		// if an option is not present and Command has a method with the same name
		// it should not be copied
		if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
			args[key] = cmd[key]
		}
	})
	return args
}