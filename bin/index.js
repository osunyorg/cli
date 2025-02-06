#!/usr/bin/env node

const shell = require("shelljs");
const repositories = require("../data/repositories");
const repositoriesInProduction = require("../data/repositories-in-production");
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

const migrateAction = function (path) {
  let hasLayouts = {}, hasTheme = {}, buildResult = {};

  shell.cd(path);

  shell.exec("git pull");
  shell.cd("themes/osuny");
  shell.exec("git checkout main");
  shell.exec("git pull");
  shell.cd("../..");

  hasLayouts = shell.exec('[ -d "./layouts" ] ')
  if (hasLayouts.code === 0) {
    shell.exec("yarn install");
    shell.exec("yarn upgrade osuny");
    shell.exec("yarn osuny migrate");
    buildResult = shell.exec("hugo");
    if (buildResult.code != 0) {
      console.log('build failed');
      return null;
    }

    console.log("\n🎉 Migration terminée !\n");
  } else {
    console.log("\n😶 Pas de dossier 'layouts' à la racine du site.\n")
  }

  hasTheme = shell.exec(' [ $(find ./themes/ -mindepth 1 -maxdepth 1 -type d | wc -l) -gt 1 ]; ')
  if (hasTheme.code == 0) {
    console.log('\n🐣 Ce site contient un theme !\n')
  } else {
    shell.exec("git add . && git status");
    shell.exec("git commit -m 'theme'");
    shell.exec("git push");
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
  "clone-sites-in-production": function(argv) {
    const path = argv[3] || preferences.websitesInProductionPath;

    shell.cd(path);
    repositoriesInProduction.forEach(repository => {
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
    migrateAction(path);
  },
  "migrate-all": function(argv) {
    const path = argv[3] || '.';
    let result;

    shell.set('-e'); // exit upon first error

    shell.cd(path);

    shell.ls('.').forEach((folder, i) => {

      if (i > 3) {
        return;
      }
      console.log(`--------------------------------------------`);
      console.log(`| ${folder} - Osuny migrate`);
      console.log(`--------------------------------------------`);
      result = migrateAction(folder);
      shell.cd('..');
    });
  },
}

const command = process.argv[2];

if (commands[command]) {
  console.log(`Osuny start ${command}`);
  commands[command](process.argv);
} else {
  console.log(`Osuny command doesn't exist ${command}`);
}
