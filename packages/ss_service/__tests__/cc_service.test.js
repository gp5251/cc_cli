'use strict';

const fs = require('fs');
const Service = require('../lib/Service');
const createMockService = (plugins = [], init = true, mode) => {
	const service = new Service('/', {
		plugins,
		useBuiltIn: false
	})
	if (init) {
		service.init(mode)
	}
	return service
}

const mockPkg = json => {
	fs.writeFileSync('/package.json', JSON.stringify(json, null, 2))
}

describe('cc_service', () => {
    it('needs tests', ()=>{
			//
		});
});
