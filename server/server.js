/**
 * Filename: server.js
 * Use: wrap all dependencies to loopback
 * Creator: core
 * Date: unknown
 */

'use strict';
require('dotenv').config();
const loopback = require('loopback');
const boot = require('loopback-boot');

const app = module.exports = loopback();

app.start = () => {
  // start the web server
  return app.listen(() => {
    app.emit('started');
    const baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      const explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
    console.log('Running in %s mode', process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'production') {
      console.log('Database is located in %s/%s',
        process.env.DB_PATH, process.env.DB_NAME);
      console.log('Files in %s, max size is %s ',
        process.env.FILES_PATH,
        process.env.FILES_MAX_SIZE);
      if (process.env.MAIL_CONNECTOR &&
        process.env.MAIL_HOST &&
        process.env.MAIL_PORT &&
        process.env.MAIL_AUTH_USER &&
        process.env.MAIL_AUTH_PASS) {
        console.log('Mail host: %s', process.env.MAIL_HOST);
      } else {
        console.log('Mail credentials missing!');
      }
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, (err) => {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
