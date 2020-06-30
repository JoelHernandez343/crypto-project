const ElectronGoogleOAuth2 = require('@getstation/electron-google-oauth2');
const fsAsync = require('fs').promises;
const { google } = require('googleapis');
const path = require('path');

const {
  readJSON,
  writeDirAndJSON,
  loadLocalImage,
} = require('../helpers/utils');
const { getPersonalInfo, saveProfilePic } = require('./profile');

const OAUTH_PATH = path.join('electron', 'oauth');
const CREDENTIALS_PATH = path.join(OAUTH_PATH, 'credentials.json');
const OAUTH_USER = path.join(OAUTH_PATH, 'user');
const TOKEN_FILE = path.join(OAUTH_USER, 'token.json');
const USER_INFO = path.join(OAUTH_USER, 'information.json');
const USER_PIC = path.join(OAUTH_USER, 'picture');

let oauth_server;
let authentification = {};

const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.appdata',
];

const getCredentials = async () => readJSON(CREDENTIALS_PATH);

const getToken = async () => readJSON(TOKEN_FILE);

const googleLogIn = (client_id, client_secret, scopes) => {
  if (!oauth_server) {
    oauth_server = new ElectronGoogleOAuth2.default(
      client_id,
      client_secret,
      scopes
    );
  }

  return oauth_server.openAuthWindowAndGetTokens();
};

const getNewToken = async credentials => {
  const {
    installed: { client_id, client_secret },
  } = credentials;

  try {
    const token = await googleLogIn(client_id, client_secret, [...SCOPES]);
    const allowed = token.scope.split(' ');
    const blocked = SCOPES.filter(s => !allowed.includes(s));

    if (blocked.length !== 0)
      return blocked.reduce((m, b) => {
        let name = b.slice(b.lastIndexOf('/') + 1);

        return `${m}<br>${name}`;
      }, 'Los siguientes permisos no fueron autorizados:');

    await writeDirAndJSON(token, OAUTH_USER, 'token.json');

    return token;
  } catch (err) {
    console.log(err);

    return 'Ocurrió un error desconocido mientras se hacia la validación con Google.';
  }
};

const defaultUser = async () => ({
  name: 'No ha ingresado',
  email: 'Ingrese a Google Drive',
  image: await loadLocalImage(
    path.join(OAUTH_PATH, 'default_profile.jpg'),
    'jpg'
  ),
  status: 'disconnected',
});

const logSession = async () => {
  const credentials = await getCredentials();

  const token = await getNewToken(credentials);
  if (typeof token === 'string') return token;

  const {
    installed: { client_id, client_secret, redirect_uris },
  } = credentials;

  authentification.auth = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  authentification.auth.setCredentials(token);

  let info = (await getPersonalInfo(authentification.auth)).data;

  await saveProfilePic(info, USER_PIC);
  info.pictureFile = USER_PIC;

  await writeDirAndJSON(info, OAUTH_USER, 'information.json');

  return {
    name: info.name,
    email: info.email,
    image: await loadLocalImage(USER_PIC, 'jpg'),
    status: 'connected',
  };
};

const loadSession = async () => {
  try {
    const {
      installed: { client_id, client_secret, redirect_uris },
    } = await getCredentials();

    authentification.auth = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );
    authentification.auth.setCredentials(await readJSON(TOKEN_FILE));

    const info = await readJSON(USER_INFO);

    return {
      name: info.name,
      email: info.email,
      image: await loadLocalImage(info.pictureFile, 'jpg'),
      status: 'connected',
    };
  } catch (err) {
    console.log('No se pudo cargar la sesión');
    return await defaultUser();
  }
};

const closeSession = async () => {
  authentification.auth = undefined;
  await fsAsync.rmdir(OAUTH_USER, { recursive: true });
};

module.exports = {
  logSession,
  loadSession,
  closeSession,
  defaultUser,
  authentification,
};
