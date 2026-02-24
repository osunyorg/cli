const shell = require("shelljs");
const repositories = {
  "all": require("../data/repositories"),
  "in-production": require("../data/repositories-in-production"),
  "not-in-production": require("../data/repositories-not-in-production"),
}

module.exports = function (path, state = "all") {
  shell.cd(path);

  console.log(`cloning : ${repositories[state].length} websites`);

  repositories[state].forEach(repository => {
    console.log(`osuny cloning ${repository}`);
    shell.exec(`git clone --recurse-submodules ${repository}`);
  });
}