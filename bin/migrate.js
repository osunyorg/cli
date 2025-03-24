const updateSite = require("./update");
const shell = require("shelljs");

module.exports = migrateAction = function (path) {
  let hasLayouts = {}, hasTheme = {}, buildResult = {};

  updateSite(path);

  shell.cd('../..');

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
