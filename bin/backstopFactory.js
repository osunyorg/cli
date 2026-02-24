const updateSite = require("./update");
const backstop = require("./backstop");
const shell = require("shelljs");
const coloredLog = require("./utils/coloredLog");
let websites = [];
let branch = null;

function backstopNextSite () {
    shell.cd('..');

    if (websites.length > 0) {
        backstop({
            path: websites[0],
            branch: branch, 
            callback: backstopNextSite,
            configName: "factory"
        });
        websites.shift();
    } else {
        console.log('ended');
    }
}

module.exports = function (_branch) {
    branch = _branch;
    shell.ls('.').forEach((folder, i) => {
        websites.push(folder);
    });

    if (websites.length > 0) {
        shell.cd(websites[0]);
        backstopNextSite();
    }
}
