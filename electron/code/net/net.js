const http = require('http');

function get(options, cb) {
  let output = '';

  let req = http.request(options, res => {
    res.setEncoding('utf8');
    res.on('data', chunk => (output += chunk));
    res.on('end', () => {
      cb(res.statusCode, output);
    });
  });

  req.on('error', err => console.log(err));
  req.end();
}

async function getPublicKey() {
  let options = {
    host: '127.0.0.1',
    port: '4000',
    path: '/public',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let response = '';

  return new Promise((resolve, reject) => {
    http
      .request(options, res => {
        res
          .setEncoding('utf8')
          .on('data', chunk => (response += chunk))
          .on('error', reject)
          .on('end', () => {
            try {
              let ans = JSON.parse(response);
              resolve(BigInt(`0x${ans.publicKey}`));
            } catch (err) {
              reject(err);
            }
          });
      })
      .on('error', reject)
      .end();
  });
}

async function postX(x) {
  let json = JSON.stringify({
    x: x.toString('hex'),
  });

  let options = {
    host: '127.0.0.1',
    port: '4000',
    path: '/key',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(json),
    },
  };

  let response = '';

  return new Promise((resolve, reject) => {
    http
      .request(options, res => {
        res
          .setEncoding('utf8')
          .on('data', chunk => (response += chunk))
          .on('error', reject)
          .on('end', () => {
            try {
              let ans = JSON.parse(response);
              resolve(BigInt(`0x${ans.y}`));
            } catch (err) {
              reject(err);
            }
          });
      })
      .write(json)
      .end();
  });
}

module.exports = {
  getPublicKey,
  postX,
};
