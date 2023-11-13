#!/usr/bin/env node

const shell = require("shelljs");
const repositories = require("../data/repositories");
const os = require('os');


// commands
const commands = {
  "clone-all": function(argv) {
    const path = argv[3] || '.';

    shell.cd(path);
    repositories.forEach(repository => {
      console.log(`osuny cloning ${repository}`);
      shell.exec(`git clone --recurse-submodules ${repository}`);
    });
  },
  "update-all": function(argv) {
    const path = argv[3] || '.';

    shell.set('-e'); // exit upon first error

    shell.cd(path);

    shell.ls('.').forEach(function (folder) {
      shell.cd(folder)
      shell.exec('git pull origin main --recurse-submodules \;')
      shell.cd('..')
    });
  },
  "update": function(argv) {
    const path = argv[3];
    shell.set('-e'); // exit upon first error

    if (!path) {
      return console.log('need path');
    }

    shell.cd(path)
    shell.exec('git pull origin main --recurse-submodules \;')
  },
  "serve": function(argv) {
    const networkInterfaces = os.networkInterfaces();
    let localIP = null;

    for(let entry in networkInterfaces) {
      networkInterfaces[entry].forEach((config) => {
        if (config.address.includes("192.168")) {
          localIP = config.address;
        }
      })
    }

    if (localIP) {
      shell.exec(`hugo serve --bind ${localIP} --baseUrl http://${localIP} -p 8000`);
      console.log(`running local network on : http://${localIP}`)
    } else {
      shell.exec('hugo serve');
    }
  }
}

const command = process.argv[2];

if (commands[command]) {
  console.log(`Osuny start ${command}`);
  commands[command](process.argv);
} else {
  console.log(`Osuny command doesn't exist ${command}`);
}
