// need yq "brew install yq"
var shell = require("shelljs");
var config = require("./backstop/backstop-config.js");
var HUGO_SERVER_PORT = "7777";

async function referenceAndTest (configuration) {
    var backstop = require('backstopjs');
    await backstop('reference', {config: configuration});
    await backstop('test', {config: configuration});
}

module.exports = async function (path, page = "") {
    shell.cd(path);
    var productionUrl = shell.exec("yq '.baseURL' config/production/config.yaml");
    // this is only test the homepage
    config.scenarios.forEach((scenario) => { 
        scenario.url = scenario.url.replace('PORT', HUGO_SERVER_PORT + '/' + page);
        scenario.referenceUrl = productionUrl + '/' + page;
    });

    console.log('kill hugo server');
    shell.exec(`kill -9 $(lsof -t -i:${HUGO_SERVER_PORT})`);

    console.log('run hugo server');
    var hugoServer = shell.exec(`hugo serve -p ${HUGO_SERVER_PORT}`, { async: true });
    hugoServer.stdout.on('data', function(data) {
        if (data.indexOf("Web Server is available at //localhost:7777/") > -1) {
            referenceAndTest(config)
        }
    });
}

