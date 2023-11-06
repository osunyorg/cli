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
    shell.exec("find . -type d -depth 1 -exec 'git --git-dir={}/.git --work-tree=$PWD/{} pull origin main --recurse-submodules \;'")
  }
}

const command = process.argv[2];

if (commands[command]) {
  console.log(`Osuny start ${command}`);
  commands[command](process.argv);
} else {
  console.log(`Osuny command doesn't exist ${command}`);
}
