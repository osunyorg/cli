const shell = require("shelljs");

module.exports = function (path, push = false, showHint = true) {
  shell.cd(path)
  shell.exec('git checkout main \;', {silent: true})
  shell.exec('git pull origin main --recurse-submodules \;', {silent: true})

  // Updates all themes
  shell.cd('themes')
  shell.ls('.').forEach((folder) => {
    shell.cd(folder);
    shell.exec('git checkout main && git pull \;', {silent: true})
    shell.cd('..', {silent: true});
  });

  shell.cd('..', {silent: true});
  shell.exec('yarn upgrade \;', {silent: true})

  if (push) {
    shell.exec('git commit -am "theme" && git push \;')
  } else if (showHint) {
    console.log('If you want to publish the updated theme use "-p" or "--push" option')
  }
}