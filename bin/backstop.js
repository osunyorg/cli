// need yq "brew install yq"
var shell = require("shelljs");
var config = require("./backstop/backstop-config.js");
var HUGO_SERVER_PORT = "7777";


module.exports = function (path) {
    shell.cd(path);
    var productionUrl = shell.exec("yq '.baseURL' config/production/config.yaml");
    console.log('kill hugo server');
    shell.exec(`kill -9 $(lsof -t -i:${HUGO_SERVER_PORT})`);

    console.log('run hugo server');
    shell.exec(`hugo serve -p ${HUGO_SERVER_PORT}`, { async: true });

    setTimeout(async function(){
        var backstop = require('backstopjs');
        // this is only test the homepage
        config.scenarios.forEach((scenario) => { 
            scenario.url = scenario.url.replace('PORT', HUGO_SERVER_PORT);
            scenario.referenceUrl = productionUrl;
        });
        await backstop('reference', {config: config});
        await backstop('test', {config: config});
    }, 5000)
}

