#!/usr/bin/env node

const shell = require("shelljs");

const repositories = require("../data/repositories");

// commands
const commands = {
  "clone-all": function(argv) {
    const path = argv[3] || '.';

    shell.cd(`${path}`);
    repositories.forEach(repository => {
      console.log(`osuny cloning ${repository}`);
      shell.exec(`git clone --recurse-submodules ${repository}`);
    });
  },
  "update-all": function(argv) {
    const path = argv[3] || '.';

    shell.set('-e'); // exit upon first error

    shell.cd(`${path}`);

    shell.ls('.').forEach(function (folder) {
      console.log(folder)
      shell.cd(folder)
      shell.exec('git pull origin main --recurse-submodules \;')
      shell.cd('..')
    });
  }
}

const command = process.argv[2];

if (commands[command]) {
  console.log(`Osuny start ${command}`);
  commands[command](process.argv);
} else {
  console.log(`Osuny command doesn't exist ${command}`);
}
