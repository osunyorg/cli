const shell = require("shelljs");
const coloredLog = require("./utils/coloredLog.js");
const updateSite = require("./update");

module.exports = function (path = ".", callback) {
    let hasError = false;
    updateSite(path, false, false)

    const hugoServer = shell.exec(`hugo `, { async: true, silent: true });
    hugoServer.stdout.on('finish', async function() {
        if (hasError) {
            coloredLog.error(`Error : ${path}`)
        } else {
            coloredLog.success(`Success : ${path}`)
        }
        if (callback) callback();
    });

    hugoServer.stderr.on('data', function(data) {
        if (data.indexOf(`ERROR`) > -1) {
            hasError = true
        }
    });
};