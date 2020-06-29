const { google } = require('googleapis');
const { fetchImage } = require('../helpers/utils');

const getPersonalInfo = auth =>
  new Promise((resolve, reject) => {
    const oauth2 = google.oauth2({
      auth,
      version: 'v2',
    });

    oauth2.userinfo.get((err, res) => (err ? reject(err) : resolve(res)));
  });

const saveProfilePic = ({ picture }, path) => fetchImage(picture, path);

module.exports = {
  getPersonalInfo,
  saveProfilePic,
};
