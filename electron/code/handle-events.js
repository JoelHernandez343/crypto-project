const { ipcMain, dialog } = require('electron');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const {
  logSession,
  loadSession,
  closeSession,
  defaultUser,
} = require('./google-api/google-oauth');
const { AESencrypt, DECRYPT_PATH, UPLOAD_PATH } = require('./crypto/crypto');
const { loadLocalImage, removeFile } = require('./helpers/utils');

const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function handleInitialize(window) {
  ipcMain.handle('initTmpDirs', async event => {
    fs.rmdirSync(UPLOAD_PATH, { recursive: true }, err => console.log(err));
    fs.mkdirSync(UPLOAD_PATH);

    fs.rmdirSync(DECRYPT_PATH, { recursive: true }, err => console.log(err));
    fs.mkdirSync(DECRYPT_PATH);
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

  ipcMain.handle(
    'loadLocalImage',
    async (event, image, ext) => await loadLocalImage(image, ext)
  );

  ipcMain.handle('removeFile', async (event, path) => await removeFile(path));

  // Google oauth
  ipcMain.handle('logSession', async () => await logSession());
  ipcMain.handle('loadSession', async () => await loadSession());
  ipcMain.handle('closeSession', async () => await closeSession());
  ipcMain.handle('defaultUser', async () => await defaultUser());
}

module.exports.handleInitialize = handleInitialize;
