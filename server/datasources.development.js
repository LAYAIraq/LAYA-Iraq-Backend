'use strict';
module.exports = {
  mail: {
    name: 'mail',
    connector: 'mail',
    transports: [{
      type: 'smtp',
      host: 'webmail.informatik.hu-berlin.de',
      secure: false,
      port: 587,
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
