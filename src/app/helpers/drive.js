/*global _node*/

const uploadFile = async file => await _node.uploadFile(file);
const listOnlyFiles = async () => await _node.listOnlyFiles();

export { uploadFile, listOnlyFiles };
