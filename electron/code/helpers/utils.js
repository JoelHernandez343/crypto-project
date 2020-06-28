const fs = require('fs');
const https = require('https');
const fsAsync = fs.promises;
const path = require('path');

const readJSON = async path =>
  JSON.parse(await fsAsync.readFile(path, { encoding: 'utf8' }));

const writeJSON = async (json, path) =>
  await fsAsync.writeFile(path, JSON.stringify(json));

const writeDirAndJSON = async (json, localPath, fileName) => {
  try {
    await fsAsync.mkdir(localPath, { recursive: true });
  } catch (err) {
    console.log(err);
  }

  let fullPath = path.join(localPath, fileName);

  await writeJSON(json, fullPath);

  console.log(`Written ${fullPath}`);
};

const loadLocalImage = async (localPath, ext) => {
  let encoded = await fsAsync.readFile(localPath, {
    encoding: 'base64',
  });

  return `data:image/${ext};base64, ${encoded}`;
};

const fetchImage = async (url, localPath) =>
  new Promise((resolve, reject) => {
    let file = fs.createWriteStream(localPath);
    let res = https.get(url, response => {
      response.pipe(file);
      response.on('end', resolve);
      response.on('error', reject);
    });

    res.on('error', reject);
  });

module.exports = {
  readJSON,
  writeJSON,
  writeDirAndJSON,
  loadLocalImage,
  fetchImage,
};
