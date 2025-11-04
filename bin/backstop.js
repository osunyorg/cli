// need yq "brew install yq"
const shell = require("shelljs");
const config = require("./backstop/backstop-config.js");
const HUGO_SERVER_PORT = "7777";

// Run Backstop scripts
async function referenceAndTest (paths, configuration) {
    const backstop = require('backstopjs');
    addPaths(paths, configuration);
    await backstop('reference', {config: configuration});
    await backstop('test', {config: configuration}).then((success) => {
        console.log(success);
    }).catch((error) => {
        console.log(error);
    });
}

// Add pages to be testing : directly by CLI or default pages sample generate by local site debug
function addPaths (paths, config) {
    if (paths) {
        paths = paths.split(',');
    }
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
        if (path === "null" || !path || path === "") {
            return;
        }
        const scenario = configuration.scenarios[0];
        const copy = {...scenario};
        copy.url += path;
        copy.referenceUrl += path;
        copy.label = copy.referenceUrl;
        configuration.scenarios.push(copy);
    });
    console.log(configuration);
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

async function changeBranch(branch) {
    shell.exec('yarn \;')
    shell.exec('pwd');
    shell.exec('git pull \;');
    shell.cd('themes/osuny');
    shell.exec(`git checkout ${branch} && git pull \;`);
    shell.cd('../..');
}

module.exports = async function (path, paths = "", branch = null, callback = null) {
    shell.cd(path);
    let productionUrl = shell.exec("yq '.baseURL' config/production/config.yaml", { silent: true }).stdout;
    productionUrl = productionUrl.replace('\n', '');

    shell.exec(`kill -9 $(lsof -t -i:${HUGO_SERVER_PORT})`);

    if (branch) {
        await changeBranch(branch);
    }

    config.scenarios.forEach(scenario => {
        scenario.url = scenario.url.replace('PORT', HUGO_SERVER_PORT);
        scenario.url = scenario.url.replace(/\/$/, '');
        scenario.referenceUrl = productionUrl;
        scenario.referenceUrl = scenario.referenceUrl.replace(/\/$/, '');
    });

    const hugoServer = shell.exec(`hugo serve -p ${HUGO_SERVER_PORT} --minify`, { async: true });
    hugoServer.stdout.on('data', async function(data) {
        if (data.indexOf(`Web Server is available at //localhost:${HUGO_SERVER_PORT}/`) > -1) {
            await referenceAndTest(paths, config);
            shell.exec(`kill -9 $(lsof -t -i:${HUGO_SERVER_PORT})`);

            if (callback) callback();
        }
    });
}
