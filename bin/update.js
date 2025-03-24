const shell = require("shelljs");

module.exports = function (path, push = false) {
  shell.cd(path)
  shell.exec('git checkout main \;')
  shell.exec('git pull origin main --recurse-submodules \;')

  // Updates all themes
  shell.cd('themes')
  shell.ls('.').forEach((folder) => {
    console.log(folder)
    shell.cd(folder);
    shell.exec('git checkout main && git pull \;')
    shell.cd('..');
  });

  shell.cd('..');

  if (push) {
    shell.exec('git commit -am "theme" && git push \;')
  } else {
    console.log('If you want to publish the updated theme use "-p" or "--push" option')
  }
}