const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const { AESencrypt } = require('./electron/crypto');

const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

let window;

const createWindow = () => {
  let options = {
    width: 1000,
    height: 680,
    minWidth: 570,
    minHeigth: 470,
    frame: false,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
    },
  };

  window = new BrowserWindow(options);

  window.loadURL(
    !app.isPackaged
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, 'index.html')}`
  );
};

app.whenReady().then(createWindow);

ipcMain.handle('initTmpDir', async (event, folder) => {
  const dest = path.join('public', folder);

  fs.rmdirSync(dest, { recursive: true }, err => console.log(err));
  fs.mkdirSync(dest);
});

ipcMain.handle('openFileDialog', async (event, ...args) => {
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

ipcMain.handle('getIsFile', async (event, path) => fs.lstatSync(path).isFile());
