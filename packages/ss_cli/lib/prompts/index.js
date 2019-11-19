const prompts = [
  {
    "name": "preset",
    "type": "list",
    "message": "Please pick a preset:",
    "choices": [
      {
        "name": "default (vuex, router)",
        "value": "default"
      },
      {
        "name": "Manually select features",
        "value": "__manual__"
      }
    ]
  },
  {
    "name": "features",
    "type": "checkbox",
    "message": "Check the features needed for your project:",
    "choices": [
      {
        "name": "Router",
        "value": "vue_router",
      },
      {
        "name": "Vuex",
        "value": "vuex",
      },
      {
        "name": "CSS Pre-processors: less",
        "value": "less",
			},
			{
        "name": "babel",
        "value": "babel",
			}
		],
    "pageSize": 10
  },
  {
    "name": "routerHistoryMode",
    "type": "confirm",
    "message": "Use history mode for router? \u001b[33m(Requires proper server setup for index fallback in production)\u001b[39m",
    // "description": "By using the HTML5 History API, the URLs don't need the '#' character anymore.",
    // "link": "https://router.vuejs.org/guide/essentials/history-mode.html",
		when: answers => answers.features && answers.features.includes('vue_router')
  }
];

prompts.forEach((p, i) => {
	if (i > 0) {
		const originWhen = p.when || (()=>true);
		p.when = answers => {
			return answers.preset === '__manual__' && originWhen(answers)
		}
	}
});

module.exports = prompts;