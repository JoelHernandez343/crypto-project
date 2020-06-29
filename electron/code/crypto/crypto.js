const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const { dialog } = require('electron');

const { separateDirAndName } = require('../helpers/utils');

const iv = stringToBuffer('36d6b93416b72e989359a5f0b73defde');
const publicKey = stringToBuffer(
  '30818902818100cd8eece87cc7ae82dd6cb91a7c4465e18e7b097eba6ce468d3d1c8c2ef1d9cf7a2992d6e081fb37618373670ca1f591d46044334add6eb24fd7e1f5b5b5f60c6709e02696f4d5a788eb8b83011beae3d145e79e6992160859b948adda56b0fbdedf1264dbdc39d90a7be26ee38bc138f6d28fbab00b25f781ac7d835b2877dd90203010101'
);
const privateKey = stringToBuffer(
  '308202dd305706092a864886f70d01050d304a302906092a864886f70d01050c301c0408362402345ff4de0602020800300c06082a864886f70d02090500301d060960864801650304011604106a2197519a4f4051b63d9a2e83a401a604820280c0557ec80f5cf7a67224ab43e2a85e6ca25822545f7c1816103276c74fdf15b6582cbf997693ea2fc278591ff7a6a21056c75447cbaf782d818a672c2a64254674d7ad5c655d4c63731ac7525867ac89eea81a74209c37cd2cca78c3c4790d42d5bfcea25fc7354c908391e48aa032d28923b9fecf38558e03af28bca4cc0476091998014bf0970e1cadffdb6ec1b4b1592c443d4b33dcf6fdfb3459a50f484ed1d93060bbed3eec0aff3b1b850ff69b9e9c4a62cacbce0bbe64d370d5474e122d4f2f9bbcfeae057b0e02e52c28ccc04af01480998cb360aed787ecafda4ccc96114808cfc833ffeb025e7ad40c383751e00b7c01c3685d1730feb6d2e2ce43919f009185e954494dbcf68baccac66c26013a075dfa6d3b344b4f40a85c048bc7d377c1acc46bfbf525461afe63e8e504b644a78fe42775881fe0fcaeae670cbff1d96e1ba32179c07e481064e109da50e929e21d46f80316fa57faef2d7087a801135e7978a151da51384aca0cbfd21272352e852a872e7223108d31e959d6183accba4373edc2cfd08a0c6a54d73aef5384839a56cc79bb0bc0aef4ab1ffa4368d2d00bfed81790787c84a08ef66e4246c003f012a33ef635d5d2cfd187b77175767814df9aa0333277e80640b0ac482b4aa754ba040dbd6c15a89d677e5fafd7769708e123dce4becfdd2f1f886721f4bed9776d2f2e52789ef397802776e2442f1152a3ba4065e3018aa42ebec2750e6d6cbc2f4609e8ba1676583d56fc4f9e2ad1dd0f994636aa46ebe6ef97df069448a982ffb633fc188555cff658cf25822b1269cf6df867a542dd86b5a39959ea38bd9c2bdcd213a0078c0ab875632ee35744c80475e3e1f158de43b64348d0aa2b72d1a6ced057f7914b0e028094'
);

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

async function loadRSAPaths() {
  const public = (
    await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
    })
  ).filePaths[0];

  if (!public) return 'No se seleccionó ningún archivo';

  const private = (
    await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
    })
  ).filePaths[0];

  if (!private) return 'No se seleccionó ningún archivo';

  try {
    const msj = '36d6b93416b72e989359a5f0b73defae';
    const enc = RSA1024encrypt(stringToBuffer(msj), public);
    const dec = RSA1024decrypt(stringToBuffer(enc), private);

    if (msj != dec) return 'Archivos inválidos.';

    PUBLIC_KEY_PATH = public;
    PRIVATE_KEY_PATH = private;

    return true;
  } catch (err) {
    return 'Archivos inválidos';
  }
}

function RSA1024encrypt(toEncrypt, localPathPublic) {
  const absolutePath = path.resolve(localPathPublic);
  const publicKey = fs.readFileSync(absolutePath, 'utf8');
  const encrypted = crypto.publicEncrypt(publicKey, toEncrypt);

  return bufferToString(encrypted);
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
  return bufferToString(decrypted);
}

function bufferToString(buffer) {
  return buffer.toString('hex');
}

function stringToBuffer(string) {
  return Buffer.from(string, 'hex');
}

async function RSA_OPRF(file) {
  return await hash(file);
}

async function protect(file) {
  const key = await RSA_OPRF(file);
  const output = await AESencrypt(file, key);
  const pHash = bufferToString(await hash(output));
  const pKey = bufferToString(await RSAencrypt(key, publicKey));

  const { dir, name } = output;

  return { outDir: dir, outName: name, pKey, pHash };
}

module.exports = { protect, UPLOAD_PATH, DECRYPT_PATH, loadRSAPaths };
