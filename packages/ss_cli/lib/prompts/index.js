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
        // "description": "Structure the app with dynamic pages",
        // "link": "https://router.vuejs.org/"
      },
      {
        "name": "Vuex",
        "value": "vuex",
        // "description": "Manage the app state with a centralized store",
        // "link": "https://vuex.vuejs.org/"
      },
      {
        "name": "CSS Pre-processors",
        "value": "cssPreprocessor",
        // "description": "Add support for CSS pre-processors like Sass, Less or Stylus",
        // "link": "https://cli.vuejs.org/guide/css.html"
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
  },
  {
    "name": "cssPreprocessor",
    "type": "list",
    "message": "Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default):",
    // "description": "PostCSS, Autoprefixer and CSS Modules are supported by default.",
    "choices": [
      {
        "name": "Sass/SCSS (with dart-sass)",
        "value": "dart-sass"
      },
      {
        "name": "Sass/SCSS (with node-sass)",
        "value": "node-sass"
      },
      {
        "name": "Less",
        "value": "less"
      },
      {
        "name": "Stylus",
        "value": "stylus"
      }
    ],
    when: answers => answers.features && answers.features.includes('cssPreprocessor'),
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