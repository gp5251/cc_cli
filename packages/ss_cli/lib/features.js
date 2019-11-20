const featuresHandler = {
	vuex(preset) {
		preset.vuex = true;
		preset.plugins.ss_plugin_vuex = {};
		preset.plugins.ss_service.vuex = true;
	},

	vue_router(preset, {routerHistoryMode}) {
		preset.vue_router = true;
		preset.routerHistoryMode = routerHistoryMode;
		preset.plugins.ss_plugin_vue_router = { routerHistoryMode };
		preset.plugins.ss_service.router = true;
		preset.plugins.ss_service.routerHistoryMode = routerHistoryMode;
	},

	less(preset) {
		preset.less = true;
		preset.plugins.ss_service.less = true;
		preset.plugins.ss_plugin_less = {};
	},

	babel(preset) {
		preset.plugins.ss_plugin_babel = {};
	}
}

module.exports = (type) => {
	return featuresHandler[type]
};
