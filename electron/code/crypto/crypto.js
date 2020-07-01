const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const { dialog } = require('electron');
const bigintModArith = require('bigint-mod-arith');

const {
  separateDirAndName,
  readUTF8File,
  removeFile,
} = require('../helpers/utils');
const { searchForKey, downloadFile } = require('../google-api/drive');
const { getPublicKey, postX } = require('../net/net');

const iv = strToBuff('36d6b93416b72e989359a5f0b73defde');
const e = 2946061206446183136035364744505844247510411120867004678223655427763264058485174539n;

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

function genRand(minimum, maximum) {
  let distance = maximum - minimum;
  let b;

  if (minimum >= maximum) {
    console.log('Minimum number should be less than maximum');
    return false;
  }

  let maxBytes = maximum.toString('16').length / 2;

  do {
    let randbytes = crypto.randomBytes(maxBytes).toString('hex');
    b = (BigInt(`0x${randbytes}`) % distance) + minimum;
  } while (bigintModArith.modInv(b, maximum) === NaN);

  return b;
}

function X(h, r, e, n) {
  // (h mod n)(r^e mod n) mod n
  let a = h % n;
  let b = bigintModArith.modPow(r, e, n);
  let x = (a * b) % n;

  return x;
}

function Z(y, r, n) {
  // (y mod n)(r^-1 mod n) mod n
  let a = y % n;
  let b = bigintModArith.modInv(r, n);
  let z = (a * b) % n;

  return z;
}

function validation(h, z, n) {
  return bigintModArith.modPow(z, e, n) === h;
}

function hashBigInt(z) {
  const hash = crypto.createHash('sha256');
  return new Promise((resolve, reject) => {
    hash.on('readable', () => {
      const data = hash.read();
      if (data) {
        resolve(hash.digest().toString('hex'));
      }
    });

    hash.write(z.toString('16'));
    hash.end();
  });
}

async function RSA_OPRF(file) {
  let h = BigInt(`0x${buffToStr(await hash(file))}`);
  let n = await getPublicKey();
  const r = genRand(0n, n);

  let x = X(h, r, e, n);
  let y = await postX(x);
  let z = Z(y, r, n);

  if (validation(h, z, K.n)) return await hashBigInt(z);
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
