const { ipcMain, dialog } = require('electron');
const fs = require('fs');

const {
  logSession,
  loadSession,
  closeSession,
  defaultUser,
} = require('./google-api/google-oauth');
const { protect, DECRYPT_PATH, UPLOAD_PATH } = require('./crypto/crypto');
const { loadLocalImage, removeFile } = require('./helpers/utils');

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

  ipcMain.handle('protect', async (event, file) => await protect(file));

  ipcMain.handle('getIsFile', async (event, path) =>
    fs.lstatSync(path).isFile()
  );

  ipcMain.handle(
    'loadLocalImage',
    async (event, image, ext) => await loadLocalImage(image, ext)
  );

  ipcMain.handle(
    'removeFile',
    async (event, options) => await removeFile(options)
  );

  // Google oauth
  ipcMain.handle('logSession', async () => await logSession());
  ipcMain.handle('loadSession', async () => await loadSession());
  ipcMain.handle('closeSession', async () => await closeSession());
  ipcMain.handle('defaultUser', async () => await defaultUser());
}

module.exports.handleInitialize = handleInitialize;
