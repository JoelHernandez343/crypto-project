const { ipcRenderer } = require('electron');

const initTmpDirs = async () => await ipcRenderer.invoke('initTmpDirs');

const fileDialog = async () => await ipcRenderer.invoke('openFileDialog');
const minimize = async () => ipcRenderer.invoke('minimize');
const close = async () => ipcRenderer.invoke('close');

const getIsFile = async path => await ipcRenderer.invoke('getIsFile', path);
const removeFile = async options =>
  await ipcRenderer.invoke('removeFile', options);

const protect = async file => await ipcRenderer.invoke('protect', file);

const loadLocalImage = async (image, ext) =>
  await ipcRenderer.invoke('loadLocalImage', image, ext);

const logSession = async () => await ipcRenderer.invoke('logSession');
const loadSession = async () => await ipcRenderer.invoke('loadSession');
const closeSession = async () => await ipcRenderer.invoke('closeSession');
const defaultUser = async () => await ipcRenderer.invoke('defaultUser');
const uploadFile = async () => await ipcRenderer.invoke('uploadFile');

const _node = {
  fileDialog,
  initTmpDirs,
  minimize,
  close,
  getIsFile,
  protect,
  logSession,
  loadLocalImage,
  loadSession,
  closeSession,
  defaultUser,
  uploadFile,
  removeFile,
};
