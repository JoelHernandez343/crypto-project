const { ipcRenderer } = require('electron');

let _node = {};

_node.initTmpDirs = async () => await ipcRenderer.invoke('initTmpDirs');

_node.fileDialog = async () => await ipcRenderer.invoke('openFileDialog');
_node.minimize = async () => ipcRenderer.invoke('minimize');
_node.close = async () => ipcRenderer.invoke('close');

_node.getIsFile = async path => await ipcRenderer.invoke('getIsFile', path);
_node.removeFile = async options =>
  await ipcRenderer.invoke('removeFile', options);

_node.protect = async file => await ipcRenderer.invoke('protect', file);

_node.loadLocalImage = async (image, ext) =>
  await ipcRenderer.invoke('loadLocalImage', image, ext);

_node.logSession = async () => await ipcRenderer.invoke('logSession');
_node.loadSession = async () => await ipcRenderer.invoke('loadSession');
_node.closeSession = async () => await ipcRenderer.invoke('closeSession');
_node.defaultUser = async () => await ipcRenderer.invoke('defaultUser');
_node.uploadFile = async file => await ipcRenderer.invoke('uploadFile', file);
_node.listOnlyFiles = async () => await ipcRenderer.invoke('listOnlyFiles');
_node.deleteFile = async id => await ipcRenderer.invoke('deleteFile', id);
_node.deleteAllFiles = async list =>
  await ipcRenderer.invoke('deleteAllFiles', list);

_node.areRsaKeys = async () => await ipcRenderer.invoke('areRsaKeys');
_node.loadRSAPaths = async () => await ipcRenderer.invoke('loadRSAPaths');

_node.getDownloadDir = async () => await ipcRenderer.invoke('getDownloadDir');

_node.openDir = async () => await ipcRenderer.invoke('openDir');

_node.deleteBothFiles = async file =>
  await ipcRenderer.invoke('deleteBothFiles', file);

_node.recover = async (file, destDir) =>
  await ipcRenderer.invoke('recover', file, destDir);
