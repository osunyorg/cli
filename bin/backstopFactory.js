const updateSite = require("./update");
const backstop = require("./backstop");
const shell = require("shelljs");
let websites = [];
const branchName = "adjustment/items-harmonization";

function backstopNextSite () {
    shell.cd('..');

    if (websites.length > 0) {
        backstop(websites[0], "/", branchName, backstopNextSite);
        websites.shift();
    } else {
        console.log('ended')
    }
}

module.exports = function () {
    shell.ls('.').forEach((folder, i) => {
        websites.push(folder);
    });

    if (websites.length > 0) {
        shell.cd(websites[0]);
        backstopNextSite();
    }


    // shell.cd(path);
    // let productionUrl = shell.exec("yq '.baseURL' config/production/config.yaml", { silent: true }).stdout;
    // productionUrl = productionUrl.replace('\n', '');

    // config.scenarios.forEach(scenario => {
    //     scenario.url = scenario.url.replace('PORT', HUGO_SERVER_PORT);
    //     scenario.url = scenario.url.replace(/\/$/, '');
    //     scenario.referenceUrl = productionUrl;
    //     scenario.referenceUrl = scenario.referenceUrl.replace(/\/$/, '');
    // });

    // shell.exec(`kill -9 $(lsof -t -i:${HUGO_SERVER_PORT})`);

    // const hugoServer = shell.exec(`hugo serve -p ${HUGO_SERVER_PORT} --minify`, { async: true });
    // hugoServer.stdout.on('data', function(data) {
    //     if (data.indexOf(`Web Server is available at //localhost:${HUGO_SERVER_PORT}/`) > -1) {
    //         referenceAndTest(paths, config);
    //     }
    // });
}
