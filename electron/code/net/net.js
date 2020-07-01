const http = require('http');

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
    let req = http.request(options, res => {
      res
        .setEncoding('utf8')
        .on('data', chunk => (response += chunk))
        .on('error', reject)
        .on('end', () => {
          try {
            console.log('n:', response);
            let ans = JSON.parse(response);
            resolve(BigInt(`0x${ans.publicKey}`));
          } catch (err) {
            reject(err);
          }
        });
    });
    req.on('error', reject);
    req.end();
  });
}

async function postX(x) {
  let json = JSON.stringify({
    x: x.toString('16'),
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
    let req = http.request(options, res => {
      res
        .setEncoding('utf8')
        .on('data', chunk => (response += chunk))
        .on('error', reject)
        .on('end', () => {
          try {
            console.log(('y:', response));
            let ans = JSON.parse(response);
            resolve(BigInt(`0x${ans.y}`));
          } catch (err) {
            reject(err);
          }
        });
    });
    req.write(json);
    req.on('error', reject);
    req.end();
  });
}

module.exports = {
  getPublicKey,
  postX,
};
