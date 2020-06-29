const { google } = require('googleapis');
const { fetchImage } = require('../helpers/utils');

function getPersonalInfo(auth) {
  return new Promise((resolve, reject) => {
    const oauth2 = google.oauth2({
      auth,
      version: 'v2',
    });

    oauth2.userinfo.get((err, res) => (err ? reject(err) : resolve(res)));
  });
}

function saveProfilePic({ picture }, path) {
  return fetchImage(picture, path);
}

module.exports = {
  getPersonalInfo,
  saveProfilePic,
};
