// need yq "brew install yq"
const shell = require("shelljs");
const config = require("./backstop/backstop-config.js");
const HUGO_SERVER_PORT = "7777";

// Run Backstop scripts
async function referenceAndTest (paths, configuration) {
    const backstop = require('backstopjs');
    addPaths(paths, configuration);
    await backstop('reference', {config: configuration});
    await backstop('test', {config: configuration});
}

// Add pages to be testing : directly by CLI or default pages sample generate by local site debug
function addPaths (paths, config) {
    if (paths.length > 0) {
        addScenarios(paths, config);
    } else {
        const samplePaths = getSample();
        addScenarios(samplePaths, config);
    }
}

// Add scenarios (pages) to backstop configuration
function addScenarios(paths, configuration) {
    paths.forEach(path => {
        const scenario = configuration.scenarios[0];
        const copy = {...scenario};
        copy.label += path;
        copy.url += '/' + path; 
        copy.referenceUrl += '/' + path; 
        configuration.scenarios.push(copy);
    });
}

// Get default pages sample 
function getSample () {
    const pathsResource = shell.exec(`wget -qO- http://localhost:${HUGO_SERVER_PORT}/sample.json`);
    if (pathsResource.stdout) {
        return JSON.parse(pathsResource.stdout);
    } else {
        return [];
    }
}

module.exports = async function (path, paths = "") {
    shell.cd(path);
    const productionUrl = shell.exec("yq '.baseURL' config/production/config.yaml");

    config.scenarios.forEach(scenario => { 
        scenario.url = scenario.url.replace('PORT', HUGO_SERVER_PORT);
        scenario.referenceUrl = productionUrl;
    });

    shell.exec(`kill -9 $(lsof -t -i:${HUGO_SERVER_PORT})`);

    const hugoServer = shell.exec(`hugo serve -p ${HUGO_SERVER_PORT}`, { async: true });
    hugoServer.stdout.on('data', function(data) {
        if (data.indexOf(`Web Server is available at //localhost:${HUGO_SERVER_PORT}/`) > -1) {
            referenceAndTest(paths, config);
        }
    });
}

