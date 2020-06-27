const fsAsync = require('fs').promises;
const path = require('path');
const ElectronGoogleOAuth2 = require('@getstation/electron-google-oauth2');
const { Console } = require('console');

const OAUTH_PATH = path.join('public', 'oauth');

const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.appdata',
];

const initTokenDirectory = async () => {
  try {
    await fsAsync.mkdir(OAUTH_PATH, { recursive: true });
  } catch (err) {
    console.error(err);
  }
};

const credentials = async () =>
  JSON.parse(
    await fsAsync.readFile(path.join(OAUTH_PATH, 'credentials.json'), {
      encoding: 'utf8',
    })
  );

const getToken = (client_id, client_secret, scopes) => {
  const oauth = new ElectronGoogleOAuth2.default(
    client_id,
    client_secret,
    scopes
  );

  return oauth.openAuthWindowAndGetTokens();
};

const googleLogIn = async () => {
  const {
    installed: { client_id, client_secret },
  } = await credentials();

  let token;

  try {
    token = await getToken(client_id, client_secret, [...SCOPES]);
  } catch (err) {
    return 'Ocurrió un error desconocido mientras se hacia la validación con Google.';
  }

  const allowed = token.scope.split(' ');
  const blocked = SCOPES.filter(s => !allowed.includes(s));

  if (blocked.length != 0)
    return blocked.reduce((m, b) => {
      let name = b.slice(b.lastIndexOf('/') + 1);

      return `${m}\n${name}`;
    }, 'Los siguientes permisos no fueron autorizados:');

  await fsAsync.writeFile(
    path.join(OAUTH_PATH, 'token.json'),
    JSON.stringify(token),
    {
      encoding: 'utf8',
    }
  );

  console.log('Se guardó el archivo tokens.js');

  return true;
};

module.exports.initTokenDirectory = initTokenDirectory;
module.exports.googleLogIn = googleLogIn;
