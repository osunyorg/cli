const shell = require("shelljs");
const path = require("path");

module.exports = function () {
    const toolsPath = path.dirname(require.main.filename);
    shell.cd(toolsPath);
    shell.cd('../app/osuny-manager-vue');
    shell.exec('yarn dev');
}