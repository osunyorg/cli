#!/usr/bin/env node

const shell = require("shelljs");
const repositories = require("../data/repositories");
const repositoriesNotInProduction = require("../data/repositories-not-in-production");
const repositoriesInProduction = require("../data/repositories-in-production");
const preferences = require("../data/preferences");
const os = require('os');
const updateSite = require("./update");
const migrateSite = require("./update");
const cloneSites = require("./clone");
const backstop = require("./backstop");

// commands
const commands = {
  "clone-all": function(argv) {
    const path = argv[3] || '.';
    cloneSites(path, repositories)
  },
  "clone-sites-in-production": function(argv) {
    const path = argv[3] || preferences.websitesInProductionPath;
    cloneSites(path, repositoriesInProduction)
  },
  "clone-sites-not-in-production": function(argv) {
    const path = argv[3] || preferences.websitesNotInProductionPath;
    cloneSites(path, repositoriesNotInProduction)
  },
  "update-all": function(argv) {
    const path = argv[3] || '.';

    shell.set('-e'); // exit upon first error

    shell.cd(path);

    shell.ls('.').forEach(function (folder) {
      console.log(`--------------------------------------------`);
      console.log(`| ${folder} - Osuny updating`);
      console.log(`--------------------------------------------`);
      updateSite(folder)
      shell.cd('..')
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

    updateSite(path, push)
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
      var cmd = `hugo serve --bind ${localIP} -b http://${localIP} -p 8000`
      shell.exec(cmd);
      console.log(cmd);
      console.log(`running local network on : http://${localIP}`)
    } else {
      shell.exec('hugo serve');
    }
  },
  "migrate": function(argv) {
    const path = argv[3] || ".";
    migrateSite(path);
  },
  "migrate-all": function(argv) {
    const path = argv[3] || '.';

    shell.set('-e'); // exit upon first error

    shell.cd(path);

    shell.ls('.').forEach((folder, i) => {

      if (i > 3) {
        return;
      }
      console.log(`--------------------------------------------`);
      console.log(`| ${folder} - Osuny migrate`);
      console.log(`--------------------------------------------`);
      result = migrateSite(folder);
      shell.cd('..');
    });
  },
  "backstop": function(argv) {
    const path = argv[3] || ".";
    updateSite(path);
    backstop(path);
  },
}

const command = process.argv[2];

if (commands[command]) {
  console.log(`Osuny start ${command}`);
  commands[command](process.argv);
} else {
  console.log(`Osuny command doesn't exist ${command}`);
}
