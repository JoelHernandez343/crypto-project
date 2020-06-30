const { ipcMain, dialog } = require('electron');
const fs = require('fs');

const {
  logSession,
  loadSession,
  closeSession,
  defaultUser,
} = require('./google-api/google-oauth');

const {
  protect,
  DECRYPT_PATH,
  UPLOAD_PATH,
  areRsaKeys,
  loadRSAPaths,
  recover,
} = require('./crypto/crypto');

const {
  postFile,
  listOnlyFiles,
  deleteFile,
  deleteAllFiles,
} = require('./google-api/drive');

const { loadLocalImage, removeFile } = require('./helpers/utils');

function handleInitialize(window, app) {
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

  ipcMain.handle('areRsaKeys', async () => areRsaKeys());
  ipcMain.handle('loadRSAPaths', async () => await loadRSAPaths());

  ipcMain.handle('uploadFile', async (event, file) => await postFile(file));

  ipcMain.handle(
    'deleteAllFiles',
    async (event, list) => await deleteAllFiles(list)
  );

  ipcMain.handle('listOnlyFiles', async () => {
    try {
      return await listOnlyFiles();
    } catch (err) {
      return err;
    }
  });

  ipcMain.handle('deleteFile', async (event, id) => {
    try {
      return await deleteFile(id);
    } catch (err) {
      return err;
    }
  });

  ipcMain.handle('getDownloadDir', async () => app.getPath('downloads'));

  ipcMain.handle(
    'openDir',
    async () =>
      (
        await dialog.showOpenDialog({
          properties: ['openDirectory'],
          title: 'Seleccionar directorio de descarga',
        })
      ).filePaths[0]
  );

  ipcMain.handle(
    'recover',
    async (event, file, destDir) => await recover(file, destDir)
  );
}

module.exports.handleInitialize = handleInitialize;
