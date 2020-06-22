const remote = require('electron').remote;
const { dialog } = remote;
const fsAsync = require('fs').promises;

const _node = {
  remote,
  dialog,
  fsAsync
};