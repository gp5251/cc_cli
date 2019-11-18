const fs = require('fs')
const GeneratorApi = require('./generatorApi')
const { writeFileTree, runCodemod } = require('ss_utils')

class Generator {
	constructor(context, { pkg = {}, plugins = []}) {
		this.context = context;
		this.pkg = pkg;
		this.plugins = plugins;
		this.files = {};
		this.imports = {};
		this.rootOptions = {};
		this.fileMiddlewares = [];
	}

	async generate() {
		// 执行插件代码
		const preset = loadPreset(this.context);
		this.plugins.forEach(({ id, apply, options = {} }) => {
			const gApi = new GeneratorApi(id, this, options, preset);
			apply(gApi, options);
		});

		// render
		await this.resolveFiles();

		// add package.json
		this.files['package.json'] = JSON.stringify(this.pkg, null, 2) + '\n'

		await writeFileTree(this.context, this.files)
	}

	async resolveFiles() {
		const files = this.files
		for (const middleware of this.fileMiddlewares) {
			// 渲染文件到字符串
			await middleware(files)
		}

		// handle imports and rootOptions
		Object.keys(files).forEach(file => {
			let imports = this.imports[file]
			imports = imports instanceof Set ? Array.from(imports) : imports
			if (imports && imports.length > 0) {
				files[file] = runCodemod(
					require('ss_utils/lib/codemods/injectImports'),
					{ path: file, source: files[file] },
					{ imports }
				)
			}

			let injections = this.rootOptions[file]
			injections = injections instanceof Set ? Array.from(injections) : injections
			if (injections && injections.length > 0) {
				files[file] = runCodemod(
					require('ss_utils/lib/codemods/injectOptions'),
					{ path: file, source: files[file] },
					{ injections }
				)
			}
		})
	}
}

function loadPreset(context) {
	return JSON.parse(fs.readFileSync(context + '/.presetrc', 'utf-8'))
}

module.exports = Generator;