const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

let { authentification } = require('./google-oauth');

function uploadFile(dir, name, key, hash) {
  return new Promise((resolve, reject) => {
    if (!authentification.auth) reject('No has iniciado sesión.');

    const drive = google.drive({ version: 'v3', auth: authentification.auth });
    const reader = fs.createReadStream(path.join(dir, name));

    let fileMetadata = {
      name,
      parents: ['appDataFolder'],
      properties: {
        hash: `${hash}`,
        isKey: false,
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
      (err, file) => {
        if (err) reject(err);

        uploadKeyFile(name, hash, key).then(resolve).catch(reject);
      }
    );
  });
}

function uploadKeyFile(name, hash, key) {
  return new Promise((resolve, reject) => {
    const drive = google.drive({ version: 'v3', auth: authentification.auth });

    let fileMetadata = {
      name: `${name}.key`,
      parents: ['appDataFolder'],
      properties: {
        hash: `${hash}`,
        isKey: true,
      },
    };

    let media = {
      mimeType: 'application/octet-stream',
      body: key,
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
    if (!authentification.auth) reject('No has iniciado sesión.');

    const drive = google.drive({ version: 'v3', auth: authentification.auth });
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
    if (!authentification.auth) reject('No has iniciado sesión.');

    const drive = google.drive({ version: 'v3', auth: authentification.auth });
    drive.files.delete(
      {
        fileId: fileId,
      },
      (err, file) => (err ? reject(err) : resolve())
    );
  });
}

async function deleteAllFiles(list) {
  if (!authentification.auth) throw 'No has iniciado sesión.';

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
    if (!authentification.auth) reject('No has iniciado sesión.');

    const drive = google.drive({ version: 'v3', auth: authentification.auth });

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
                isKey: file.properties.isKey,
              }))
            );
      }
    );
  });
}

function listOnlyFiles() {
  return new Promise((resolve, reject) => {
    if (!authentification.auth) reject('No has iniciado sesión.');

    const drive = google.drive({ version: 'v3', auth: authentification.auth });

    drive.files.list(
      {
        q: `properties has { key='isKey' and value='false'}`,
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
                isKey: file.properties.isKey,
              }))
            );
      }
    );
  });
}

function searchFiles(hashString) {
  return new Promise((resolve, reject) => {
    if (!authentification.auth) reject('No has iniciado sesión.');

    const drive = google.drive({ version: 'v3', auth: authentification.auth });

    drive.files.list(
      {
        q: `properties has { key='hash' and value='${hashString}'}`,
        spaces: 'appDataFolder',
        fields: 'nextPageToken, files(id,name,properties)',
      },
      (err, res) => {
        if (err) reject(err);
        const files = res.data.files;

        return !files.length ? resolve(undefined) : resolve(files);
      }
    );
  });
}

async function postFile(file) {
  try {
    let r = await searchFiles(file.hash);
    if (r) {
      console.log('Found: ', JSON.stringify(r));
      return 'Ya existe el archivo';
    }

    await uploadFile(file.outDir, file.outName, file.key, file.hash);
    return true;
  } catch (err) {
    return err;
  }
}

module.exports = {
  uploadFile,
  downloadFile,
  deleteFile,
  deleteAllFiles,
  listFiles,
  listOnlyFiles,
  searchFiles,
  postFile,
};
