// need yq "brew install yq"
const shell = require("shelljs");
const config = require("./backstop/backstop-config.js");
const { forEach } = require("../data/repositories.js");
const HUGO_SERVER_PORT = "7777";

async function referenceAndTest (configuration) {
    const backstop = require('backstopjs');
    await backstop('reference', {config: configuration});
    await backstop('test', {config: configuration});
}

module.exports = async function (path, pages = "") {
    shell.cd(path);
    const productionUrl = shell.exec("yq '.baseURL' config/production/config.yaml");


    config.scenarios.forEach(scenario => { 
        scenario.url = scenario.url.replace('PORT', HUGO_SERVER_PORT);
        scenario.referenceUrl = productionUrl;
    });

    pages = pages.split(',');
    pages.forEach(page => {
        const scenario = config.scenarios[0];
        const copy = {...scenario};
        copy.label += page;
        copy.url += '/' + page; 
        copy.referenceUrl += '/' + page; 
        config.scenarios.push(copy);
    });

    console.log('kill hugo server');
    shell.exec(`kill -9 $(lsof -t -i:${HUGO_SERVER_PORT})`);

    console.log('run hugo server');
    const hugoServer = shell.exec(`hugo serve -p ${HUGO_SERVER_PORT}`, { async: true });
    hugoServer.stdout.on('data', function(data) {
        if (data.indexOf("Web Server is available at //localhost:7777/") > -1) {
            referenceAndTest(config)
        }
    });
}

