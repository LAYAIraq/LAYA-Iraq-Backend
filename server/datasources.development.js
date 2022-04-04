'use strict';
module.exports = {
  mail: {
    name: 'mail',
    connector: 'mail',
    transports: [{
      type: 'smtp',
      host: process.env.MAIL_HOST || 'mock@laya-mail.com',
      secure: process.env.MAIL_PORT != 587,
      port: process.env.MAIL_PORT || 183,
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        user: process.env.MAIL_AUTH_USER || 'laya-user',
        pass: process.env.MAIL_AUTH_PASS || 'secret',
      },
    }],
  },
};
