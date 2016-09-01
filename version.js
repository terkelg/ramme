'use strict';
const electron = require('electron');
const request = require('request');
const shell = electron.shell;

const app = electron.app;

exports.check = function() {
  request.get('https://raw.githubusercontent.com/terkelg/ramme/master/package.json', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var versionJson = JSON.parse(body);
        var newestVersion = versionJson.version;
        if (newestVersion > app.getVersion()) {
          var versionMessage = electron.dialog.showMessageBox({
            type: 'info',
            title: `Update available`,
            message: `${app.getName()} ${newestVersion} is available`,
            buttons: [`Download now`, 'Remind me later'],
            cancelId: 3
          });

          if (versionMessage === 0) {
            shell.openExternal('https://github.com/terkelg/ramme/releases');
          };
        }
    }
  });
};
