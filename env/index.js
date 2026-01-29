const fs = require('fs');

const env = process.argv[2];

const root = process.cwd();

if (!env || env === 'development' || env === 'dev') {
  fs.copyFile(`${root}/env/env.development.txt`, `${root}/.env`, (err) => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log('Development env setup done !!!');
  });
  return;
}

if (env === 'production' || env === 'prod') {
  fs.copyFile(`${root}/env/env.production.txt`, `${root}/.env`, (err) => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log('Production env setup done !!!');
  });
  return;
}

if (env === 'local') {
  fs.copyFile(`${root}/env/env.local.txt`, `${root}/.env`, (err) => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log('Local env setup done !!!');
  });
  return;
}

console.error(`${env}: Invalid env. Please provide valid env.`);
