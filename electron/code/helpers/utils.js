const fs = require('fs');
const https = require('https');
const fsAsync = fs.promises;
const path = require('path');

async function readJSON(path) {
  return JSON.parse(await fsAsync.readFile(path, { encoding: 'utf8' }));
}

async function writeJSON(json, path) {
  await fsAsync.writeFile(path, JSON.stringify(json));
}

async function writeDirAndJSON(json, localPath, fileName) {
  try {
    await fsAsync.mkdir(localPath, { recursive: true });
  } catch (err) {
    console.log(err);
  }

  let fullPath = path.join(localPath, fileName);

  await writeJSON(json, fullPath);

  console.log(`Written ${fullPath}`);
}

async function loadLocalImage(localPath, ext) {
  let encoded = await fsAsync.readFile(localPath, {
    encoding: 'base64',
  });

  return `data:image/${ext};base64, ${encoded}`;
}

function fetchImage(url, localPath) {
  return new Promise((resolve, reject) => {
    let file = fs.createWriteStream(localPath);
    let res = https.get(url, response => {
      response.pipe(file);
      response.on('end', resolve);
      response.on('error', reject);
    });

    res.on('error', reject);
  });
}

async function removeFile({ fullPath, dir, name }) {
  return fullPath
    ? await fsAsync.unlink(fullPath)
    : await fsAsync.unlink(path.join(dir, name));
}

module.exports = {
  readJSON,
  writeJSON,
  writeDirAndJSON,
  loadLocalImage,
  fetchImage,
  removeFile,
};
