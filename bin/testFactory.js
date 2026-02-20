const shell = require("shelljs");
const test = require("./test");
let websites = [];


function testNextSite () {
    shell.cd('..');

    if (websites.length > 0) {
        let result = test(websites[0], testNextSite);
        websites.shift();
    } else {
        console.log('ended');
    }
}

module.exports = function () {
    shell.ls('.').forEach((folder, i) => {
        websites.push(folder);
    });

    if (websites.length > 0) {
        shell.cd(websites[0]);
        testNextSite();
    }
}
