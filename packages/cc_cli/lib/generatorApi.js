const path = require('path')
const ejs = require('ejs')
const chalk = require('chalk')
const fs = require('fs')
const globby = require('globby')
const merge = require('deepmerge')
const { isBinaryFileSync } = require('isbinaryfile')

class GeneratorApi {
	constructor(name, generator, options, rootOptions) {
		this.generator = generator;
		this.name = name;
		this.options = options;
		this.rootOptions = rootOptions;

		this.pluginsData = generator.plugins
			.filter(({ name }) => name !== `cc_service`)
			.map(({ nam }) => ({
				name,
				link: getPluginLink(name)
			}))

		this.entryFile = 'src/main.js';
	}

	// get entryFile() {
	// 	return fs.existsSync(this.resolve('src/main.ts')) 
	// 						? 'src/main.ts' 
	// 						: 'src/main.js'
	// }

	render(from, data = {}) {
		const baseDir = extractCallDir();
		if (!fs.existsSync(path.resolve(baseDir, from))) {
			console.error(`${chalk.red(from)} is not exist`);
			process.exit(1);
		}

		const source = path.resolve(baseDir, from)

		this.generator.fileMiddlewares.push(async files =>{
			const _files = await globby(['**/*'], { cwd: source });
			_files.forEach(filePath => {
				const targetPath = filePath.split('/').map(filename => {
					if (filename.charAt(0) === '_' && filename.charAt(1) !== '_') {
						return '.' + filename.slice(1);
					}
					if (filename.charAt(0) === '_' && filename.charAt(1) === '_') {
						return filename.slice(1)
					}
					return filename
				}).join('/');

				const sourcePath = path.resolve(source, filePath)
				Object.assign(data, {options: this.options, rootOptions: this.rootOptions, plugins: this.pluginsData})
				const content = renderFile(sourcePath, data)
				// only set file if it's not all whitespace, or is a Buffer (binary files)
				if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
					files[targetPath] = content
				}
			})
		})
	}

	resolve(_path) {
		return path.resolve(this.generator.context, _path)
	}

	injectImports(file, imports) {
		const _imports = (
			this.generator.imports[file] ||
			(this.generator.imports[file] = new Set())
		);
		(Array.isArray(imports) ? imports : [imports]).forEach(imp => {
			_imports.add(imp)
		})
	}

	injectRootOptions(file, options) {
		const _options = (
			this.generator.rootOptions[file] ||
			(this.generator.rootOptions[file] = new Set())
		); 
		(Array.isArray(options) ? options : [options]).forEach(opt => {
			_options.add(opt)
		})
	}

	extendPackage(pkgItem) {
		this.generator.pkg = merge(this.generator.pkg, pkgItem);
	}

	hasPlugin(name) {
		return "cc_plugin_" + name in this.generator.pkg.devDependencies
			|| this.generator.pkg.dependencies && ("cc_plugin_" + name in this.generator.pkg.dependencies)
	}
} 

function renderFile(filepath, data) {
	// 二进制文件直接返回
	if(isBinaryFileSync(filepath)) {
		return fs.readFileSync(filepath) // return buffer
	}

	const template = fs.readFileSync(filepath, 'utf-8');
	if (!template) return ''; 

	return ejs.render(template, data);
}

function extractCallDir() {
	// extract api.render() callsite file location using error stack
	const obj = {}
	Error.captureStackTrace(obj)
	const callSite = obj.stack.split('\n')[3]
	const fileName = callSite.match(/\s\((.*):\d+:\d+\)$/)[1]
	return path.dirname(fileName)
}

function	getPluginLink (id) {
	let pkg = {}
	try {
		pkg = require(`${id}/package.json`)
	} catch (e) { }
	return (
		pkg.homepage ||
		(pkg.repository && pkg.repository.url) ||
		`https://www.npmjs.com/package/${id.replace(`/`, `%2F`)}`
	)
}

module.exports = GeneratorApi;