const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const { dialog } = require('electron');

const {
  separateDirAndName,
  readUTF8File,
  removeFile,
} = require('../helpers/utils');
const { searchForKey, downloadFile } = require('../google-api/drive');

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

    r.on('open', () => r.pipe(encrypt).pipe(w));
    r.on('end', () => resolve(output));
    r.on('error', () => reject);
  });
}

function AESdecrypt(file, dest, key) {
  return new Promise((resolve, reject) => {
    let output = path.join(
      dest,
      `${file.replace(/^.*[\\\/]/, '').replace(/\.crp$/, '')}`
    );

    let w = fs.createWriteStream(output);
    let r = fs.createReadStream(file, { encoding: null });

    let decrypt = crypto.createDecipheriv('aes-256-ctr', key, iv);

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

async function recover(file, destDir) {
  let externKey = await searchForKey(file.hash);
  if (!externKey) return 'Error fatal: no se encontró la llave';

  try {
    await downloadFile(file.id, DECRYPT_PATH, file.name);
    await downloadFile(externKey.id, DECRYPT_PATH, externKey.name);
  } catch (err) {
    return err;
  }

  let pKey = await readUTF8File(DECRYPT_PATH, externKey.name);

  const key = await RSA1024decrypt(strToBuff(pKey), PRIVATE_KEY_PATH);
  const recovered = await AESdecrypt(
    path.join(DECRYPT_PATH, file.name),
    destDir,
    key
  );

  console.log(`File decrypted at ${destDir}`);

  await removeFile({ dir: DECRYPT_PATH, name: file.name });
  await removeFile({ dir: DECRYPT_PATH, name: externKey.name });

  console.log(`Cleaned`);

  return true;
}

module.exports = {
  protect,
  UPLOAD_PATH,
  DECRYPT_PATH,
  loadRSAPaths,
  areRsaKeys,
  recover,
};
