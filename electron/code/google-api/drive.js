const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

let { auth } = require('./google-oauth');

function uploadFile(dir, name, key, hash) {
  return new Promise((resolve, reject) => {
    if (!auth) reject('No has iniciado sesión.');

    const drive = google.drive({ version: 'v3', auth });
    const reader = fs.createReadStream(path.join(dir, name));

    let fileMetadata = {
      name,
      parents: ['appDataFolder'],
      properties: {
        hash,
        key,
      },
    };

    let media = {
      mimeType: 'application/octet-stream',
      body: reader,
    };

    drive.files.create(
      {
        resource: fileMetadata,
        media: media,
        fields: 'id',
      },
      (err, file) => (err ? reject(err) : resolve())
    );
  });
}

function downloadFile(fileId, dir, name) {
  return new Promise((resolve, reject) => {
    if (!auth) reject('No has iniciado sesión.');

    const drive = google.drive({ version: 'v3', auth });
    const writer = fs.createWriteStream(path.join(dir, name));

    drive.files
      .get({ fileId, alt: 'media' }, { responseType: 'stream' })
      .then(res =>
        res.data
          .on('end', () => resolve(' Done downloading file.'))
          .on('error', reject)
          .pipe(writer)
      );
  });
}

function deleteFile(fileId) {
  return new Promise((resolve, reject) => {
    if (!auth) reject('No has iniciado sesión.');

    const drive = google.drive({ version: 'v3', auth });
    drive.files.delete(
      {
        fileId: fileId,
      },
      (err, file) => (err ? reject(err) : resolve())
    );
  });
}

async function deleteAllFiles(list) {
  if (!auth) throw 'No has iniciado sesión.';

  for (const file of list) {
    try {
      await deleteFile(file.id);
    } catch (err) {
      throw err;
    }
  }

  return 'All files deleted.';
}

function listFiles() {
  return new Promise((resolve, reject) => {
    if (!auth) reject('No has iniciado sesión.');

    const drive = google.drive({ version: 'v3', auth });

    drive.files.list(
      {
        spaces: 'appDataFolder',
        fields: 'nextPageToken, files(id,name,properties)',
      },
      (err, res) => {
        if (err) reject(err);
        const files = res.data.files;

        return !files.length
          ? resolve([])
          : resolve(
              files.map(file => ({
                id: file.id,
                name: file.name,
                hash: file.properties.hash,
                key: file.properties.key,
              }))
            );
      }
    );
  });
}

function searchFiles(hashString) {
  return new Promise((resolve, reject) => {
    if (!auth) reject('No has iniciado sesión.');

    const drive = google.drive({ version: 'v3', auth });

    drive.files.list(
      {
        q: `properties has { key='hash' and value='${hashString}'}`,
        spaces: 'appDataFolder',
        fields: 'nextPageToken, files(id,name,properties)',
      },
      (err, res) => {
        if (err) reject(err);
        const files = res.data.files;

        return !files.length
          ? resolve(undefined)
          : resolve({
              id: files[0].id,
              name: files[0].name,
              hash: files[0].properties.hash,
              key: files[0].properties.key,
            });
      }
    );
  });
}

module.exports = {
  uploadFile,
  downloadFile,
  deleteFile,
  deleteAllFiles,
  listFiles,
  searchFiles,
};
