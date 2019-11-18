#!/usr/bin/env node

const program = require('commander')

program
  .version(require('../package').version)
  .usage('<command> [options]')

program
  .command('create <app-name>')
  .description('create a new project powered by ss_service')
  .option('-g, --git [message]', 'Force git initialization with initial commit message')
  .option('-n, --no-git', 'Skip git initialization')
  .option('-f, --force', 'Overwrite target directory if it exists')
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
  .description('generate a project from a remote template')
  .option('-c, --clone', 'Use git clone when fetching remote template')
  .action((template, appName, cmd) => {
    require('../lib/init')(template, appName, cleanArgs(cmd))
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