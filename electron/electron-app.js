const { app, BrowserWindow } = require('electron');
const { handleInitialize } = require('./code/handle-events');
const path = require('path');

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

app.whenReady().then(() => {
  createWindow();
  handleInitialize(window);
});
