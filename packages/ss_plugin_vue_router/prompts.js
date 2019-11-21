const prompts = [
  {
    "name": "routerHistoryMode",
    "type": "confirm",
    "message": "Use history mode for router? \u001b[33m(Requires proper server setup for index fallback in production)\u001b[39m",
  }
];

module.exports = prompts;