const shell = require("shelljs");

module.exports = function (path, repositories) {
  shell.cd(path);

  repositories.forEach(repository => {
    console.log(`osuny cloning ${repository}`);
    shell.exec(`git clone --recurse-submodules ${repository}`);
  });
}