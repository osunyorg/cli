#!/usr/bin/env node

const shell = require("shelljs");
const repositories = require("../data/repositories");
const preferences = require("../data/preferences");
const os = require('os');

const updateThemeAction = function (path, push = false) {
  shell.cd(path)
  shell.exec('git checkout main \;')
  shell.exec('git pull origin main --recurse-submodules \;')
  shell.cd('themes/osuny')
  shell.exec('git checkout main && git pull \;')

  if (push) {
    shell.cd('..')
    shell.exec('git commit -am "theme" && git push \;')
  } else {
    console.log('If you want to publish the updated theme use "-p" or "--push" option')
  }
}

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
      console.log(`--------------------------------------------`);
      console.log(`| ${folder} - Osuny updating`);
      console.log(`--------------------------------------------`);
      updateThemeAction(folder)
      shell.cd('../../..')
    });
  },
  "clone": function(argv) {
    if (!argv[3]) {
      return console.log('Need a repository url');
    }

    const repo = argv[3],
          folderName = argv[3].replace(/\/$/, "").split('/').at(-1)

    shell.set('-e');
    shell.cd(preferences.websitesPath);
    shell.exec(`git clone ${repo} --recurse-submodules`);
    this.run(folderName);
  },
  "run": function(site) {
    if (typeof site == 'object') {
      site = site[3]
    }

    if (!site) {
      return console.log('Need a site name (folder path)');
    }

    shell.set('-e');
    shell.cd(preferences.websitesPath + '/' + site);
    shell.exec(`code .`);
    shell.exec(`yarn upgrade && yarn osuny dev`, { async: true });
    shell.exec(`open -a "Google Chrome" http://localhost:1313`);
  },
  "update": function(argv) {
    const path = argv[3] || ".",
      push = argv.includes('-p') || argv.includes('--push');

    shell.set('-e'); // exit upon first error

    updateThemeAction(path, push)
  },
  "u": function(argv) {
    this.update(['', '', '.']);
  },
  "up": function(argv) {
    this.update(['-p']);
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
