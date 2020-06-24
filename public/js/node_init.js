const { ipcRenderer } = require('electron');

const initTmpDir = async () => await ipcRenderer.invoke('initTmpDir', 'tmp');

const fileDialog = async () => await ipcRenderer.invoke('openFileDialog');
const minimize = async () => ipcRenderer.invoke('minimize');
const close = async () => ipcRenderer.invoke('close');

const getIsFile = async path => await ipcRenderer.invoke('getIsFile', path);

const encrypt = async file => await ipcRenderer.invoke('encrypt', file);

const _node = {
  fileDialog,
  initTmpDir,
  minimize,
  close,
  getIsFile,
  encrypt,
};
