'use strict';
module.exports = {
  mail: {
    name: 'mail',
    connector: 'mail',
    transports: [{
      type: process.env.MAIL_CONNECTOR,
      host: process.env.MAIL_HOST,
      secure: process.env.MAIL_PORT != 587,
      port: process.env.MAIL_PORT,
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        user: process.env.MAIL_AUTH_USER,
        pass: process.env.MAIL_AUTH_PASS,
      },
    }],
  },
  sqlite: {
    // eslint-disable-next-line camelcase
    file_name: process.env.DB_PATH + '/' + process.env.DB_NAME,
    debug: false,
  },
  files: {
    name: 'files',
    connector: 'loopback-component-storage',
    provider: 'filesystem',
    nameConflict: 'makeUnique',
    root: process.env.FILES_PATH || './server/files',
    maxFileSize: process.env.FILES_MAX_SIZE || 500000000,
  },
};
