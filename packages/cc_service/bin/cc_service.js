#!/usr/bin/env node

const { error } = require('cc_cli/lib/utils')
const Service = require('../lib/Service')
const service = new Service(process.env.VUE_CLI_CONTEXT || process.cwd())
const rawArgv = process.argv.slice(2)
const args = require('minimist')(rawArgv, {
	boolean: [
		// build
		'modern',
		'report',
		'report-json',
		'inline-vue',
		'watch',
		// serve
		'open',
		'copy',
		'https',
		// inspect
		'verbose'
	]
})
const command = args._[0]

service.run(command, args, rawArgv).catch(err => {
	error(err)
	process.exit(1)
})
