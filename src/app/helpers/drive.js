/*global _node*/

const uploadFile = async file => await _node.uploadFile(file);
const listOnlyFiles = async () => await _node.listOnlyFiles();
const deleteFile = async id => await _node.deleteFile(id);
const deleteAllFiles = async list => await _node.deleteAllFiles(list);
const deleteBothFiles = async file => await _node.deleteBothFiles(file);

const recover = async (file, destDir) => await _node.recover(file, destDir);

export {
  uploadFile,
  listOnlyFiles,
  deleteFile,
  deleteAllFiles,
  recover,
  deleteBothFiles,
};
