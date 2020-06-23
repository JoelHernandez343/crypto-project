/*global _node*/
import { icons } from './_icons';

const getIcon = name => {
  let ext = name.substring(name.lastIndexOf('.') + 1);

  return name === ext || !icons.has(ext) ? icons.get('others') : icons.get(ext);
};

const getFileName = file => file.replace(/.*[\\/]/, '');
const getIsFile = async file => (await _node.fsAsync.lstat(file)).isFile();

export { getFileName, getIsFile, getIcon };
