/*global _node*/

const getFileName = file => file.replace(/.*[\\/]/, '');
const getIsFile = async file => (await _node.fsAsync.lstat(file)).isFile();

export { getFileName, getIsFile };
