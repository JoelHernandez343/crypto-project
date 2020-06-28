const fsAsync = require('fs').promises;
const path = require('path');
const ElectronGoogleOAuth2 = require('@getstation/electron-google-oauth2');

const OAUTH_PATH = path.join('electron', 'oauth');

let oauth_server;

const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.appdata',
];

const credentials = async () =>
  JSON.parse(
    await fsAsync.readFile(path.join(OAUTH_PATH, 'credentials.json'), {
      encoding: 'utf8',
    })
  );

const getToken = (client_id, client_secret, scopes) => {
  if (!oauth_server) {
    oauth_server = new ElectronGoogleOAuth2.default(
      client_id,
      client_secret,
      scopes
    );
  }

  return oauth_server.openAuthWindowAndGetTokens();
};

const googleLogIn = async () => {
  const {
    installed: { client_id, client_secret },
  } = await credentials();

  let token;

  try {
    token = await getToken(client_id, client_secret, [...SCOPES]);
  } catch (err) {
    console.log(err);
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

module.exports.googleLogIn = googleLogIn;
