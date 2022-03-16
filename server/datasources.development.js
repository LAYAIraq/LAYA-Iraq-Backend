'use strict';
module.exports = {
  mail: {
    name: 'mail',
    connector: 'mail',
    transports: [{
      type: 'smtp',
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
};
