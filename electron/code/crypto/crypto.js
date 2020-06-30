const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const { dialog } = require('electron');

const { separateDirAndName } = require('../helpers/utils');

const iv = strToBuff('36d6b93416b72e989359a5f0b73defde');

const UPLOAD_PATH = path.join('electron', 'tmpToUpload');
const DECRYPT_PATH = path.join('electron', 'tmpToDecrypt');
let PUBLIC_KEY_PATH, PRIVATE_KEY_PATH;

function AESencrypt(file, key) {
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

function AESdecrypt(file, key) {
  return new Promise((resolve, reject) => {
    let output = path.join(
      DECRYPT_PATH,
      `${file.replace(/^.*[\\\/]/, '').replace(/\.crp$/, '')}`
    );

    let w = fs.createWriteStream(output);
    let r = fs.createReadStream(file, { encoding: null });

    let decrypt = crypto.createDecipheriv('aes-256-ctr', key, iv);

    let size = fs.statSync(file).size;

    r.on('data', data => {
      let percentage = parseInt(r.bytesRead) / parseInt(size);
      // console.log(percentage * 100);
    });

    r.on('open', () => r.pipe(decrypt).pipe(w));
    r.on('end', () => resolve(output));
    r.on('error', () => reject);
  });
}

function hash(file) {
  return new Promise((resolve, reject) => {
    const reader = fs.createReadStream(file);
    const hash = crypto.createHash('sha256');

    reader.on('readable', () => {
      const data = reader.read();

      data ? hash.update(data) : resolve(hash.digest());
    });
  });
}

function areRsaKeys() {
  return PUBLIC_KEY_PATH && PRIVATE_KEY_PATH;
}

async function loadRSAPaths() {
  const public = (
    await dialog.showOpenDialog({
      properties: ['openFile'],
      title: 'LLAVE PÚBLICA',
    })
  ).filePaths[0];

  console.log(public);

  if (!public) return 'No se seleccionó ningún archivo';

  const private = (
    await dialog.showOpenDialog({
      properties: ['openFile'],
      title: 'LLAVE PRIVADA',
    })
  ).filePaths[0];

  console.log(private);

  if (!private) return 'No se seleccionó ningún archivo';

  try {
    const msj = '36d6b93416b72e989359a5f0b73defae';
    const enc = buffToStr(RSA1024encrypt(strToBuff(msj), public));
    const dec = buffToStr(RSA1024decrypt(strToBuff(enc), private));

    if (msj !== dec) return 'Archivos inválidos: no corresponden';

    PUBLIC_KEY_PATH = public;
    PRIVATE_KEY_PATH = private;

    return true;
  } catch (err) {
    return 'Archivos inválidos: archivos corruptos';
  }
}

function RSA1024encrypt(toEncrypt, localPathPublic) {
  const absolutePath = path.resolve(localPathPublic);
  const publicKey = fs.readFileSync(absolutePath, 'utf8');
  const encrypted = crypto.publicEncrypt(publicKey, toEncrypt);

  return encrypted;
}

function RSA1024decrypt(toDecrypt, localPathPrivate) {
  const absolutePath = path.resolve(localPathPrivate);
  const privateKey = fs.readFileSync(absolutePath, 'utf8');

  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey.toString(),
      passphrase: '',
    },
    toDecrypt
  );
  return decrypted;
}

function buffToStr(buffer) {
  return buffer.toString('hex');
}

function strToBuff(string) {
  return Buffer.from(string, 'hex');
}

async function RSA_OPRF(file) {
  return await hash(file);
}

async function protect(file) {
  const key = await RSA_OPRF(file);
  const encryptedFile = await AESencrypt(file, key);
  const pHash = buffToStr(await hash(encryptedFile));
  const pKey = buffToStr(await RSA1024encrypt(key, PUBLIC_KEY_PATH));

  const { dir, name } = separateDirAndName(encryptedFile);

  return { outDir: dir, outName: name, pKey, pHash };
}

async function recover(pFile, pKey) {
  const key = await RSA1024decrypt(strToBuff(key), PRIVATE_KEY_PATH);
  const File = await AESdecrypt(file, key);
}

module.exports = {
  protect,
  UPLOAD_PATH,
  DECRYPT_PATH,
  loadRSAPaths,
  areRsaKeys,
};
