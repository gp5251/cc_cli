const ora = require('ora');
const download = require('download-git-repo');

module.exports = function (template, appName, {clone}) {
  const spinner = ora('downloading template')
  spinner.start()

  // if (exists(appName)) rm(appName)

  download('gp5251/' + template, appName, { clone }, err => {
    spinner.stop()
    // if (err) logger.fatal('Failed to download repo ' + template + ': ' + err.message.trim())

    // generate(name, tmp, to, err => {
    //   if (err) logger.fatal(err)
    //   console.log()
    //   logger.success('Generated "%s".', name)
    // })
  })
}
