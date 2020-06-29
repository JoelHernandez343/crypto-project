const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const UPLOAD_PATH = path.join('electron', 'tmpToUpload');
const DECRYPT_PATH = path.join('electron', 'tmpToDecrypt');

function AESencrypt(file, key, iv) {
  return new Promise((resolve, reject) => {
    let output = path.join(UPLOAD_PATH, `${file.replace(/^.*[\\\/]/, '')}.crp`);

    let w = fs.createWriteStream(output);
    let r = fs.createReadStream(file, { encoding: null });

    let encrypt = crypto.createCipheriv('aes-256-ctr', key, iv);

    let size = fs.statSync(file).size;

    r.on('data', data => {
      let percentage = parseInt(r.bytesRead) / parseInt(size);
      // console.log(percentage * 100);
    });

    r.on('open', () => r.pipe(encrypt).pipe(w));
    r.on('end', () => resolve(output));
    r.on('error', () => reject);
  });
}

function hash(file) {
  return new Promise((resolve, reject) => {
    const reader = fs.createReadStream(file);
    const hash = crypto.createHash('sha256');

    reader.on('readable', () => {
      // Only one element is going to be produced by the
      // hash stream.
      const data = reader.read();
      if (data) hash.update(data);
      else {
        resolve(hash.digest());
      }
    });
  });
}

function bufferToString(buffer) {
  return buffer.toString('hex');
}

function stringToBuffer(string) {
  return Buffer.from(string, 'hex');
}

module.exports = {
  AESencrypt,
  hash,
  bufferToString,
  stringToBuffer,
  UPLOAD_PATH,
  DECRYPT_PATH,
};
