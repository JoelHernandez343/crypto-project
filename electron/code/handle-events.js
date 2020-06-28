const { ipcMain, dialog } = require('electron');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const oauth = require('./google-oauth/google-oauth');
const { AESencrypt } = require('./crypto/crypto');

const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const handleInitialize = window => {
  ipcMain.handle('initTmpDir', async (event, folder) => {
    const dest = path.join('electron', folder);

    fs.rmdirSync(dest, { recursive: true }, err => console.log(err));
    fs.mkdirSync(dest);
  });

  ipcMain.handle('openFileDialog', async () => {
    const r = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
    });

    return r.filePaths;
  });

  ipcMain.handle('minimize', async () => window.minimize());

  ipcMain.handle('close', async () => window.close());

  ipcMain.handle(
    'encrypt',
    async (event, file) => await AESencrypt(file, key, iv)
  );

  ipcMain.handle('getIsFile', async (event, path) =>
    fs.lstatSync(path).isFile()
  );

  // Google oauth
  ipcMain.handle('googleSignIn', async () => await oauth.googleLogIn());
};

module.exports.handleInitialize = handleInitialize;
