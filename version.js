'use strict';
const electron = require('electron');
const https = require('https');

const shell = electron.shell;
const app = electron.app;

exports.check = function() {
  https.get('https://raw.githubusercontent.com/terkelg/ramme/master/package.json', (res) => {
    if (!res.error && res.statusCode == 200) {
      res.on('data', (d) => {
        var versionJson = JSON.parse(d);
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
        };
      });
    };
  });
};
