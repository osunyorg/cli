const updateSite = require("./update");
const backstop = require("./backstop");
const shell = require("shelljs");
let websites = [];
let branch = null;

function backstopNextSite () {
    shell.cd('..');

    if (websites.length > 0) {
        backstop(websites[0], "/", branch, backstopNextSite);
        websites.shift();
    } else {
        console.log('ended')
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
